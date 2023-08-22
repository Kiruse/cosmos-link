import rng from 'seedrandom'

export type UserPayload = WalletUserPayload | AnonUserPayload;

export type WalletUserPayload = {
  type: 'wallet';
  address: string;
}

export type AnonUserPayload = {
  type: 'anonymous';
  id: string;
}

/**
 * TOTP period duration. Must be long enough to allow sufficient time for signing, sending &
 * processing the message, but short enough to prevent replay attacks.
 */
export const PERIOD_DURATION = 60000;

export function getLoginMessage(addr: string) {
  return `I certify ownership over wallet ${addr}.\n\nCode: ${getCode()}`
}

/**
 * Code is a TOTP deterministic randomized character sequence.
 * Must be deterministic so the server & client can compute the same code/message independently.
 */
export function getCode() {
  const period = Math.floor(Date.now() / PERIOD_DURATION);
  const rnd = rng(`P${period}`, { entropy: false });
  return rnd().toString(36).toUpperCase().slice(2, 10);
}

export const testTokenID = (tid: string) => /^[a-z]+ [a-z]+ [0-9]{3}$/.test(tid);
