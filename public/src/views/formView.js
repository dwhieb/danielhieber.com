/* global app, Model, View */

const FormView = (function FormViewWrapper() {

  const templates = document.querySelectorAll('#templates template');
  const templateNames = Array.from(templates).map(template => template.id.replace('-template', ''));

  const getTemplate = prop => document.getElementById(`${prop}-template`);

  const FormView = class FormView extends View {
    constructor(data = {}, type) {

      const el = document.getElementById('details');

      super(el, null, data);

      if (typeof type === 'string' || typeof data.type === 'string') {
        this.type = type || data.type;
      } else {
        throw new Error('Please include a "type" argument or attribute.');
      }

      this.nodes = {
        buttons:      View.bind(document.getElementById('buttons')),
        formItems:    View.bind(document.getElementById('formItems')),
      };

    }

    destroy() {
      this.removeListeners();
      this.hide();
      this.nodes.formItems.innerHTML = '';
      this.emit('destroy');
    }

    displayError(err) {
      const message = err instanceof Error ? err.message : JSON.stringify(err, null, 2);
      this.hide();
      this.nodes.formItems.innerHTML = `<code>${message}</code>`;
      this.display();
    }

    // - populate template
    // - insert into DOM
    // - add listeners (if necessary)
    populate(prop, clone, model) {

      const textInputProps = [
        'abbreviation',
        'author',
        'autonym',
        'key',
        'location',
        'name',
        'organization',
        'program',
        'publication',
        'role',
        'title',
      ];

      if (textInputProps.includes(prop)) {
        const input = clone.querySelector(`input[name="${prop}"]`);
        if (model[prop]) input.value = model[prop];
        return this.nodes.formItems.appendChild(clone);
      }

      const simpleProps = {
        competency:      'select[name=competency]',
        description:     'textarea[name=description]',
        email:           'input[name=email]',
        endYear:         'input[name=endYear]',
        phone:           'input[name=phone]',
        proficiencyType: 'select[name=proficiencyType]',
        publicationType: 'select[name=publicationType]',
        startYear:       'input[name=startYear]',
        year:            'input[name=year]',
      };

      if (prop in simpleProps) {

        this.nodes.formItems.appendChild(clone);

        const input = this.nodes.formItems.querySelector(simpleProps[prop]);

        if (model[prop]) input.value = model[prop];

        input.addEventListener('change', ev => {
          model.update({ [prop]: ev.target.value });
        });

        return this.nodes.formItems;

      }

      /* eslint-disable no-param-reassign */
      switch (prop) {

        case 'achievements': {

          const button = clone.querySelector('button');
          const li     = clone.querySelector('li');
          const ul     = clone.querySelector('ul');

          const populateAchievement = (listItem, data) => {

            const img =    listItem.querySelector('img');
            const input =  listItem.querySelector('input');
            const random = Math.random();

            input.value = data;
            input.dataset.id = random;
            img.dataset.id = random;

          };

          model.achievements = model.achievements || [];

          if (model.achievements.length) {

            populateAchievement(li, model.achievements[0]);

            model.achievements.slice(1).forEach(ach => {
              const listItem = li.cloneNode(true);
              populateAchievement(listItem, ach);
              ul.appendChild(listItem);
            });

          } else {

            li.remove();

          }

          this.nodes.formItems.appendChild(clone);

          button.addEventListener('click', () => {
            const listItem = li.cloneNode(true);
            populateAchievement(listItem, '');
            ul.appendChild(listItem);
            model.achievements.push('');
            model.emit('update', model);
          });

          ul.addEventListener('change', () => {
            const achievements = Array.from(ul.querySelectorAll('input')).map(input => input.value);
            model.update({ achievements });
          });

          ul.addEventListener('click', ev => {
            if (ev.target.tagName === 'IMG') {

              const input = ul.querySelector(`input[data-id="${ev.target.dataset.random}"]`);
              const i = model.achievements.indexOf(input.value);

              input.parentNode.remove();

              if (i >= 0) {
                model.achievements.splice(i, 1);
                model.emit('update', model);
              }

            }
          });

          break;

        }

        case 'categories': {

          const fieldset    = clone.querySelector('fieldset');
          const label       = clone.querySelector('label');
          const addCategory = (label, category) => {
            const p       = label.querySelector('i');
            const input   = label.querySelector('input');
            p.textContent = category.title;
            input.value   = category.key;
            input.name    = category.key;
          };

          if (app.categories.length) {

            addCategory(label, app.categories[0]);

            app.categories.slice(1).forEach(cat => {
              const checkboxItem = label.cloneNode(true);
              addCategory(checkboxItem, cat);
              fieldset.appendChild(checkboxItem);
            });

            const categoryKeys = app.categories.map(cat => cat.key);

            model.categories = model.categories || [];

            model.categories.forEach(cat => {
              if (categoryKeys.includes(cat)) {
                clone.querySelector(`input[name="${cat.key}"]`).checked = true;
              }
            });

          } else {

            label.remove();

          }

          this.nodes.formItems.appendChild(clone);

          fieldset.addEventListener('change', ev => {

            const checked = ev.target.checked;
            const key = ev.target.name;

            if (checked) {
              const cats = new Set(model.categories);
              cats.add(key);
              model.categories = Array.from(cats);
              model.emit('update', model);
            } else {
              const i = model.categories.indexOf(key);
              if (i >= 0) {
                model.categories.splice(i, 1);
                model.emit('update', model);
              }
            }

          });

          break;

        }

        case 'date': {

          this.nodes.formItems.appendChild(clone);

          const waitTime = 1000;

          const debouncedListener = debounce(ev => {
            model.update({ date: new Date(ev.target.value) });
          }, waitTime);

          this.nodes.formItems.querySelector('input[name="date"]').addEventListener('change', debouncedListener);

          break;

        }

        case 'links': {

          model.links = model.links || {};

          const button    = clone.querySelector('button');
          const linkTypes = Object.keys(model.links);
          const li        = clone.querySelector('li');
          const ul        = clone.querySelector('ul');

          const populateLink = (listItem, linkType, link) => {

            const img    = listItem.querySelector('img');
            const input  = listItem.querySelector('input');
            const select = listItem.querySelector('select');
            const random = Math.random();

            input.value       = link;
            input.dataset.id  = random;
            img.dataset.id    = random;
            select.dataset.id = random;

            if (linkType) select.value = linkType;

          };

          if (linkTypes.length) {

            populateLink(li, linkTypes[0], model.links[linkTypes[0]]);

            linkTypes.slice(1).forEach(linkType => {
              const listItem = li.cloneNode(true);
              populateLink(listItem, linkType, model.links[linkType]);
              ul.appendChild(listItem);
            });

          } else {

            li.remove();

          }

          this.nodes.formItems.appendChild(clone);

          button.addEventListener('click', () => {
            const listItem = li.cloneNode(true);
            populateLink(listItem, null, '');
            ul.appendChild(listItem);
          });

          ul.addEventListener('change', ev => {
            if (ev.target.name === 'linkType') {

              const input = ul.querySelector(`input[data-id="${ev.target.dataset.id}"]`);

              for (const linkType in model.links) {
                if (model.links.hasOwnProperty(linkType)) {
                  if (model.links[linkType] === input.value) {
                    Reflect.deleteProperty(model.links, linkType);
                  }
                }
              }

              model.links[ev.target.value] = input.value;
              model.emit('update', model);

            }
          });

          ul.addEventListener('click', ev => {
            if (ev.target.tagName === 'IMG') {

              const confirmed = confirm('Are you sure you want to delete this item?');

              if (confirmed) {
                const select = ul.querySelector(`select[data-id="${ev.target.dataset.random}"]`);
                Reflect.deleteProperty(model.links, select.value);
                select.parentNode.remove();
                model.emit('update', model);
              }

            }
          });

          break;

        }

        default: {
          return null;
        }

      }

      /* eslint-enable no-param-reassign */

      return this.nodes.formItems;

    }

    render() {

      this.el.removeListeners(); // remove existing listeners
      this.nodes.formItems.innerHTML = ''; // clear the view

      const props = Model.whitelist[this.type];

      props.forEach(prop => {
        if (templateNames.includes(prop)) {

          const template = getTemplate(prop);

          if (!template) {
            const err = new Error(`Template not found for property "${prop}".`);
            this.displayError(err);
            throw err;
          }

          const clone = template.content.cloneNode(true);
          const el = this.populate(prop, clone, this.model);

          if (!el) {
            const err = new Error(`Form element for the property "${prop}" not found.`);
            this.displayError(err);
            throw err;
          }

        }
      });

      this.el.addEventListener('change', ev => {
        if (ev.target.tagName === 'INPUT' && ev.target.type === 'text') {
          this.model.update({ [ev.target.name]: ev.target.value });
        }
      });

      this.nodes.buttons.addEventListener('click', ev => {

        ev.preventDefault();

        if (ev.target.id === 'saveButton') {

          this.model.save()
          .then(res => {
            this.model = res;
            this.removeListeners();
            this.render();
          })
          .catch(err => this.displayError(err));

        } else if (ev.target.id === 'deleteButton') {

          const confirmed = confirm('Are you sure you want to delete this item?');

          if (confirmed) {
            this.model.destroy()
            .then(() => {
              this.destroy();
              this.emit('destroy');
            })
            .catch(err => this.displayError(err));
          }

        }

      });

      this.display();

    }

  };

  return FormView;

}());
