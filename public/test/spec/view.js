/* global Collection, Model, View */

/* eslint-disable
  func-names,
  prefer-arrow-callback,
  no-empty-function
*/

describe('View', function ViewSpec() {

  it('new View()', function newViewSpec() {
    expect(View).toBeDefined();
    const p = document.createElement('p');
    const passNothing = () => new View();
    const passNoObj = () => new View(p);
    const passNonObj = () => new View(p, true);
    expect(passNothing).toThrow();
    expect(passNoObj).not.toThrow();
    expect(passNonObj).toThrow();
    const model = new Model({ id: 'test' });
    const coll = new Collection([]);
    const modelView = new View(p, model);
    const collView = new View(p, coll);
    expect(modelView instanceof View).toBe(true);
    expect(modelView.model).toBe(model);
    expect(modelView.collection).toBeUndefined();
    expect(collView.model).toBeUndefined();
    expect(collView.collection).toBe(coll);
    const pojoModel = { id: 'test' };
    const pojoColl = [pojoModel];
    const pojoModelView = new View(p, pojoModel);
    const pojoCollView = new View(p, pojoColl);
    expect(pojoModelView.model).not.toBe(pojoModel);
    expect(pojoCollView.model).not.toBe(pojoColl);
    expect(pojoCollView.collection[0].id).toBe(pojoModel.id);
  });

  it('View.bind()', function bindSpec() {
    const p = document.createElement('p');
    const el = View.bind(p);
    expect(el instanceof HTMLParagraphElement).toBe(true);
    expect(Array.isArray(el.listeners)).toBe(true);
  });

  it('View.prototype.destroy()', function destroySpec() {
    const p = document.createElement('p');
    p.textContent = 'Hello world!';
    document.body.appendChild(p);
    const view = new View(p, {});
    view.el.addEventListener('click', () => {});
    view.destroy();
    expect(view.el.listeners.length).toBe(0);
    expect(Array.from(document.body.children).includes(p)).toBe(false);
  });

  it('View.prototype.display()', function displaySpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    view.display();
    expect(p.style.display).toBe('flex');
  });

  it('View.prototype.hide()', function hideSpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    view.hide();
    expect(p.style.display).toBe('none');
  });

  it('View.prototype.removeListeners()', function removeListenersSpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    view.el.addEventListener('click', () => {});
    view.el.addEventListener('change', () => {});
    view.removeListeners();
    expect(view.el.listeners.length).toBe(0);
  });

  it('View.prototype.render()', function renderSpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    expect(view.render).toThrow();
  });

  it('View.prototype.el', function elSpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    expect(Object.is(view.el, p)).toBe(true);
  });

  it('View.prototype.el.addEventListener()', function addEventListenerSpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    const cb = () => {};
    view.el.addEventListener('click', cb);
    expect(view.el.listeners.length).toBe(1);
  });

  it('View.prototype.el.removeEventListener()', function removeEventListenerSpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    const cb = () => {};
    const removeBadOpts = () => view.el.removeEventListener('click', cb, true);
    view.el.addEventListener('click', cb);
    expect(view.el.listeners.length).toBe(1);
    expect(removeBadOpts).toThrow();
    view.el.removeEventListener('click', cb);
    expect(view.el.listeners.length).toBe(0);
  });

  it('View.prototype.nodes', function nodesSpec() {
    const p = document.createElement('p');
    const view = new View(p, {});
    expect(view.nodes).toBeDefined();
  });

});
