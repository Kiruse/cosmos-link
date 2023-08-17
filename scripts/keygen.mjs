#!/usr/bin/env node
import { KeyObject, subtle } from 'crypto'
import * as fs from 'fs/promises'

const PATH_PRIV = new URL('../.keyfile', import.meta.url);
const PATH_PUB = new URL('../assets/public/cosmos-link.pem', import.meta.url);

const key = await subtle.generateKey({
  name: 'ECDSA',
  namedCurve: 'P-256',
  hash: 'SHA-256',
  length: 256,
}, true, ['sign', 'verify']);

await fs.writeFile(
  PATH_PRIV,
  KeyObject.from(key.privateKey).export({ format: 'pem', type: 'pkcs8' }),
);
await fs.chmod(PATH_PRIV, 0o400);

await fs.writeFile(
  PATH_PUB,
  KeyObject.from(key.publicKey).export({ format: 'pem', type: 'spki' }),
);
await fs.chmod(PATH_PUB, 0o444);
