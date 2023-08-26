import { ObjectId } from 'mongodb';

import { VercelRequest, VercelResponse } from '@vercel/node';

import { collection } from './_mongodb';
import { getUserFilter, verifyToken } from './token';
import { getAuthToken } from '../_utils';

// Upgrade an anonymous account to a wallet-based account
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method not allowed');
  if (req.headers['content-type'] !== 'text/plain')
    return res.status(400).end('Bad request');

  const anonToken = getAuthToken(req);
  const walletToken = req.body;
  if (!anonToken || !walletToken)
    return res.status(422).end('Invalid payload');

  const [anonPayload, walletPayload] = await Promise.all([
    verifyToken(anonToken),
    verifyToken(walletToken),
  ]);
  if (!anonPayload || !walletPayload)
    return res.status(401).end('Unauthorized');
  if (anonPayload.type !== 'anonymous' || walletPayload.type !== 'wallet')
    return res.status(401).end('Unauthorized');

  const coll = await collection('users');
  const doc = await coll.findOne({ address: walletPayload.address });
  if (!doc) {
    await coll.updateOne(getUserFilter(anonPayload), {
      $set: {
        type: 'wallet',
        address: walletPayload.address,
        lastLogin: new Date(),
      },
      $unset: { lastAnonLogin: '' },
    });
  }

  return res.status(200).end('OK');
}
