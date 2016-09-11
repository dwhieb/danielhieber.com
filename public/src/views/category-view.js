const CategoryView = class CategoryView extends View {
  constructor(model) {

    const el = document.getElementById('details');

    super(el, model);

    this.nodes = {
      description:  document.getElementById('description'),
      id:           document.getElementById('id'),
      name:         document.getElementById('name'),
      saveButton:   document.getElementById('saveButton'),
      deleteButton: document.getElementById('deleteButton'),
    };

    // event listeners
    this.el.addEventListener('change', ev => {
      console.log(ev.target);
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
    this.nodes.description.innerHTML = this.model.description;
    this.nodes.id.innerHTML          = this.model.id;
    this.nodes.name.innerHTML        = this.model.name;
    this.display();
  }

};

const view = new CategoryView({}).render();
