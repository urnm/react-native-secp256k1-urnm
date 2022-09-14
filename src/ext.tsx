import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-secp256k1-urnm' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const Secp256k1UrnmExt = NativeModules.Secp256k1UrnmExt
  ? NativeModules.Secp256k1UrnmExt
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function generateKey(): Promise<string> {
  return Secp256k1UrnmExt.generateKey();
}

export function encryptECDH(
  data: string,
  priv: string,
  pub: string
): Promise<string> {
  return Secp256k1UrnmExt.encryptECDH(data, priv, pub);
}

export function decryptECDH(
  data: string,
  priv: string,
  pub: string
): Promise<string> {
  return Secp256k1UrnmExt.decryptECDH(data, priv, pub);
}

export default {
  generateKey,
  encryptECDH,
  decryptECDH,
};
