/* global Emitter */

/* eslint-disable
  prefer-arrow-callback,
  no-empty-function,
  no-invalid-this,
  max-statements,
  newline-after-var,
  prefer-reflect
*/

describe('Emitter', function EmitterSpec() {

  it('new Emitter()', function newEmitterSpec() {
    expect(Emitter).toBeDefined();

    const passNothing = () => new Emitter();
    const passObj = () => new Emitter({});

    expect(passNothing).not.toThrow();
    expect(passObj).not.toThrow();

    const emitter = new Emitter();
    expect(emitter instanceof Object).toBe(true);
    expect(emitter instanceof Emitter).toBe(true);
  });

  it('Emitter.extend()', function extendSpec() {
    expect(Emitter.extend).toBeDefined();
    const obj = { hello: 'world' };
    const emitter = Emitter.extend(obj);
    const blankEmitter = Emitter.extend();
    expect(blankEmitter.emit).toBeDefined();
    expect(emitter.hello).toBe('world');
    expect(Object.is(emitter, obj)).toBe(true);
    expect(emitter.extend).toBeUndefined();
    Object.getOwnPropertyNames(Emitter.prototype).forEach(prop => {
      if (prop !== 'constructor') {
        expect(emitter[prop]).toBeDefined();
      }
    });
  });

  it('Emitter.prototype.emit()', function emitSpec() {
    const emitter = new Emitter();
    const emitUnregisteredEvent = () => emitter.emit('unregisteredEvent');
    expect(emitUnregisteredEvent).not.toThrow();
    this.cb = () => {};
    spyOn(this, 'cb');
    emitter.on('emitTest', this.cb);
    emitter.emit('emitTest');
    expect(this.cb).toHaveBeenCalledTimes(1);
  });

  it('Emitter.prototype.off()', function offSpec() {
    const emitter = new Emitter();
    const passBadEventName = () => emitter.off(true);
    const passUnregisteredEvent = () => emitter.off('unregistered');
    const cb1 = () => {};
    const cb2 = () => {};
    const cb3 = () => {};
    const cb4 = () => {};
    emitter.on('test1', cb1);
    emitter.on('test1', cb3);
    emitter.on('test1', cb4);
    emitter.on('test2', cb1);
    emitter.on('test2', cb2);
    emitter.on('test2', cb3);
    emitter.on('test3', cb3);
    emitter.on('test4', cb4);
    expect(passBadEventName).toThrow();
    expect(passUnregisteredEvent).toThrow();
    emitter.off(cb3); // tests removing cb from all events
    expect(emitter.listeners.test1.size).toBe(2);
    expect(emitter.listeners.test2.size).toBe(2);
    expect(emitter.listeners.test3).toBeUndefined();
    emitter.off('test1', cb1); // tests removing specific cb from specific event
    expect(emitter.listeners.test1.size).toBe(1);
    emitter.off('test2'); // tests removing all cbs from a specific event
    expect(emitter.listeners.test2).toBeUndefined();
    emitter.off(); // tests removing all listeners
    expect(Object.keys(emitter.listeners).length).toBe(0);
  });

  it('Emitter.prototype.on()', function onSpec() {
    const emitter = new Emitter();
    this.cb = () => {};
    const registerNonString = () => emitter.on(true, this.cb);
    const registerNonFunc = () => emitter.on('test', true);
    expect(registerNonString).toThrow();
    expect(registerNonFunc).toThrow();
    emitter.on('test', this.cb);
    expect(emitter.listeners.test.size).toBe(1);
    expect(emitter.listeners.test.has(this.cb)).toBe(true);
    emitter.emit('test');
    expect(emitter.listeners.test.size).toBe(1);
  });

  it('Emitter.prototype.once()', function onceSpec() {
    const emitter = new Emitter();
    const registerNonFunc = () => emitter.once('test', true);
    this.cb = () => {};
    spyOn(emitter, 'on').and.callThrough();
    spyOn(this, 'cb');
    expect(registerNonFunc).toThrow();
    emitter.once('test', this.cb);
    expect(emitter.on).toHaveBeenCalledTimes(1);
    expect(emitter.listeners.test.size).toBe(1);
    expect(emitter.listeners.test.has(this.cb)).toBe(false);
    emitter.emit('test');
    expect(emitter.listeners.test).toBeUndefined();
    expect(this.cb).toHaveBeenCalledTimes(1);
  });

  it('Emitter.prototype.listeners', function listenersSpec() {
    const emitter = new Emitter();
    expect(emitter.listeners instanceof Object).toBe(true);
    expect(Object.getOwnPropertyDescriptor(emitter, 'listeners').enumerable).toBe(false);
    emitter.listeners = null;
    expect(emitter.listeners).toBeDefined();
  });

});
