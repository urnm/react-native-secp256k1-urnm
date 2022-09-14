export interface ValidateTestCaseResult {
  title: string;
  passed: boolean;
  message: string;
  negative: boolean;
}

export const validateTestCase = async (
  ctx: (result: ValidateTestCaseResult) => void,
  title: string,
  fn: () => Promise<boolean>,
  negative = false
): Promise<ValidateTestCaseResult> => {
  const result: ValidateTestCaseResult = {
    title,
    passed: negative,
    message: '',
    negative,
  };

  try {
    const res = await fn();
    if (res) {
      result.passed = !negative;
    }
  } catch (e) {
    if (e instanceof Error) {
      result.message = e.message;
    } else {
      console.error(e);
    }
  }

  ctx(result);

  return result;
};
