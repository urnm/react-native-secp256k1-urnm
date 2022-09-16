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

- Functions work with [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array).

| Method                                                               | Params                                                             | Return type          | Description                                                   |
|----------------------------------------------------------------------|--------------------------------------------------------------------|----------------------|---------------------------------------------------------------|
| **verify**(sig: Unit8Array, mes32: Unit8Array, pubkey: Unit8Array)   | `sig`: signature, `mes32`: message to verify, `pubkey`: Unit8Array | Promise\<boolean>    | Verify an ECDSA signature.                                    |
| **sign**(msg32: Unit8Array, privKey: Unit8Array)                     | `sig`: signature, `privKey`: Unit8Array                            | Promise\<Unit8Array> | Create an ECDSA signature.                                    |
| **privateKeyVerify**(privKey: Unit8Array)                            | `privKey`: Unit8Array                                              | Promise\<boolean>    | Verify a private key.                                         |
| **publicKeyCreate**(privKey: Uint8Array, compressed?: boolean)       | `privKey`: Unit8Array, `compressed`: boolean                       | Promise\<Unit8Array> | Compute the public key for a secret key.                      |
| **privateKeyTweakAdd**(privKey: Unit8Array, tweak: Unit8Array)       | `privKey`: Unit8Array, `tweak`: Unit8Array                         | Promise\<Uint8Array> | Tweak a private key in place by adding tweak to it.           |
| **privateKeyTweakMul**(privKey: Unit8Array, tweak: Unit8Array)       | `privKey`: Unit8Array, `tweak`: Unit8Array                         | Promise\<Uint8Array> | Tweak a private key in place by multiplying it by a tweak.    |
| **pubKeyTweakAdd**(pubKey: Unit8Array, tweak: Unit8Array)            | `pubKey`: Unit8Array, `tweak`: Unit8Array                          | Promise\<Uint8Array> | Tweak a public key by adding tweak times the generator to it. |
| **pubKeyTweakMul**(pubKey: Unit8Array, tweak: Unit8Array)            | `pubKey`: Unit8Array, `tweak`: Unit8Array                          | Promise\<Uint8Array> | Tweak a public key by multiplying it by a tweak value.        |
| **createECDHSecret**(privKey: Unit8Array, pubKey: Unit8Array)        | `privKey`: Unit8Array, `pubKey`: Unit8Array                        | Promise\<Uint8Array> | Compute an EC Diffie-Hellman secret in constant time.         |

### Ext methods

```javascript
import { ext } from 'react-native-secp256k1-urnm';
```

| Method                                                          | Params                                                                         | Return type               | Description                       |
|-----------------------------------------------------------------|--------------------------------------------------------------------------------|---------------------------|-----------------------------------|
| **generateKey**()                                               |                                                                                | Promise\<*base64* string> | Create a random private key       |
| **encryptECDH**(privKey: string, pubKey: string, data: string)  | `privKey`: *base64* string, `pubKey`: *base64* string, `data`: *base64* string | Promise\<*base64* string> | Encrypt data an EC Diffie-Hellman |
| **decryptECDH**(privKey: string, pubKey: string, data: string)  | `privKey`: *base64* string, `pubKey`: *base64* string, `data`: *base64* string | Promise\<*base64* string> | Decrypt data an EC Diffie-Hellman |

### Utils methods

```javascript
import { utils } from 'react-native-secp256k1-urnm';
```

| Method                                           | Params                  | Return type     | Description                                                                                           |
|--------------------------------------------------|-------------------------|-----------------|-------------------------------------------------------------------------------------------------------|
| **encodeBase64**(data: Uint8Array)               | `data`: Uint8Array      | *base64* string | Provide [@stablelib/base64](https://www.stablelib.com/modules/_stablelib_base64.html) encode function |
| **decodeBase64**(base64: string)                 | `data`: *base64* string | Uint8Array      | Provide [@stablelib/base64](https://www.stablelib.com/modules/_stablelib_base64.html) decode function |
| **encodeHex**(data: Uint8Array)                  | `data`: Uint8Array      | *base64* string | Provide [@stablelib/hex](https://www.stablelib.com/modules/_stablelib_hex.html) encode function       |
| **decodeHex**(base64: string)                    | `data`: *base64* string | Uint8Array      | Provide [@stablelib/hex](https://www.stablelib.com/modules/_stablelib_hex.html) decode function       |
| **encodeBase64WithoutPadding**(data: Uint8Array) | `data`: Uint8Array      | *base64* string | Encode Unit8Array to base64 string without paddings(`=`). Used `@stablelib/base64`.                   |
| **decodeBase64WithoutPadding**(base64: string)   | `data`: *base64* string | Uint8Array      | Decode Unit8Array to base64 string without paddings(`=`). Used `@stablelib/base64`.                   |
| **removeBase64Padding**(base64: string)          | `data`: *base64* string | *base64* string | Remove paddings(`=`) from base64 string                                                               |
| **addBase64Padding**(base64: string)             | `data`: *base64* string | *base64* string | Add paddings(`=`) to base64 string                                                                    |

### Base64 methods

```javascript
import { base64 } from 'react-native-secp256k1-urnm';
```

| Method                                                     | Params                                                                       | Return type               | Description                                                   |
|------------------------------------------------------------|------------------------------------------------------------------------------|---------------------------|---------------------------------------------------------------|
| **verify**(sig: string, mes32: string, pubkey: string)     | `sig`: *base64* string, `mes32`: *base64* string, `pubkey`: *base64* string  | Promise\<boolean>         | Verify an ECDSA signature.                                    |
| **sign**(msg32: string, privKey: string)                   | `sig`: *base64* string, `privKey`: *base64* string                           | Promise\<*base64* string> | Create an ECDSA signature.                                    |
| **privateKeyVerify**(privKey: string)                      | `privKey`: *base64* string                                                   | Promise\<boolean>         | Verify a private key.                                         |
| **publicKeyCreate**(privKey: string, compressed?: boolean) | `privKey`: *base64* string, `compressed`: boolean                            | Promise\<*base64* string> | Compute the public key for a secret key.                      |
| **privateKeyTweakAdd**(privKey: string, tweak: string)     | `privKey`: *base64* string, `tweak`: *base64* string                         | Promise\<*base64* string> | Tweak a private key in place by adding tweak to it.           |
| **privateKeyTweakMul**(privKey: string, tweak: string)     | `privKey`: *base64* string, `tweak`: *base64* string                         | Promise\<*base64* string> | Tweak a private key in place by multiplying it by a tweak.    |
| **pubKeyTweakAdd**(pubKey: string, tweak: string)          | `pubKey`: *base64* string, `tweak`: *base64* string                          | Promise\<*base64* string> | Tweak a public key by adding tweak times the generator to it. |
| **pubKeyTweakMul**(pubKey: string, tweak: string)          | `pubKey`: *base64* string, `tweak`: *base64* string                          | Promise\<*base64* string> | Tweak a public key by multiplying it by a tweak value.        |
| **createECDHSecret**(privKey: string, pubKey: string)      | `privKey`: *base64* string, `pubKey`: *base64* string                        | Promise\<*base64* string> | Compute an EC Diffie-Hellman secret in constant time.         |


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
