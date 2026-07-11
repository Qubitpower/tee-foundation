// Remote attestation, simplified: the cryptographic part of proving "this
// specific code is running inside a genuine enclave," made real and
// checkable in a browser. This is NOT a simulation of hardware memory
// isolation — that part physically cannot be computed in JavaScript. See
// /how-it-works for exactly what this demo does and doesn't stand in for.
//
// Uses Ed25519 as shipped in the audited @noble/curves library — no
// hand-rolled signature scheme — and SHA-256 from @noble/hashes.
import { ed25519 } from '@noble/curves/ed25519.js';
import { sha256 } from '@noble/hashes/sha2.js';

/** @typedef {{ secretKey: Uint8Array, publicKey: Uint8Array }} KeyPair */
/** @typedef {{ measurement: Uint8Array, signature: Uint8Array }} Quote */

/**
 * The "manufacturer" keypair — in a demo, generated in the browser; in
 * reality, a key burned into silicon at the factory, never leaving the chip.
 * @returns {KeyPair}
 */
export function generateManufacturerKey() {
  const { secretKey, publicKey } = ed25519.keygen();
  return { secretKey, publicKey };
}

/**
 * The "measurement" — a hash of the enclave's code/data, standing in for
 * what a real TEE computes over the actual memory pages it's about to run.
 * @param {string} code @returns {Uint8Array}
 */
export function measure(code) {
  return sha256(new TextEncoder().encode(code));
}

/**
 * The "quote" — what an enclave publishes as evidence of what it's running:
 * a measurement, signed by the manufacturer key. In real SGX this signing
 * step happens inside a special "quoting enclave"; here it's simplified to
 * a direct signature — see /how-it-works for that caveat stated in full.
 * @param {string} code @param {Uint8Array} manufacturerSecretKey @returns {Quote}
 */
export function makeQuote(code, manufacturerSecretKey) {
  const measurement = measure(code);
  const signature = ed25519.sign(measurement, manufacturerSecretKey);
  return { measurement, signature };
}

/**
 * The verifier's check — no access to the secret key, only the public key
 * and the measurement it independently expects to see.
 * @param {Quote} quote @param {Uint8Array} manufacturerPublicKey @param {Uint8Array} expectedMeasurement
 * @returns {{ signatureValid: boolean, measurementMatches: boolean, valid: boolean }}
 */
export function verifyQuote(quote, manufacturerPublicKey, expectedMeasurement) {
  const signatureValid = ed25519.verify(quote.signature, quote.measurement, manufacturerPublicKey);
  const measurementMatches = toHex(quote.measurement) === toHex(expectedMeasurement);
  return { signatureValid, measurementMatches, valid: signatureValid && measurementMatches };
}

/** @param {Uint8Array} bytes @returns {string} */
export function toHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}
