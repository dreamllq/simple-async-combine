import Deferred from 'simple-deferred2';

const asyncCombine = (func, options?:{ignoreArguments?: boolean}) => {
  const deferredSetMap: {[index: string]: Deferred<any>[]} = {};

  const handle = async (...args) => {
    const key = options?.ignoreArguments === true ? 'default' : JSON.stringify(args);
    const res = await func(...args);

    deferredSetMap[key].forEach(deferred => {
      deferred.resolve!(res);
    });
    delete deferredSetMap[key];
  };
  
  return (...args) => {
    const key = options?.ignoreArguments === true ? 'default' : JSON.stringify(args);
    deferredSetMap[key] = deferredSetMap[key] || [];
    const deferred = new Deferred();
    if (deferredSetMap[key].length === 0) {
      handle(...args);
    }
    deferredSetMap[key].push(deferred);
    return deferred.promise;
  };
};

export default asyncCombine;