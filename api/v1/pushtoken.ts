import { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyToken } from './token';
import { collection } from './_mongodb';
import { getAuthToken } from '../_utils';
import { ObjectId } from 'mongodb';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  switch (req.method) {
    case 'POST':   return handlePost(req, res);
    case 'DELETE': return handleDelete(req, res);
    default:
      return res.status(405).end(`Method not allowed`);
  }
}

async function handlePost(req: VercelRequest, res: VercelResponse) {
  if (req.headers['content-type'] !== 'application/json')
    return res.status(400).end('Bad Request');

  const token = getAuthToken(req);
  if (!token)
    return res.status(401).end('Unauthorized');

  const { project, pushtoken } = req.body;
  if (typeof pushtoken !== 'string' || typeof project !== 'string')
    return res.status(422).end('Invalid payload');

  const tokenPayload = await verifyToken(token);
  if (!tokenPayload)
    return res.status(401).end('Unauthorized');
  if (!testPushToken(pushtoken))
    return res.status(422).end('Invalid push token');

  const coll = await collection('users');
  const { matchedCount } = await coll.updateOne(
    { _id: new ObjectId(tokenPayload.sub) },
    {
      $addToSet: { [`pushtokens.${project}`]: pushtoken }
    },
  );
  if (matchedCount === 0)
    return res.status(404).end('User not found');

  return res.status(201).end('OK');
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  if (req.headers['content-type'] !== 'application/json')
    return res.status(400).end('Bad Request');

  const token = getAuthToken(req);
  if (!token)
    return res.status(401).end('Unauthorized');

  const { project, pushtoken } = req.body;
  if (typeof pushtoken !== 'string' || typeof project !== 'string')
    return res.status(422).end('Invalid payload');

  const tokenPayload = await verifyToken(token);
  if (!tokenPayload)
    return res.status(401).end('Unauthorized');

  const coll = await collection('users');
  await coll.updateOne(
    { _id: new ObjectId(tokenPayload.sub) },
    {
      $pullAll: { [`pushtokens.${project}`]: [pushtoken] }
    }
  );

  return res.status(200).end('OK');
}

const testPushToken = (token: string) => /^ExponentPushToken\[.+\]$/.test(token);
