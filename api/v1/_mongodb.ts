import { DbOptions, MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI envar not defined');

const client = new MongoClient(uri, {});

export default async function mongodb(db?: string, opts?: DbOptions) {
  await client.connect();
  return client.db(db, opts);
}

export async function collection(name: string) {
  const db = await mongodb();
  return db.collection(name);
}
