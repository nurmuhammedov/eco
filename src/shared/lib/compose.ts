// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function compose(...funcs: Array<Function>): Function {
  if (funcs.length === 0) {
    return <T>(arg: T): T => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args)),
  );
}
