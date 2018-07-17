import Promise from './es6-promise.min';

export default Object.keys(wx).reduce((o, name) => {
  o[name] = promisify(wx[name]);
  return o;
}, {});

function promisify(fn) {
  if (typeof fn !== 'function') return fn;

  return (args = {}) => {
    if (!((typeof args === 'object') && args !== null)) {
      return fn.call(wx, args);
    }

    return new Promise((resolve, reject) => {
      args.success = resolve;
      args.fail = reject;

      fn.call(wx, args);
    });
  };
}
