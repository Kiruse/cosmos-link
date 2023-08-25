import * as fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import * as path from 'path';

import { verifyADR36Amino } from '@keplr-wallet/cosmos';

import { getLoginMessage, testTokenID, UserPayload } from './_common';

import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface TokenOptions {
  /**
   * When the token expires. Defaults to 7 days.
   * - If it's a string, it must be a supported format (eg '7d', '6h', '30m'...).
   * - If it's a number, it must be the duration in seconds.
   * - If it's a Date, it must be the date at which the token expires.
   */
  expires?: string | number | Date;
}

// Receives a signed message from the client and returns a token.
// THIS DOES NOT CREATE A USER ACCOUNT, because we support different types of accounts
// (currently anonymous & wallet accounts).
// Thus, the client decides whether to create a new account, or to upgrade an existing anon account
// by making a new request to either /api/v1/login or /api/v1/upgrade.
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method not allowed');
  if (req.headers['content-type'] !== 'application/json')
    return res.status(400).end('Bad request');

  const payload = req.body;
  if (['algo', 'addr', 'pubKey', 'sig'].some(key => typeof payload[key] !== 'string'))
    return res.status(422).end('Invalid payload');

  try {
    payload.pubKey = Buffer.from(payload.pubKey, 'base64');
    payload.sig    = Buffer.from(payload.sig,    'base64');
  } catch {
    return res.status(422).end('Invalid payload');
  }

  const { algo, addr, pubKey, sig, tid } = payload;
  const bech32Prefix = addr.split('1', 2)[0];
  const isValid = verifyADR36Amino(
    bech32Prefix,
    addr,
    getLoginMessage(addr),
    pubKey,
    sig,
    algo,
  );
  if (!isValid) {
    return res.status(401).end('Invalid signature');
  }

  // separate variable here for TS type checking
  const token = createToken({
    type: 'wallet',
    address: addr,
  });

  // temporarily store token under an TID
  // this allows getting token from a different device provided the client knows the TID
  if (!testTokenID(tid))
    return res.status(422).end('Invalid TID');
  const { kv } = await import('@vercel/kv');
  await kv.set(tid, token);

  return res.status(201).end(token);
}

//#region Token Helpers
let CERTPEM: string | undefined;
async function getCert() {
  if (CERTPEM) return CERTPEM;
  CERTPEM = await fs.readFile(path.join(__dirname, '../../assets/public/cosmos-link.pem'), 'utf8');
  return CERTPEM
}

export function createToken(payload: UserPayload, opts: TokenOptions = {}) {
  if (!process.env.SECRET_PEM) throw Error('No secret PEM');

  let expires = opts.expires ?? '7d';
  if (expires instanceof Date)
    expires = Math.floor((Date.now() - expires.getTime()) / 1000);

  return jwt.sign(
    payload,
    process.env.SECRET_PEM!,
    {
      algorithm: 'ES256',
      expiresIn: expires,
    },
  );
}

export async function verifyToken(token: string) {
  try {
    return jwt.verify(token, await getCert(), {
      algorithms: ['ES256'],
    }) as UserPayload;
  } catch (err: any) {
    const knownMessages = [
      'jwt expired', 'jwt malformed',
      'invalid token', 'invalid signature',
    ];
    if (!knownMessages.includes(err.message)) {
      console.log(`Error while verifying token ${token}:`, err);
    }
    return null;
  }
}

export async function getUserFilter(payload: UserPayload) {
  switch (payload.type) {
    case 'wallet':
      return { address: payload.address };
    case 'anonymous':
      return { _id: new ObjectId(payload.id) };
    default:
      throw Error(`Unhandled user type: ${(payload as any).type}`);
  }
}
//#endregion Token Helpers
