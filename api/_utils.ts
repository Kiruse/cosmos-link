import { VercelRequest } from "@vercel/node";

export const getAuthToken = (req: VercelRequest) =>
  req.headers['authorization']?.replace('Bearer ', '');
