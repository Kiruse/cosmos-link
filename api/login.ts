import { ObjectId } from 'mongodb';

import { VercelRequest, VercelResponse } from '@vercel/node';

import { collection } from './_mongodb';
import { createToken, verifyToken } from './token';

// Login either anonymously or with a wallet address, based on the type query.
// If undefined, assumes 'wallet'. Other values are illegal and prompt a 400 status code.
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const type = req.query.type;
  switch (type) {
    case 'anonymous':
      return handleAnonymous(req, res);
    case undefined:
    case 'wallet':
      return handleWallet(req, res);
    default:
      return res.status(400).end('Bad request');
  }
}

//#region Anon Login
async function handleAnonymous(req: VercelRequest, res: VercelResponse) {
  switch (req.method) {
    case 'GET':
      return handleGetAnonymous(req, res);
    case 'POST':
      return handlePostAnonymous(req, res);
    default:
      return res.status(405).end('Method not allowed');
  }
}

async function handleGetAnonymous(req: VercelRequest, res: VercelResponse) {
  const id = new ObjectId();

  const token = createToken({
    type: 'anonymous',
    id: id.toString(),
  }, {
    // anon users get 30d because they are not recoverable
    expires: '30d',
  });

  (await collection('users')).insertOne({
    _id: id,
    type: 'anonymous',
  });

  return res.status(201).end(token);
}

async function handlePostAnonymous(req: VercelRequest, res: VercelResponse) {
  if (req.headers['content-type'] !== 'text/plain')
    return res.status(400).end('Bad request');

  const token = req.body;
  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'anonymous')
    return res.status(401).end('Unauthorized');

  (await collection('users')).findOneAndUpdate(
    { _id: new ObjectId(payload.id) },
    { $set: { lastLogin: new Date() } },
    { returnDocument: 'after' },
  );

  return res.status(200).end('OK');
}
//#endregion Anon Login

//#region Wallet Login
async function handleWallet(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST')
    return res.status(405).end('Method not allowed');
  if (req.headers['content-type'] !== 'text/plain')
    return res.status(400).end('Bad request');

  const token = req.body;
  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'wallet')
    return res.status(401).end('Unauthorized');

  const addr = payload.address;
  if (!addr) throw Error('No address in payload');

  const coll = await collection('users');
  await coll.findOneAndUpdate(
    { address: addr },
    { $set: { lastLogin: new Date() } },
    { returnDocument: 'after' },
  );

  return res.status(200).end('OK');
}
//#endregion Wallet Login
