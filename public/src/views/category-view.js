(() => {

  const View = modules.View;

  const CategoryView = class CategoryView extends View {
    constructor(model) {

      super(app.nodes.details, model);

      this.nodes = {
        description:  this.databind(this.el.querySelector('p:nth-child(2)')),
        id:           this.databind(this.el.querySelector('p:first-child')),
        name:         this.databind(this.el.querySelector('h2')),
      };

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

  modules.CategoryView = CategoryView;

})();
