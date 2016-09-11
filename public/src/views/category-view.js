/* global View */

/* eslint-disable
  no-alert
*/

/**
 * A class representing a Category View
 * @type {Object} CategoryView
 */
const CategoryView = class CategoryView extends View {
  /**
   * Create a new CategoryView
   * @param {Object} model          The model to attach to the view
   */
  constructor(model) {

    // get the wrapper element for the category view
    const el = document.getElementById('details');

    // call the View class
    super(el, model);

    /**
     * An object containing references to each of the nodes used by this view
     * @type {Object}
     */
    this.nodes = {
      name:         document.getElementById('name'),
      id:           document.getElementById('id'),
      description:  document.getElementById('description'),
      saveButton:   document.getElementById('saveButton'),
      deleteButton: document.getElementById('deleteButton'),
    };

    // EVENT LISTENERS

    // update the model when the view changes
    this.el.addEventListener('change', ev => {
      if (ev.target.id in this.nodes) {
        this.model.update({ [ev.target.id]: ev.target.value });
      }
    });

    // save the model to the database when the Save button is clicked
    this.nodes.saveButton.addEventListener('click', this.model.save);

    // delete the model from the database when the delete button is clicked
    this.nodes.deleteButton.addEventListener('click', () => {

      const accepted = confirm('Are you sure you want to delete this category?');

      if (accepted) {
        this.model.delete();
        this.remove();
      }

    });

  }

  /**
   * Remove all event listeners from elements in this view, and hide (not delete) the view
   * @method
   */
  remove() {
    this.stopListening();
    this.hide();
  }

  /**
   * Renders this view, and displays the elements
   * @method
   * @return {Object} CategoryView        Returns the current instance of the category view
   */
  render() {
    this.nodes.description.value = this.model.description;
    this.nodes.id.value          = this.model.id;
    this.nodes.name.value        = this.model.name;
    this.display();
    return this;
  }

};
