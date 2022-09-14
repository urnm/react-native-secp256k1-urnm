import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';

import { testCase } from './testCases';

type TestResult = { point?: string; result: 'pass' | 'reject' };

export default function App() {
  const [testResults, setTestResults] = React.useState<TestResult[]>([]);
  const [testAllResults, setTestAllResults] = React.useState<{
    all: number;
    failed: number;
    passed: number;
    result: 'pass' | 'reject' | null;
  }>({
    all: 0,
    failed: 0,
    passed: 0,
    result: null,
  });

  async function runTests() {
    let done_all = true;
    setTestResults([]);
    let all = 0;
    let failed = 0;
    let passed = 0;
    try {
      await testCase((result, point) => {
        console.log(`${point}: ${result ? 'pass' : 'reject'}\n`);
        const testResult: TestResult = {
          point,
          result: result ? 'pass' : 'reject',
        };
        all++;
        if (result) {
          passed++;
        } else {
          failed++;
        }
        setTestResults((prev) => [...prev, testResult]);
        if (!result) done_all = false;
      });
    } catch (e) {
      console.error(e);
      done_all = false;
    }

    setTestAllResults({
      all,
      failed,
      passed,
      result: done_all ? 'pass' : 'reject',
    });
  }

  React.useEffect(() => {
    runTests();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Welcome to {'\n'} react-native-secp256k1-urnm
      </Text>
      {testResults.map((testResult, index) => (
        <View key={index} style={styles.instructions}>
          <Text style={styles.instructionsText}>{testResult.point}: </Text>
          <Text
            style={
              testResult.result === 'pass' ? styles.textPass : styles.textReject
            }
          >
            {testResult.result}
          </Text>
        </View>
      ))}
      <View style={[styles.allResults, styles.instructions]}>
        <Text>
          All count: <Text style={styles.textCount}>{testAllResults.all}</Text>
        </Text>
      </View>
      <View style={[styles.instructions]}>
        <Text>
          Passed: <Text style={styles.textCount}>{testAllResults.passed}</Text>
        </Text>
      </View>
      <View style={[styles.instructions]}>
        <Text>
          Failed: <Text style={styles.textCount}>{testAllResults.failed}</Text>
        </Text>
      </View>
      <View style={[styles.instructions]}>
        <Text>All tests result:</Text>
        <Text
          style={
            testAllResults.result === 'pass'
              ? styles.textPass
              : styles.textReject
          }
        >
          {testAllResults.result}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 40,
  },
  instructions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    width: '100%',
  },
  instructionsText: {
    color: '#333333',
  },
  textPass: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: '#11b610',
    fontWeight: '700',
    color: '#fff',
  },
  textReject: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: '#cb140c',
    fontWeight: '700',
    color: '#fff',
  },
  textCount: {
    fontWeight: '700',
  },
  allResults: {
    marginTop: 30,
  },
});
