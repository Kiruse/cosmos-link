import type { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken';

import { verifyADR36Amino } from '@keplr-wallet/cosmos';

import { getLoginMessage, testTokenID } from './_common';

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

  const token = jwt.sign(
    {
      address: addr,
    },
    process.env.SECRET_PEM!,
    {
      algorithm: 'ES256',
      expiresIn: '7d',
    },
  );

  // temporarily store token under an TID
  // this allows getting token from a different device provided the client knows the TID
  if (!testTokenID(tid))
    return res.status(422).end('Invalid TID');
  const { kv } = await import('@vercel/kv');
  await kv.set(tid, token);

  return res.status(201).end(token);
}
