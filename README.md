# Cosmos Link
**Cosmos Link** allows users to associate an arbitrary account with a Cosmos blockchain wallet address as its owner.

*Cosmos Link* uses two possible types of **Proof of Ownership:**

1. **Gasless:** Wallet is prompted to sign a specific message. EVM wallets already support this. In the Cosmos, the experimental [ADR 036 proposal](https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-036-arbitrary-signature.md) is used.
2. **On-chain:** If the *gasless* solution above is not supported by a wallet, it can instead be prompted to encrypt a secret message and leave it on-chain, e.g. in a transaction memo or in a smart contract based registry.

## State of this Project
*Cosmos Link* currently only supports *Proof of Ownership (1)*, and is designed only to be used with my own projects. If interested in using *Cosmos Link* for your own project, shoot me a DM.

## Endpoints
Following are the various API Endpoints which *Cosmos Link* publicly exposes via HTTPS. It specifies *Parameters*, *Body*, and *Response*. If one of these are missing, it is not expected by the server.

### `POST /token/gasless`
Post proof of ownership with an off-chain gasless signed message & receive a new token. Much like *Time-based One Time Passwords (TOTP)* generated by authenticator apps like *Authy*, the message is the current 30-second interval since the start of the epoch.

#### Body
The signed ADR 036 as `text/plain`.

#### Response
| Status | Reason                 | Content Type / Body       |
| -----: | ---------------------- | ------------------------- |
|    200 | Success                | `text/plain` - JWT token. |
|    401 | Authentication failed. | *none*                    |

### `GET /public-key`
JWTs produced by *Cosmos Link* can be verified using the ES256 algorithm and the public key found here. See below for a JavaScript example using the `jsonwebtoken` library.

**Response:** The RSA PEM certificate. Unless the underlying private key is compromised, this certificate will always be valid. `Cache-Control` header is set to `max-age=7776000` or 90 days.

**JavaScript Example:**
```javascript
const jwt = require('jsonwebtoken')
const token = '...' // some JWT received prior

async function verifyToken() {
  const pub = await fetch('https://cosmos-link.kiruse.dev/public-key');
  try {
    const decoded = jwt.verify(token, pub, { algorithm: 'ES256' });
    return decoded;
  } catch (err) {
    // error thrown if token illegitimate or invalid
    console.error(err);
  }
}
```
