/* global View */

const FormView = class FormView extends View {
  constructor(data = {}, type) {

    const el = document.getElementById('formItems');

    super(el, null, data);

    if (typeof type === 'string' || typeof data.type === 'string') {
      this.type = type || data.type;
    } else {
      throw new Error('Please include a "type" argument or attribute.');
    }

  }

  render() {
    // clear formItems
    // remove listeners from formItems
    // get properties for the given type from the whitelist hash
    // for each property:
    // - get its template
    // - populate its template
    // - append to formItems
    // - add listeners (if necessary)
    // add delegated event listener
    //
    // NB: create the properties to add and test them one at a time
  }

};
