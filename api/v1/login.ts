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
    sub: id.toHexString(),
  }, {
    // anon users get 30d because they are not recoverable
    expires: '30d',
  });

  const coll = await collection('users');
  await coll.insertOne({
    _id: id,
    type: 'anonymous',
    lastLogin: new Date(),
    lastAnonLogin: new Date(), // used for ttl
  });

  return res
    .status(201)
    .setHeader('Content-Type', 'text/plain')
    .setHeader('Cache-Control', 'no-store')
    .end(token);
}

async function handlePostAnonymous(req: VercelRequest, res: VercelResponse) {
  if (req.headers['content-type'] !== 'text/plain')
    return res.status(400).end('Bad request');

  const token = req.body;
  const payload = await verifyToken(token);
  if (!payload || payload.type !== 'anonymous')
    return res.status(401).end('Unauthorized');

  const coll = await collection('users');
  await coll.findOneAndUpdate(
    { _id: new ObjectId(payload.sub) },
    {
      $set: {
        lastLogin: new Date(),
        lastAnonLogin: new Date(),
      },
    },
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
  const { matchedCount } = await coll.updateOne(
    { address: addr },
    { $set: { lastLogin: new Date() } },
    { upsert: true },
  );

  if (matchedCount === 0) {
    return res.status(401).end('Unauthorized');
  } else {
    return res.status(200).end('OK');
  }
}
//#endregion Wallet Login
