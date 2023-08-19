import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyADR36Amino } from '@keplr-wallet/cosmos'
import jwt from 'jsonwebtoken'
import { getLoginMessage } from './_common';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed');
    return;
  }

  if (req.headers['content-type'] !== 'application/json') {
    res.status(400).end('Bad request');
    return;
  }

  const payload = req.body;
  if (['algo', 'addr', 'pubKey', 'sig'].some(key => typeof payload[key] !== 'string')) {
    res.status(422).end('Invalid payload');
    return;
  }

  try {
    payload.pubKey = Buffer.from(payload.pubKey, 'base64');
    payload.sig    = Buffer.from(payload.sig,    'base64');
  } catch {
    res.status(422).end('Invalid payload');
    return;
  }

  const { algo, addr, pubKey, sig } = payload;
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

  return res.status(201).end(token);
}
