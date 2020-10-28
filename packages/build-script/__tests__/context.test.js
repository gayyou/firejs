import {Context} from "../src/core/Context";

describe('It would test Context class', () => {
  const context = new Context({
    getBuildInPlugins: () => {},
    plugins: [],
    rootDir: './'
  });

  it('test custom methods', () => {
    let count = 0;
    let incre = 'increment';
    let decre = 'decrement';
    let {applyMethod} = context;

    context.registerMethod(incre, (num) => {
      count += num;
    });
    context.registerMethod(decre, (num) => {
      count -= num;
    });

    expect(count === 0).toBeTruthy();

    applyMethod(incre, 11);

    expect(count).toBe(11);

    applyMethod(decre, 12);

    expect(count).toBe(-1);
  });

  it('test hook', () => {
    let count = 0;
    let incre = 'increment';
    let decre = 'decrement';
    let {applyHook} = context;

    context.onHook(incre, (num) => {
      count += num;
    });
    context.onHook(decre, (num) => {
      count -= num;
    });

    expect(count === 0).toBeTruthy();

    applyHook(incre, 11);

    expect(count).toBe(11);

    applyHook(decre, 12);

    expect(count).toBe(-1);
  });
});
