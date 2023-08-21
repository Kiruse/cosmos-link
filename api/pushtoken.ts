import { VercelRequest, VercelResponse } from '@vercel/node'
import { getUserFilter, verifyToken } from './token';
import { collection } from './_mongodb';

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

  const { project, token, pushtoken } = req.body;
  if (typeof token !== 'string' || typeof pushtoken !== 'string')
    return res.status(422).end('Invalid payload');

  const tokenPayload = await verifyToken(token);
  if (!tokenPayload)
    return res.status(401).end('Unauthorized');
  if (!testPushToken(pushtoken))
    return res.status(422).end('Invalid push token');

  (await collection('pushtokens')).updateOne(
    getUserFilter(tokenPayload),
    {
      $addToSet: { [project]: pushtoken }
    },
  );

  return res.status(201).end('OK');
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  if (req.headers['content-type'] !== 'application/json')
    return res.status(400).end('Bad Request');

  const { project, token, pushtoken } = req.body;
  if (typeof token !== 'string' || typeof pushtoken !== 'string')
    return res.status(422).end('Invalid payload');

  const tokenPayload = await verifyToken(token);
  if (!tokenPayload)
    return res.status(401).end('Unauthorized');

  (await collection('pushtokens')).updateOne(
    getUserFilter(tokenPayload),
    {
      $pullAll: { [project]: [pushtoken] }
    }
  );

  return res.status(200).end('OK');
}

const testPushToken = (token: string) => /^ExponentPushToken\[.+\]$/.test(token);
