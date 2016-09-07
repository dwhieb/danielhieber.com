(() => {

  const Collection = class Collection extends Array {
    constructor(data) {
      super(...data);

      // NB: extending native classes is not supported by Babel
      // these methods have to be added in the constructor

      this.add = model => {
        this.push(model);
      };

      this.remove = model => {
        const i = this.findIndex(el => model === el);
        this.splice(i, 1);
      };

    }
  };

  modules.Collection = new Proxy(Collection, {
    construct(target, args) {
      if (!Array.isArray(args[0])) throw new Error('Collection must be an array.');
      return Reflect.construct(target, args);
    },
  });

})();
