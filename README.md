# react-native-secp256k1-urnm

This module provides native bindings to [bitcoin-core/secp256k1](https://github.com/bitcoin-core/secp256k1) for React Native.


- [Installation](#installation)
- [Demo](#demo)
- [Usage](#usage)
- [Contributing](#contributing)

## Demo
![Example test cases](https://user-images.githubusercontent.com/1748318/190282980-0e708264-d490-4104-998f-f05778f56fbc.png)
![Example test cases GIF](https://user-images.githubusercontent.com/1748318/190282793-c8d132cb-5591-4f1c-aef4-1418ad6f489c.gif)

## Installation

### Npm
```sh
npm install react-native-secp256k1-urnm
```

### Yarn
```sh
yarn add react-native-secp256k1-urnm
```

## Usage

* [See other use cases example](https://github.com/urnm/react-native-secp256k1-urnm/blob/master/example/src/testCases.tsx)

```javascript
import * as secp256k1 from 'react-native-secp256k1-urnm';
import { utils } from 'react-native-secp256k1-urnm';

async function main() {
  const privAbase64 = await secp256k1.ext.generateKey();
  const privBbase64 = await secp256k1.ext.generateKey();
  const privA = utils.decodeBase64(privAbase64);
  const privB = utils.decodeBase64(privBbase64);

  const pubA = await secp256k1.computePubkey(privA, true);
  const pubB = await secp256k1.computePubkey(privB, true);

  // sign verify
  const data = utils.decodeBase64("1H1SJuGwoSFTqNI8wvVWEdGRpBvTnzLckoZ1QTF7gI0");
  const sigA = await secp256k1.sign(data, privA);
  console.log("verify: ", await secp256k1.verify(data, sigA, pubA));

  const pubABase64 = utils.encodeBase64(pubA);
  const pubBBase64 = utils.encodeBase64(pubB);
  // ecdh && aes256
  const encryped1 = await secp256k1.ext.encryptECDH(privAbase64, pubBBase64, "Hello World");
  const decryped1 = await secp256k1.ext.decryptECDH(privBbase64, pubABase64, encryped1);
  console.log(decryped1);
}

main().then(() => {
	console.log("Done");
}).catch((err) => {
	console.error(err);
});

```

## API

### Base methods

```javascript
import * as secp256k1 from 'react-native-secp256k1-urnm';
```

| Method                                                               | Params                                                             | Return type          | Description |
|----------------------------------------------------------------------|--------------------------------------------------------------------|----------------------|-------------|
| **verify**(sig: Unit8Array, mes32: Unit8Array, pubkey: Unit8Array)   | `sig`: signature, `mes32`: message to verify, `pubkey`: Unit8Array | Promise\<boolean>    |             |
| **sign**(msg32: Unit8Array, privKey: Unit8Array)                     | `sig`: signature, `privKey`: Unit8Array                            | Promise\<Unit8Array> |             |
| **privateKeyVerify**(privKey: Unit8Array)                            | `privKey`: Unit8Array                                              | Promise\<boolean>    |             |
| **publicKeyCreate**(privKey: Uint8Array, compressed?: boolean)       | `privKey`: Unit8Array, `compressed`: boolean                       | Promise\<Unit8Array> |             |
| **privateKeyTweakAdd**(privKey: Unit8Array, tweak: Unit8Array)       | `privKey`: Unit8Array, `tweak`: Unit8Array                         | Promise\<Uint8Array> |             |
| **privateKeyTweakMul**(privKey: Unit8Array, tweak: Unit8Array)       | `privKey`: Unit8Array, `tweak`: Unit8Array                         | Promise\<Uint8Array> |             |
| **pubKeyTweakAdd**(pubKey: Unit8Array, tweak: Unit8Array)            | `pubKey`: Unit8Array, `tweak`: Unit8Array                          | Promise\<Uint8Array> |             |
| **pubKeyTweakMul**(pubKey: Unit8Array, tweak: Unit8Array)            | `pubKey`: Unit8Array, `tweak`: Unit8Array                          | Promise\<Uint8Array> |             |
| **createECDHSecret**(privKey: Unit8Array, pubKey: Unit8Array)        | `privKey`: Unit8Array, `pubKey`: Unit8Array                        | Promise\<Uint8Array> |             |

### Ext methods

```javascript
import { ext } from 'react-native-secp256k1-urnm';
```

| Method                                                          | Params                                                                         | Return type               | Description |
|-----------------------------------------------------------------|--------------------------------------------------------------------------------|---------------------------|-------------|
| **generateKey**()                                               |                                                                                | Promise\<*base64* string> |             |
| **encryptECDH**(privKey: string, pubKey: string, data: string)  | `privKey`: *base64* string, `pubKey`: *base64* string, `data`: *base64* string | Promise\<*base64* string> |             |
| **decryptECDH**(privKey: string, pubKey: string, data: string)  | `privKey`: *base64* string, `pubKey`: *base64* string, `data`: *base64* string | Promise\<*base64* string> |             |

### Utils methods

```javascript
import { utils } from 'react-native-secp256k1-urnm';
```

| Method                                           | Params                  | Return type     | Description |
|--------------------------------------------------|-------------------------|-----------------|-------------|
| **encodeBase64**(data: Uint8Array)               | `data`: Uint8Array      | *base64* string |             |
| **decodeBase64**(base64: string)                 | `data`: *base64* string | Uint8Array      |             |
| **encodeHex**(data: Uint8Array)                  | `data`: Uint8Array      | *base64* string |             |
| **decodeHex**(base64: string)                    | `data`: *base64* string | Uint8Array      |             |
| **encodeBase64WithoutPadding**(data: Uint8Array) | `data`: Uint8Array      | *base64* string |             |
| **decodeBase64WithoutPadding**(base64: string)   | `data`: *base64* string | Uint8Array      |             |
| **removeBase64Padding**(base64: string)          | `data`: *base64* string | *base64* string |             |
| **addBase64Padding**(base64: string)             | `data`: *base64* string | *base64* string |             |

### Base64 methods

```javascript
import { base64 } from 'react-native-secp256k1-urnm';
```

| Method                                                     | Params                                                                       | Return type               | Description |
|------------------------------------------------------------|------------------------------------------------------------------------------|---------------------------|-------------|
| **verify**(sig: string, mes32: string, pubkey: string)     | `sig`: *base64* string, `mes32`: *base64* string, `pubkey`: *base64* string  | Promise\<boolean>         |             |
| **sign**(msg32: string, privKey: string)                   | `sig`: *base64* string, `privKey`: *base64* string                           | Promise\<*base64* string> |             |
| **privateKeyVerify**(privKey: string)                      | `privKey`: *base64* string                                                   | Promise\<boolean>         |             |
| **publicKeyCreate**(privKey: string, compressed?: boolean) | `privKey`: *base64* string, `compressed`: boolean                            | Promise\<*base64* string> |             |
| **privateKeyTweakAdd**(privKey: string, tweak: string)     | `privKey`: *base64* string, `tweak`: *base64* string                         | Promise\<*base64* string> |             |
| **privateKeyTweakMul**(privKey: string, tweak: string)     | `privKey`: *base64* string, `tweak`: *base64* string                         | Promise\<*base64* string> |             |
| **pubKeyTweakAdd**(pubKey: string, tweak: string)          | `pubKey`: *base64* string, `tweak`: *base64* string                          | Promise\<*base64* string> |             |
| **pubKeyTweakMul**(pubKey: string, tweak: string)          | `pubKey`: *base64* string, `tweak`: *base64* string                          | Promise\<*base64* string> |             |
| **createECDHSecret**(privKey: string, pubKey: string)      | `privKey`: *base64* string, `pubKey`: *base64* string                        | Promise\<*base64* string> |             |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
