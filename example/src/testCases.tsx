import * as secp256k1 from 'react-native-secp256k1-urnm';
import { utils } from 'react-native-secp256k1-urnm';
import { testEncrypt } from './testEncrypt';

type CheckFn = (reslult: any, point?: string) => void;

export async function testCase(check: CheckFn) {
  let data: Uint8Array | string = utils.decodeHex(
    'D47D5226E1B0A12153A8D23CC2F55611D191A41BD39F32DC92867541317B808D'
  );
  let sig: Uint8Array | string = utils.decodeHex(
    '3045022100B968F535CDC28A566820A5DE8BB240161B094DD495969378C06EA21EB127906802201E074721CFA5CBFAAF21A27521386E0A62261061C24FAD5C4A33A97AB0396CDC'
  );
  let pub: Uint8Array | string = utils.decodeHex(
    '0293A34FEA94F891AF738FE760A95D84C30DEBE3465989C88128F8B5D918481777'
  );
  check(await secp256k1.verify(data, sig, pub), 'testVerifyPos');

  data = utils.decodeHex(
    'CF80CD8AED482D5D1527D7DC72FCEFF84E6326592848447D2DC0B0E87DFC9A91'
  );
  sig = utils.decodeHex(
    '3044022079BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F817980220294F14E883B3F525B5367756C2A11EF6CF84B730B36C17CB0C56F0AAB2C98589'
  );
  pub = utils.decodeHex(
    '040A629506E1B65CD9D2E0BA9C75DF9C4FED0DB16DC9625ED14397F0AFC836FAE595DC53F8B0EFE61E703075BD9B143BAC75EC0E19F82A2208CAEB32BE53414C40'
  );
  check(!(await secp256k1.verify(data, sig, pub)), 'testVerifyNeg');

  let priv = utils.decodeHex(
    '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
  );
  check(await secp256k1.secKeyVerify(priv), 'testSecKeyVerifyPos');

  priv = utils.decodeHex(
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
  );
  check(!(await secp256k1.secKeyVerify(priv)), 'testSecKeyVerifyNeg');

  priv = utils.decodeHex(
    '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
  );
  pub = utils.encodeHex(await secp256k1.computePubkey(priv, false));
  check(
    pub ===
      '04C591A8FF19AC9C4E4E5793673B83123437E975285E7B442F4EE2654DFFCA5E2D2103ED494718C697AC9AEBCFD19612E224DB46661011863ED2FC54E71861E2A6',
    'testPubKeyCreatePos'
  );
  pub = utils.encodeHex(await secp256k1.computePubkey(priv, true));
  check(
    pub ===
      '02C591A8FF19AC9C4E4E5793673B83123437E975285E7B442F4EE2654DFFCA5E2D',
    'testPubKeyCreatePos2'
  );

  priv = utils.decodeHex(
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
  );
  pub = utils.encodeHex(await secp256k1.computePubkey(priv, false));
  check(pub === '', 'testPubKeyCreateNeg');

  data = utils.decodeHex(
    'CF80CD8AED482D5D1527D7DC72FCEFF84E6326592848447D2DC0B0E87DFC9A90'
  );
  priv = utils.decodeHex(
    '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
  );
  sig = utils.encodeHex(await secp256k1.sign(data, priv));
  check(
    sig ===
      '30440220182A108E1448DC8F1FB467D06A0F3BB8EA0533584CB954EF8DA112F1D60E39A202201C66F36DA211C087F3AF88B50EDF4F9BDAA6CF5FD6817E74DCA34DB12390C6E9',
    'testSignPos'
  );

  sig = await secp256k1.base64.sign(
    utils.encodeBase64(data),
    utils.encodeBase64(priv)
  );
  check(
    sig ===
      'MEQCIBgqEI4USNyPH7Rn0GoPO7jqBTNYTLlU742hEvHWDjmiAiAcZvNtohHAh/OviLUO30+b2qbPX9aBfnTco02xI5DG6QA=',
    'testBase64SignPos'
  );

  priv = utils.decodeHex(
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
  );
  sig = utils.encodeHex(await secp256k1.sign(data, priv));
  check(sig === '', 'testSignNeg');

  priv = utils.decodeHex(
    '67E56582298859DDAE725F972992A07C6C4FB9F62A8FFF58CE3CA926A1063530'
  );
  data = utils.decodeHex(
    '3982F19BEF1615BCCFBB05E321C10E1D4CBA3DF0E841C2E41EEB6016347653C3'
  );
  let tweak = utils.encodeHex(await secp256k1.privKeyTweakAdd(priv, data));
  check(
    tweak ===
      'A168571E189E6F9A7E2D657A4B53AE99B909F7E712D1C23CED28093CD57C88F3',
    'testPrivKeyAdd'
  );

  tweak = utils.encodeHex(await secp256k1.privKeyTweakMul(priv, data));
  check(
    tweak ===
      '97F8184235F101550F3C71C927507651BD3F1CDB4A5A33B8986ACF0DEE20FFFC',
    'testPrivKeyMul'
  );

  pub = utils.decodeHex(
    '040A629506E1B65CD9D2E0BA9C75DF9C4FED0DB16DC9625ED14397F0AFC836FAE595DC53F8B0EFE61E703075BD9B143BAC75EC0E19F82A2208CAEB32BE53414C40'
  );
  tweak = utils.encodeHex(await secp256k1.pubKeyTweakAdd(pub, data));
  check(
    tweak ===
      '0411C6790F4B663CCE607BAAE08C43557EDC1A4D11D88DFCB3D841D0C6A941AF525A268E2A863C148555C48FB5FBA368E88718A46E205FABC3DBA2CCFFAB0796EF',
    'testPubKeyAdd'
  );

  tweak = utils.encodeHex(await secp256k1.pubKeyTweakMul(pub, data));
  check(
    tweak ===
      '04E0FE6FE55EBCA626B98A807F6CAF654139E14E5E3698F01A9A658E21DC1D2791EC060D4F412A794D5370F672BC94B722640B5F76914151CFCA6E712CA48CC589',
    'testPubKeyMul'
  );

  data = utils.encodeHex(await secp256k1.createECDHSecret(priv, pub));
  check(
    data === '2A2A67007A926E6594AF3EB564FC74005B37A9C8AEF2033C4552051B5C87F043',
    'testCreateECDHSecret'
  );

  let check_array = [
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
  let pass_array = [
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
      check(false, enc);
    }
    if (!(await testEncrypt(skey1, skey2, enc, dec))) {
      check(false, `${enc} decryption`);
    }
  }
}
