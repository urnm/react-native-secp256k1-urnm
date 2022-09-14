import * as secp256k1 from 'react-native-secp256k1-urnm';

export async function testEncrypt(
  key1: string,
  key2: string,
  data: string,
  encryped?: string
) {
  const pub1 = await secp256k1.base64.computePubkey(key1, true);
  const pub2 = await secp256k1.base64.computePubkey(key2, true);

  const encryped1 = await secp256k1.ext.encryptECDH(key1, pub2, data);
  const encryped2 = await secp256k1.ext.encryptECDH(key2, pub1, data);

  let decryped1 = await secp256k1.ext.decryptECDH(key2, pub1, encryped1);
  let decryped2 = await secp256k1.ext.decryptECDH(key1, pub2, encryped2);
  if (decryped1 !== data || decryped2 !== data) {
    console.error('self decryption');
    console.error(decryped1);
    console.error(decryped2);
    console.error(data);
    return false;
  }

  if (encryped !== undefined) {
    decryped1 = await secp256k1.ext.decryptECDH(key2, pub1, encryped);
    decryped2 = await secp256k1.ext.decryptECDH(key1, pub2, encryped);
    if (decryped1 !== data || decryped2 !== data) {
      console.error('public decryption');
      console.error(decryped1);
      console.error(decryped2);
      console.error(data);
      return false;
    }
  }
  return true;
}
