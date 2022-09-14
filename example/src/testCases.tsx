import * as secp256k1 from 'react-native-secp256k1-urnm';
import { utils } from 'react-native-secp256k1-urnm';
import { testEncrypt } from './testEncrypt';
import { validateTestCase, ValidateTestCaseResult } from './utils';

export interface TestCaseGroup {
  title: string;
  count: number;
  passed: number;
  cases: ValidateTestCaseResult[];
}

export const runTestCases = async (ctx: (result: TestCaseGroup) => void) => {
  const allResults: TestCaseGroup[] = [];
  const testCases = [
    TESTVerifySignature,
    TESTSecKeyVerify,
    TESTComputePublicKey,
    TESTCreateSignature,
    TESTPrivateKeyTweak,
    TESTPublicKeyTweak,
    TESTCreateECDHSecret,
    TESTEnctypt,
  ];

  for (const testCase of testCases) {
    const result: TestCaseGroup = {
      title: testCase.name.replace('TEST', ''),
      count: 0,
      passed: 0,
      cases: [],
    };
    const context = (res: ValidateTestCaseResult) => {
      result.cases.push(res);
      result.count++;
      if (res.passed) {
        result.passed++;
      }
    };
    await testCase(context);
    ctx(result);
    allResults.push(result);
  }

  return allResults;
};

async function TESTVerifySignature(
  ctx: (result: ValidateTestCaseResult) => void
) {
  await validateTestCase(ctx, 'Verify', async () => {
    const sig = utils.decodeHex(
      'EC4FAD916AFF78586E5F6FB46FAF3D61C0392A0B82598CF3C5A20623612270E654EF52C62CB7C7F8C245669DE01E7B490EB2FAA2A7E4EEB9FC75C1FA75E9EC48'
    );
    const data = utils.decodeHex(
      'D47D5226E1B0A12153A8D23CC2F55611D191A41BD39F32DC92867541317B808D'
    );
    const pub = utils.decodeHex(
      '023CF15B6BF083BDCEA97F96F6466C1797CAC0C979A8AA5AABF6FB0545B488EBD1'
    );
    return await secp256k1.verify(sig, data, pub);
  });

  await validateTestCase(
    ctx,
    'Error when sing len < 64',
    async () => {
      const data = utils.decodeHex(
        'D47D5226E1B0A12153A8D23CC2F55611D191A41BD39F32DC92867541317B808D'
      );
      const pub = utils.decodeHex(
        '023CF15B6BF083BDCEA97F96F6466C1797CAC0C979A8AA5AABF6FB0545B488EBD1'
      );
      return await secp256k1.verify(new Uint8Array(10), data, pub);
    },
    true
  );

  await validateTestCase(
    ctx,
    'Error when sing len > 64',
    async () => {
      const data = utils.decodeHex(
        'D47D5226E1B0A12153A8D23CC2F55611D191A41BD39F32DC92867541317B808D'
      );
      const pub = utils.decodeHex(
        '023CF15B6BF083BDCEA97F96F6466C1797CAC0C979A8AA5AABF6FB0545B488EBD1'
      );
      return await secp256k1.verify(new Uint8Array(76), data, pub);
    },
    true
  );

  await validateTestCase(
    ctx,
    'Error when msg has invalid length',
    async () => {
      const sig = utils.decodeHex(
        'EC4FAD916AFF78586E5F6FB46FAF3D61C0392A0B82598CF3C5A20623612270E654EF52C62CB7C7F8C245669DE01E7B490EB2FAA2A7E4EEB9FC75C1FA75E9EC48'
      );
      const pub = utils.decodeHex(
        '023CF15B6BF083BDCEA97F96F6466C1797CAC0C979A8AA5AABF6FB0545B488EBD1'
      );
      return await secp256k1.verify(sig, new Uint8Array(10), pub);
    },
    true
  );

  await validateTestCase(
    ctx,
    'Error when pubKey has invalid length',
    async () => {
      const sig = utils.decodeHex(
        'EC4FAD916AFF78586E5F6FB46FAF3D61C0392A0B82598CF3C5A20623612270E654EF52C62CB7C7F8C245669DE01E7B490EB2FAA2A7E4EEB9FC75C1FA75E9EC48'
      );
      const data = utils.decodeHex(
        'D47D5226E1B0A12153A8D23CC2F55611D191A41BD39F32DC92867541317B808D'
      );
      return await secp256k1.verify(sig, data, new Uint8Array(10));
    },
    true
  );

  await validateTestCase(
    ctx,
    'Error when verify with invalid data',
    async () => {
      const sig = utils.decodeHex(
        '5FD709D4722187E5C1EF27E2D6AE1CFC932A0B99FA75A001CF050DA28BA940BD262AE65ADD240ED1FA0609B7E79FC860A94E3F45E5C883D942E794568215CF2A'
      );
      const data = utils.decodeHex(
        'CF80CD8AED482D5D1527D7DC72FCEFF84E6326592848447D2DC0B0E87DFC9A91'
      );
      const pub = utils.decodeHex(
        '04E2B352F23BF39FE134A290D0E2016AB90168A1104D59C26638669E7954DE6760DA0CAD270A903224942616298BC9E5867E2386F7B73DC47CA7F9CA631019A15C'
      );
      return await secp256k1.verify(sig, data, pub);
    },
    true
  );
}

async function TESTSecKeyVerify(ctx: (result: ValidateTestCaseResult) => void) {
  await validateTestCase(ctx, 'Valid Private key', async () => {
    const priv = utils.decodeHex(
      '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
    );
    return await secp256k1.secKeyVerify(priv);
  });
  await validateTestCase(
    ctx,
    'Invalid Private key',
    async () => {
      const priv = utils.decodeHex(
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      );
      return await secp256k1.secKeyVerify(priv);
    },
    true
  );
}

async function TESTComputePublicKey(
  ctx: (result: ValidateTestCaseResult) => void
) {
  await validateTestCase(ctx, 'Valid Public key', async () => {
    const priv = utils.decodeHex(
      '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
    );
    return (await secp256k1.computePubkey(priv, false)).length === 65;
  });
  await validateTestCase(ctx, 'Valid Public key compressed', async () => {
    const priv = utils.decodeHex(
      '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
    );
    return (await secp256k1.computePubkey(priv, true)).length === 33;
  });
  await validateTestCase(
    ctx,
    'Invalid Public key',
    async () => {
      const priv = utils.decodeHex(
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      );
      return (await secp256k1.computePubkey(priv)).length !== 0;
    },
    true
  );
}

async function TESTCreateSignature(
  ctx: (result: ValidateTestCaseResult) => void
) {
  await validateTestCase(ctx, 'Valid Signature', async () => {
    const data = utils.decodeHex(
      'CF80CD8AED482D5D1527D7DC72FCEFF84E6326592848447D2DC0B0E87DFC9A90'
    );
    const priv = utils.decodeHex(
      '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
    );
    const sig = utils.encodeHex(await secp256k1.sign(data, priv));

    return (
      sig ===
      '182A108E1448DC8F1FB467D06A0F3BB8EA0533584CB954EF8DA112F1D60E39A21C66F36DA211C087F3AF88B50EDF4F9BDAA6CF5FD6817E74DCA34DB12390C6E9'
    );
  });

  await validateTestCase(ctx, 'Valid Signature Base64', async () => {
    const data = utils.encodeBase64(
      utils.decodeHex(
        'CF80CD8AED482D5D1527D7DC72FCEFF84E6326592848447D2DC0B0E87DFC9A90'
      )
    );
    const priv = utils.encodeBase64(
      utils.decodeHex(
        '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
      )
    );
    const sig = await secp256k1.base64.sign(data, priv);

    return (
      sig ===
      'GCoQjhRI3I8ftGfQag87uOoFM1hMuVTvjaES8dYOOaIcZvNtohHAh/OviLUO30+b2qbPX9aBfnTco02xI5DG6QA='
    );
  });

  await validateTestCase(
    ctx,
    'Invalid Private key length',
    async () => {
      const data = utils.decodeHex(
        'CF80CD8AED482D5D1527D7DC72FCEFF84E6326592848447D2DC0B0E87DFC9A90'
      );
      return (await secp256k1.sign(data, new Uint8Array(8))).length === 0;
    },
    true
  );
  await validateTestCase(
    ctx,
    'Invalid message length',
    async () => {
      const priv = utils.decodeHex(
        '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
      );
      return (await secp256k1.sign(new Uint8Array(8), priv)).length === 0;
    },
    true
  );

  await validateTestCase(
    ctx,
    'Invalid Signature with invalid Private key',
    async () => {
      const data = utils.encodeBase64(
        utils.decodeHex(
          'CF80CD8AED482D5D1527D7DC72FCEFF84E6326592848447D2DC0B0E87DFC9A90'
        )
      );
      const priv = utils.encodeBase64(
        utils.decodeHex(
          'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
        )
      );
      const sig = await secp256k1.base64.sign(data, priv);

      return (
        sig ===
        'GCoQjhRI3I8ftGfQag87uOoFM1hMuVTvjaES8dYOOaIcZvNtohHAh/OviLUO30+b2qbPX9aBfnTco02xI5DG6QA='
      );
    },
    true
  );
}

async function TESTPrivateKeyTweak(
  ctx: (result: ValidateTestCaseResult) => void
) {
  await validateTestCase(ctx, 'Valid Private Key Tweak Add', async () => {
    const priv = utils.decodeHex(
      '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
    );
    const data = utils.decodeHex(
      '3982F19BEF1615BCCFBB05E321C10E1D4CBA3DF0E841C2E41EEB6016347653C3'
    );
    let tweak = utils.encodeHex(await secp256k1.privKeyTweakAdd(priv, data));

    return (
      tweak ===
      'A168571E189E6F9A7E2D657A4B53AE99B909F7E712D1C23CED28093CD57C88F3'
    );
  });

  await validateTestCase(ctx, 'Valid Private Key Tweak Mul', async () => {
    const priv = utils.decodeHex(
      '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
    );
    const data = utils.decodeHex(
      '3982F19BEF1615BCCFBB05E321C10E1D4CBA3DF0E841C2E41EEB6016347653C3'
    );
    let tweak = utils.encodeHex(await secp256k1.privKeyTweakMul(priv, data));

    return (
      tweak ===
      '97F8184235F101550F3C71C927507651BD3F1CDB4A5A33B8986ACF0DEE20FFFC'
    );
  });
}

async function TESTPublicKeyTweak(
  ctx: (result: ValidateTestCaseResult) => void
) {
  await validateTestCase(ctx, 'Valid Public Key Tweak Add', async () => {
    const pub = utils.decodeHex(
      '040A629506E1B65CD9D2E0BA9C75DF9C4FED0DB16DC9625ED14397F0AFC836FAE595DC53F8B0EFE61E703075BD9B143BAC75EC0E19F82A2208CAEB32BE53414C40'
    );
    const data = utils.decodeHex(
      '3982F19BEF1615BCCFBB05E321C10E1D4CBA3DF0E841C2E41EEB6016347653C3'
    );
    let tweak = utils.encodeHex(await secp256k1.pubKeyTweakAdd(pub, data));

    return (
      tweak ===
      '0411C6790F4B663CCE607BAAE08C43557EDC1A4D11D88DFCB3D841D0C6A941AF525A268E2A863C148555C48FB5FBA368E88718A46E205FABC3DBA2CCFFAB0796EF'
    );
  });

  await validateTestCase(ctx, 'Valid Public Key Tweak Mul', async () => {
    const pub = utils.decodeHex(
      '040A629506E1B65CD9D2E0BA9C75DF9C4FED0DB16DC9625ED14397F0AFC836FAE595DC53F8B0EFE61E703075BD9B143BAC75EC0E19F82A2208CAEB32BE53414C40'
    );
    const data = utils.decodeHex(
      '3982F19BEF1615BCCFBB05E321C10E1D4CBA3DF0E841C2E41EEB6016347653C3'
    );
    let tweak = utils.encodeHex(await secp256k1.pubKeyTweakMul(pub, data));

    return (
      tweak ===
      '04E0FE6FE55EBCA626B98A807F6CAF654139E14E5E3698F01A9A658E21DC1D2791EC060D4F412A794D5370F672BC94B722640B5F76914151CFCA6E712CA48CC589'
    );
  });
}

async function TESTCreateECDHSecret(
  ctx: (result: ValidateTestCaseResult) => void
) {
  await validateTestCase(ctx, 'Valid Public Key Tweak Add', async () => {
    const priv = utils.decodeHex(
      '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
    );
    const pub = utils.decodeHex(
      '040A629506E1B65CD9D2E0BA9C75DF9C4FED0DB16DC9625ED14397F0AFC836FAE595DC53F8B0EFE61E703075BD9B143BAC75EC0E19F82A2208CAEB32BE53414C40'
    );
    let data = utils.encodeHex(await secp256k1.createECDHSecret(priv, pub));

    return (
      data ===
      '2A2A67007A926E6594AF3EB564FC74005B37A9C8AEF2033C4552051B5C87F043'
    );
  });
}

async function TESTEnctypt(ctx: (result: ValidateTestCaseResult) => void) {
  await validateTestCase(
    ctx,
    'Test encrypt and decrypt functionality',
    async () => {
      const check_array = [
        '1',
        '我',
        '*)(&Y(Y(FDS',
        '我的你的他的事把八八八八把',
        '00000000',
        '000000001',
        '0000000011111111',
        '00000000111111112',
        '000000001111111122222222',
        '0000000011111111222222223',
        '00000000111111112222222233333333',
        '000000001111111122222222333333334',
      ];
      const pass_array = [
        'YuSFnp71PAqp+NwcFXdwQQ',
        '61zJCqZxl9UBZKBI4Uhqwg',
        'Gnufw1LLme2KAJV50lHtCA',
        'wmYGLU+mX08SONrf0lTP4EM8cM0yyeltBMjEeBar8SUriIx4VxB6gBCpA8L8C79u',
        'CCHPmYLSx96y5RSQWAVhDQ',
        'uid9haHV6wPxJTyi8+iw8A',
        'O48Ahcyy/jTax3pnr4Mp9kYxfqxf4z2s6NRe6rq3M5s',
        't/PLvjgyzWXgWZhYazRR23KisIbInBBRJ2lnnc3KQ4E',
        'ecp348KozZHzoIjlWmmFZsoXxNK2ZFjswCgxKQCF9po',
        'bvzQQwedulPkDOVQMJcC1R8YDedOqVfnIdVVyQHnWRo',
        'qvexrll4LoEh7JnKtW05fOqcwZsvEldOi4crGiqdq9lLdD3jZ0wsc/PzqMnWvxil',
        'XnFXSZEiqPcNN5yRywQg1Ro9puKJVoq2v8Zp3kakiSsVeTrWAPxaMVA99GqCYRdh',
      ];

      let key1 = await secp256k1.ext.generateKey();
      let key2 = await secp256k1.ext.generateKey();
      const skey1 = 'G6rWYPkY5m6VGkdUBzSFPxB8/lWcKOACBTHTlA4qmXQ';
      const skey2 = '1H1SJuGwoSFTqNI8wvVWEdGRpBvTnzLckoZ1QTF7gI0';

      for (let i = 0; i < check_array.length; i++) {
        const enc = check_array[i]!;
        const dec = pass_array[i]!;
        if (dec === undefined) {
          const pub2 = await secp256k1.base64.computePubkey(skey2, true);
          const encryped1 = await secp256k1.ext.encryptECDH(skey1, pub2, enc);
          console.warn(encryped1);
        }
        if (!(await testEncrypt(key1, key2, enc))) {
          return false;
        }
        if (!(await testEncrypt(skey1, skey2, enc, dec))) {
          return false;
        }
      }
      return true;
    }
  );
}
