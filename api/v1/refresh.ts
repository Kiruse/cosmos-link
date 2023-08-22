import { VercelRequest, VercelResponse } from '@vercel/node'
import { createToken, verifyToken } from './token';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method not allowed');
  if (req.headers['content-type'] !== 'text/plain')
    return res.status(400).end('Bad request');

  const token = req.body;
  const payload = await verifyToken(token);
  if (!payload)
    return res.status(401).end('Unauthorized');

  // anon users get 30d because they are not recoverable
  const expires = payload.type === 'anonymous' ? '30d' : undefined;
  const newToken = createToken(payload, { expires });
  return res.status(200).end(newToken);
}
