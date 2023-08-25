import { VercelRequest, VercelResponse } from '@vercel/node';

import { testTokenID } from './_common';

// recover token from tid - must be POST in order to protect the tid from being leaked
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST')
    return res.status(405).end('Method not allowed');
  if (req.headers['content-type'] !== 'text/plain')
    return res.status(400).end('Bad request');

  const tid = req.body;
  if (!testTokenID(tid))
    return res.status(422).end('Invalid payload');

  const { kv } = await import('@vercel/kv');
  try {
    const token = await kv.getdel(tid);
    if (token)
      return res.status(200).end(token);
    else
      return res.status(404).end('Not found');
  } catch (err) {
    return res.status(404).end('Not found');
  }
}
