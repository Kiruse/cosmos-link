import { VercelRequest, VercelResponse } from '@vercel/node'
import { createToken, verifyToken } from './token';
import { getAuthToken } from '../_utils';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method not allowed');

  const token = getAuthToken(req);
  if (!token)
    return res.status(401).end('Unauthorized');

  const payload = await verifyToken(token) as any;
  if (!payload)
    return res.status(401).end('Unauthorized');

  // in the following computations, we know the target date at which the tokens expire (by type).
  // so if we say refreshing happens after 7d on a token that expires after 30d, we must subtract
  // 23d from the target date to get the earliest possible refresh date.
  let shouldRefresh = true;
  switch (payload.type) {
    case 'anonymous': {
      // refresh earliest after 7d
      shouldRefresh = (payload.exp - 3600 * 24 * 23) >= Date.now();
      break;
    }
    case 'wallet': {
      // refresh earliest after 1d
      shouldRefresh = (payload.exp - 3600 * 24 * 6) >= Date.now();
      break;
    }
  }

  if (!shouldRefresh) {
    return res.status(200).end(token);
  }

  delete payload.exp; // delete existing exp to create a new one

  // anon users get 30d because they are not recoverable
  const expires = payload.type === 'anonymous' ? '30d' : undefined;
  const newToken = createToken(payload, { expires });
  return res.status(200).end(newToken);
}
