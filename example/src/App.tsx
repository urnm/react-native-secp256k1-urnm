import * as React from 'react';

import { ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';

import { runTestCases, TestCaseGroup } from './testCases';

export default function App() {
  const [testGroups, setTestGroups] = React.useState<TestCaseGroup[]>([]);
  const [testAllResults, setTestAllResults] = React.useState<{
    all: number;
    failed: number;
    passed: number;
    result: 'pass' | 'reject' | null;
  } | null>(null);

  React.useEffect(() => {
    const run = async () => {
      setTestGroups([]);

      const res = await runTestCases((result) => {
        setTestGroups((prev) => [...prev, result]);
      });
      const all = res.reduce((acc, item) => acc + item.count, 0);
      const failed = res.reduce(
        (acc, item) => acc + item.count - item.passed,
        0
      );
      const passed = res.reduce((acc, item) => acc + item.passed, 0);
      setTestAllResults({
        all,
        failed,
        passed,
        result: all === passed ? 'pass' : 'reject',
      });
    };
    run();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            Welcome to {'\n'} react-native-secp256k1-urnm
          </Text>
          <View style={{ width: '100%' }}>
            {testGroups.map((group) => (
              <View key={group.title} style={styles.group}>
                <View style={styles.groupTitleRow}>
                  <Text style={styles.title}>{group.title}:</Text>
                  <Text style={styles.groupCount}>
                    {group.passed}/{group.count}
                  </Text>
                </View>
                <View style={styles.groupCases}>
                  {group.cases.map((tC, index) => (
                    <View
                      key={index}
                      style={[
                        styles.instructionsGroup,
                        group.cases.length - 1 === index && { marginBottom: 0 },
                      ]}
                    >
                      <View style={styles.instructionsGroupRow}>
                        <View style={styles.row}>
                          {tC.negative && (
                            <Text style={styles.negativeLabel}>[Neg]</Text>
                          )}
                          <Text
                            style={styles.instructionsText}
                            numberOfLines={1}
                          >
                            {tC.title}
                          </Text>
                        </View>

                        <Text
                          style={
                            tC.passed ? styles.textPass : styles.textReject
                          }
                        >
                          {tC.passed ? 'pass' : 'reject'}
                        </Text>
                      </View>
                      {tC.negative && tC.message.length > 0 && (
                        <View style={styles.negative}>
                          <Text style={styles.negativeText}>{tC.message}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {testAllResults && (
        <View style={styles.res}>
          <View style={[styles.instructions]}>
            <Text style={{ fontWeight: '700' }}>All tests result:</Text>
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
          <View style={styles.rowResult}>
            <Text style={{ marginRight: 10 }}>
              All count:{' '}
              <Text style={styles.textCount}>{testAllResults.all}</Text>
            </Text>
            <Text style={{ marginRight: 10 }}>
              Passed:{' '}
              <Text style={styles.textCount}>{testAllResults.passed}</Text>
            </Text>
            <Text>
              Failed:{' '}
              <Text style={styles.textCount}>{testAllResults.failed}</Text>
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginBottom: 40,
  },
  group: {
    marginBottom: 15,
  },
  groupTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  groupCases: {
    paddingLeft: 8,
    borderLeftColor: '#949494',
    borderLeftWidth: 4,
    borderStyle: 'solid',
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
  },
  groupCount: {
    fontWeight: '700',
  },
  instructionsGroup: {
    marginBottom: 2,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionsGroupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  negative: {
    paddingVertical: 4,
    marginBottom: 8,
    borderLeftColor: '#f36500',
    borderLeftWidth: 2,
    paddingLeft: 4,
  },
  negativeText: {
    color: '#f36500',
    fontSize: 10,
  },
  instructions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
    width: '100%',
  },
  instructionsText: {
    fontSize: 13,
    color: '#333333',
  },
  textPass: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: '#11b610',
    fontWeight: '700',
    color: '#fff',
  },
  textReject: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    backgroundColor: '#cb140c',
    fontWeight: '700',
    color: '#fff',
  },
  negativeLabel: {
    color: '#f36500',
    fontWeight: '700',
    fontSize: 12,
  },
  textCount: {
    fontWeight: '700',
  },
  rowResult: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  res: {
    width: '100%',
    borderTopColor: '#949494',
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
