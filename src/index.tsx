import { NativeModules, Platform } from 'react-native';
import stablelibUtil from './utils';
import Secp256k1Ext from './ext';
import secp256k1base64 from './secp256k1base64';

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

export function multiply(a: number, b: number): Promise<number> {
  return Secp256k1Urnm.multiply(a, b);
}

export async function verify(
  data: Uint8Array,
  signature: Uint8Array,
  pub: Uint8Array
): Promise<boolean> {
  const bData = stablelibUtil.encodeBase64WithoutPadding(data);
  const bSig = stablelibUtil.encodeBase64WithoutPadding(signature);
  const bPub = stablelibUtil.encodeBase64WithoutPadding(pub);

  return await Secp256k1Urnm.verify(bData, bSig, bPub);
}
export async function sign(
  data: Uint8Array,
  priv: Uint8Array
): Promise<Uint8Array> {
  const bData = stablelibUtil.encodeBase64WithoutPadding(data);
  const bPriv = stablelibUtil.encodeBase64WithoutPadding(priv);
  const bSignature = await Secp256k1Urnm.sign(bData, bPriv);
  return stablelibUtil.decodeBase64(bSignature);
}

export async function secKeyVerify(priv: Uint8Array): Promise<boolean> {
  const bPriv = stablelibUtil.encodeBase64WithoutPadding(priv);
  return await Secp256k1Urnm.secKeyVerify(bPriv);
}

export async function computePubkey(
  priv: Uint8Array,
  compressed?: boolean
): Promise<Uint8Array> {
  const bPriv = stablelibUtil.encodeBase64WithoutPadding(priv);
  const bPub = await Secp256k1Urnm.computePubkey(bPriv, !!compressed);
  return stablelibUtil.decodeBase64(bPub);
}

export async function createECDHSecret(
  priv: Uint8Array,
  pub: Uint8Array
): Promise<Uint8Array> {
  const bPriv = stablelibUtil.encodeBase64WithoutPadding(priv);
  const bPub = stablelibUtil.encodeBase64WithoutPadding(pub);
  const bSecret = await Secp256k1Urnm.createECDHSecret(bPriv, bPub);
  return stablelibUtil.decodeBase64(bSecret);
}

export async function privKeyTweakMul(priv: Uint8Array, tweak: Uint8Array) {
  const bPriv = stablelibUtil.encodeBase64WithoutPadding(priv);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.privKeyTweakMul(bPriv, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}
export async function privKeyTweakAdd(
  priv: Uint8Array,
  tweak: Uint8Array
): Promise<Uint8Array> {
  const bPriv = stablelibUtil.encodeBase64WithoutPadding(priv);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.privKeyTweakAdd(bPriv, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}
export async function pubKeyTweakMul(
  pub: Uint8Array,
  tweak: Uint8Array
): Promise<Uint8Array> {
  const bPub = stablelibUtil.encodeBase64WithoutPadding(pub);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.pubKeyTweakMul(bPub, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}
export async function pubKeyTweakAdd(
  pub: Uint8Array,
  tweak: Uint8Array
): Promise<Uint8Array> {
  const bPub = stablelibUtil.encodeBase64WithoutPadding(pub);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.pubKeyTweakAdd(bPub, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}

export const ext = Secp256k1Ext;
export const utils = stablelibUtil;
export const base64 = secp256k1base64;

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
  ext,
  utils,
  base64,
};
