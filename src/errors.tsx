export const errors = {
  IMPOSSIBLE_CASE: 'Impossible case. Please create issue.',
  TWEAK_ADD:
    'The tweak was out of range or the resulted private key is invalid',
  TWEAK_MUL: 'The tweak was out of range or equal to zero',
  CONTEXT_RANDOMIZE_UNKNOW: 'Unknow error on context randomization',
  SECKEY_INVALID: 'Private Key is invalid',
  PUBKEY_PARSE: 'Public Key could not be parsed',
  PUBKEY_SERIALIZE: 'Public Key serialization error',
  PUBKEY_COMBINE: 'The sum of the public keys is not valid',
  SIG_PARSE: 'Signature could not be parsed',
  SIGN: 'The nonce generation function failed, or the private key was invalid',
  RECOVER: 'Public key could not be recover',
  ECDH: 'Scalar was invalid (zero or overflow)',
};

export function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error(msg);
}

export function isUint8Array(
  name: string,
  value: Uint8Array,
  length: number | number[]
) {
  assert(value instanceof Uint8Array, `Expected ${name} to be an Uint8Array`);

  if (length !== undefined) {
    if (Array.isArray(length)) {
      const numbers = length.join(', ');
      const msg = `Expected ${name} to be an Uint8Array with length [${numbers}]`;
      assert(length.includes(value.length), msg);
    } else {
      const msg = `Expected ${name} to be an Uint8Array with length ${length}`;
      assert(value.length === length, msg);
    }
  }
}

// function isCompressed(value: boolean) {
//   assert(
//     toTypeString(value) === 'Boolean',
//     'Expected compressed to be a Boolean'
//   );
// }
//
// function toTypeString(value) {
//   return Object.prototype.toString.call(value).slice(8, -1);
// }
