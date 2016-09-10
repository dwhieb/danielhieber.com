// NB: listeners should be removed BEFORE the new CategoryView is instantiated

const CategoryView = class CategoryView extends View {
  constructor(model) {

    const el = document.getElementById('details');

    super(el, model);

    this.nodes = {};

  }

  remove() {
    this.removeListeners();
    this.hide();
  }

  render() {
    this.nodes.description.innerHTML = this.model.description;
    this.nodes.id.innerHTML          = this.model.id;
    this.nodes.name.innerHTML        = this.model.name;
    this.display();
  }

};
