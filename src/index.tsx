import { NativeModules, Platform } from 'react-native';
import stablelibUtil from './utils';
import Secp256k1Ext from './ext';
import secp256k1base64 from './secp256k1base64';
import { errors, isUint8Array } from './errors';

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
  sig: Uint8Array,
  msg32: Uint8Array,
  pubkey: Uint8Array
): Promise<boolean> {
  isUint8Array('signature', sig, 64);
  isUint8Array('message', msg32, 32);
  isUint8Array('public key', pubkey, [33, 65]);

  const bMsg32 = stablelibUtil.encodeBase64WithoutPadding(msg32);
  const bSig = stablelibUtil.encodeBase64WithoutPadding(sig);
  const bPub = stablelibUtil.encodeBase64WithoutPadding(pubkey);

  switch (await Secp256k1Urnm.verify(bMsg32, bSig, bPub)) {
    case 0:
      return true;
    case 3:
      return false;
    case 1:
      throw new Error(errors.SIG_PARSE);
    case 2:
      throw new Error(errors.PUBKEY_PARSE);
  }

  return false;
}
export async function sign(
  msg32: Uint8Array,
  seckey: Uint8Array
): Promise<Uint8Array> {
  isUint8Array('message', msg32, 32);
  isUint8Array('private key', seckey, 32);

  const bMsg32 = stablelibUtil.encodeBase64WithoutPadding(msg32);
  const bSeckey = stablelibUtil.encodeBase64WithoutPadding(seckey);
  const bSignature = await Secp256k1Urnm.sign(bMsg32, bSeckey);
  switch (bSignature) {
    case 1:
      throw new Error(errors.SIGN);
    case 2:
      throw new Error(errors.IMPOSSIBLE_CASE);
  }
  return stablelibUtil.decodeBase64(bSignature);
}

export async function privateKeyVerify(seckey: Uint8Array): Promise<boolean> {
  isUint8Array('private key', seckey, 32);

  const bSeckey = stablelibUtil.encodeBase64WithoutPadding(seckey);
  return await Secp256k1Urnm.secKeyVerify(bSeckey);
}

export async function publicKeyCreate(
  seckey: Uint8Array,
  compressed?: boolean
): Promise<Uint8Array> {
  isUint8Array('private key', seckey, 32);

  const bSeckey = stablelibUtil.encodeBase64WithoutPadding(seckey);
  const bPub = await Secp256k1Urnm.computePubkey(bSeckey, !!compressed);
  return stablelibUtil.decodeBase64(bPub);
}

export async function createECDHSecret(
  seckey: Uint8Array,
  pubkey: Uint8Array
): Promise<Uint8Array> {
  isUint8Array('public key', pubkey, [33, 65]);
  isUint8Array('private key', seckey, 32);

  const bSeckey = stablelibUtil.encodeBase64WithoutPadding(seckey);
  const bPubkey = stablelibUtil.encodeBase64WithoutPadding(pubkey);
  const bSecret = await Secp256k1Urnm.createECDHSecret(bSeckey, bPubkey);
  return stablelibUtil.decodeBase64(bSecret);
}

export async function privateKeyTweakMul(
  seckey: Uint8Array,
  tweak: Uint8Array
): Promise<Uint8Array> {
  isUint8Array('private key', seckey, 32);
  isUint8Array('tweak', tweak, 32);

  const bSeckey = stablelibUtil.encodeBase64WithoutPadding(seckey);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.privKeyTweakMul(bSeckey, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}
export async function privateKeyTweakAdd(
  seckey: Uint8Array,
  tweak: Uint8Array
): Promise<Uint8Array> {
  isUint8Array('private key', seckey, 32);
  isUint8Array('tweak', tweak, 32);

  const bSeckey = stablelibUtil.encodeBase64WithoutPadding(seckey);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.privKeyTweakAdd(bSeckey, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}
export async function pubKeyTweakAdd(
  pubkey: Uint8Array,
  tweak: Uint8Array
): Promise<Uint8Array> {
  isUint8Array('public key', pubkey, [33, 65]);
  isUint8Array('tweak', tweak, 32);

  const bPubkey = stablelibUtil.encodeBase64WithoutPadding(pubkey);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.pubKeyTweakAdd(bPubkey, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}

export async function pubKeyTweakMul(
  pubkey: Uint8Array,
  tweak: Uint8Array
): Promise<Uint8Array> {
  isUint8Array('public key', pubkey, [33, 65]);
  isUint8Array('tweak', tweak, 32);

  const bPubkey = stablelibUtil.encodeBase64WithoutPadding(pubkey);
  const bTweak = stablelibUtil.encodeBase64WithoutPadding(tweak);
  const bResult = await Secp256k1Urnm.pubKeyTweakMul(bPubkey, bTweak);
  return stablelibUtil.decodeBase64(bResult);
}

export const ext = Secp256k1Ext;
export const utils = stablelibUtil;
export const base64 = secp256k1base64;

export default {
  verify,
  sign,
  privateKeyVerify,
  publicKeyCreate,
  privateKeyTweakAdd,
  privateKeyTweakMul,
  pubKeyTweakMul,
  pubKeyTweakAdd,
  createECDHSecret,
  ext,
  utils,
  base64,
};
