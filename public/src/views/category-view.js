const CategoryView = class CategoryView extends View {
  constructor(model) {

    const el = document.getElementById('details');

    super(el, model);

    this.nodes = {
      name:         document.getElementById('name'),
      id:           document.getElementById('id'),
      description:  document.getElementById('description'),
      saveButton:   document.getElementById('saveButton'),
      deleteButton: document.getElementById('deleteButton'),
    };

    // event listeners
    this.el.addEventListener('change', ev => {
      if (ev.target.id in this.nodes) {
        this.model.update({ [ev.target.id]: ev.target.value });
      }
    });

    this.nodes.saveButton.addEventListener('click', this.model.save);

    this.nodes.deleteButton.addEventListener('click', () => {
      this.model.delete();
      this.remove();
    });

  }

  remove() {
    this.stopListening();
    this.hide();
  }

  render() {
    this.nodes.description.value = this.model.description;
    this.nodes.id.value          = this.model.id;
    this.nodes.name.value        = this.model.name;
    this.display();
    return this;
  }

};

const view = new CategoryView({}).render();
