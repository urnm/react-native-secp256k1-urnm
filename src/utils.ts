import * as hex from '@stablelib/hex';
import * as base64 from '@stablelib/base64';

const noPaddingBase64Coder = new base64.Coder('');

export function encodeBase64WithoutPadding(data: Uint8Array): string {
  return noPaddingBase64Coder.encode(data);
}

export function decodeBase64WithoutPadding(s: string): Uint8Array {
  return noPaddingBase64Coder.decode(s);
}

const paddingCharacter = '=';
function getBase64PaddingLength(s: string): number {
  let paddingLength = 0;
  if (paddingCharacter) {
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] !== paddingCharacter) {
        break;
      }
      paddingLength++;
    }
    if (s.length < 4 || paddingLength > 2) {
      throw new Error('Base64Coder: incorrect padding');
    }
  }
  return paddingLength;
}

function removeBase64Padding(s: string): string {
  return s.slice(0, s.length - getBase64PaddingLength(s));
}

function addBase64Padding(data: string): string {
  return base64.encode(decodeBase64WithoutPadding(data));
}

export default {
  decodeHex: hex.decode,
  encodeHex: hex.encode,
  decodeBase64: base64.decode,
  encodeBase64: base64.encode,
  decodeBase64WithoutPadding,
  encodeBase64WithoutPadding,
  removeBase64Padding,
  addBase64Padding,
};
