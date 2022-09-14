import { NativeModules, Platform } from 'react-native';
import stablelibUtil from './utils';

const LINKING_ERROR =
  `The package 'react-native-secp256k1-urnm' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const Secp256k1Urnm = NativeModules.Secp256k1Urnm
  ? NativeModules.Secp256k1Urnm
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export async function verify(
  data: string,
  sig: string,
  pub: string
): Promise<boolean> {
  return await Secp256k1Urnm.verify(
    stablelibUtil.removeBase64Padding(data),
    stablelibUtil.removeBase64Padding(sig),
    stablelibUtil.removeBase64Padding(pub)
  );
}

export async function sign(data: string, priv: string): Promise<string> {
  return stablelibUtil.addBase64Padding(
    await Secp256k1Urnm.sign(
      stablelibUtil.removeBase64Padding(data),
      stablelibUtil.removeBase64Padding(priv)
    )
  );
}

export async function secKeyVerify(priv: string): Promise<boolean> {
  return await Secp256k1Urnm.secKeyVerify(
    stablelibUtil.removeBase64Padding(priv)
  );
}

export async function computePubkey(
  priv: string,
  compressed: boolean
): Promise<string> {
  return stablelibUtil.addBase64Padding(
    await Secp256k1Urnm.computePubkey(
      stablelibUtil.removeBase64Padding(priv),
      compressed
    )
  );
}

export async function privKeyTweakAdd(
  priv: string,
  tweak: string
): Promise<string> {
  return stablelibUtil.addBase64Padding(
    await Secp256k1Urnm.privKeyTweakAdd(
      stablelibUtil.removeBase64Padding(priv),
      stablelibUtil.removeBase64Padding(tweak)
    )
  );
}

export async function privKeyTweakMul(
  priv: string,
  tweak: string
): Promise<string> {
  return stablelibUtil.addBase64Padding(
    await Secp256k1Urnm.privKeyTweakMul(
      stablelibUtil.removeBase64Padding(priv),
      stablelibUtil.removeBase64Padding(tweak)
    )
  );
}

export async function pubKeyTweakMul(
  pub: string,
  tweak: string
): Promise<string> {
  return stablelibUtil.addBase64Padding(
    await Secp256k1Urnm.pubKeyTweakMul(
      stablelibUtil.removeBase64Padding(pub),
      stablelibUtil.removeBase64Padding(tweak)
    )
  );
}

export async function pubKeyTweakAdd(
  pub: string,
  tweak: string
): Promise<string> {
  return stablelibUtil.addBase64Padding(
    await Secp256k1Urnm.pubKeyTweakAdd(
      stablelibUtil.removeBase64Padding(pub),
      stablelibUtil.removeBase64Padding(tweak)
    )
  );
}

export async function createECDHSecret(
  priv: string,
  pub: string
): Promise<string> {
  return stablelibUtil.addBase64Padding(
    await Secp256k1Urnm.createECDHSecret(
      stablelibUtil.removeBase64Padding(priv),
      stablelibUtil.removeBase64Padding(pub)
    )
  );
}

export default {
  verify,
  sign,
  secKeyVerify,
  computePubkey,
  privKeyTweakAdd,
  privKeyTweakMul,
  pubKeyTweakMul,
  pubKeyTweakAdd,
  createECDHSecret,
};
