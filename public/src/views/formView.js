/* global cv, Model, View */

const FormView = (function FormViewWrapper() {

  const templates = document.querySelectorAll('#templates template');
  const templateNames = Array.from(templates).map(template => template.id);

  const getTemplate = prop => document.getElementById(`${prop}template`);

  const FormView = class FormView extends View {
    constructor(data = {}, type) {

      const el = document.getElementById('formItems');

      super(el, null, data);

      if (typeof type === 'string' || typeof data.type === 'string') {
        this.type = type || data.type;
      } else {
        throw new Error('Please include a "type" argument or attribute.');
      }

      this.nodes = {
        buttons: View.bind(document.getElementById('buttons')),
      };

    }

    destroy() {
      this.removeListeners();
      this.hide();
      this.el.innerHTML = '';
      this.emit('destroy');
    }

    // - populate template
    // - insert into DOM
    // - add listeners (if necessary)
    populate(prop, fragment, model) {

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

      if (textInputProps.includes(prop) && model[prop]) {
        const input = fragment.content.querySelector('input');
        input.value = model[prop];
        return this.el.appendChild(fragment);
      }

      const simpleProps = {
        competency:      'select[name="competency"]',
        description:     'textarea[name="description"]',
        email:           'input[name="email"]',
        endYear:         'input[name="endYear"]',
        phone:           'input[name="phone"]',
        proficiencyType: 'input[name="proficiencyType"]',
        publicationType: 'input[name="publicationType"]',
        startYear:       'input[name="startYear"]',
        year:            'input[name="year"]',
      };

      if (prop in simpleProps && model[prop]) {

        this.el.appendChild(fragment);

        this.el.querySelector(simpleProps[prop]).addEventListener('change', ev => {
          model.update({ [prop]: ev.target.value });
        });

        return this.el;

      }

      /* eslint-disable no-param-reassign */
      switch (prop) {

        case 'achievements': {

          const button = fragment.content.querySelector('button');
          const li     = fragment.content.querySelector('li');
          const ul     = fragment.content.querySelector('ul');

          const populateAchievement = (listItem, data) => {

            const img = listItem.querySelector('img');
            const input = listItem.querySelector('input');
            const random = Math.random();

            input.value = data;
            input.dataset.id = random;
            img.dataset.id = random;

          };

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

          this.el.appendChild(fragment);

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

          const fieldset    = fragment.content.querySelector('fieldset');
          const label       = fragment.content.querySelector('label');
          const addCategory = (label, category) => {
            const p       = label.querySelector('p');
            const input   = label.querySelector('input');
            p.textContent = category.title;
            input.value   = category.key;
            input.name    = category.key;
          };

          if (cv.categories.length) {

            addCategory(label, cv.categories[0]);

            cv.categories.slice(1).forEach(cat => {
              const checkboxItem = label.cloneNode(true);
              addCategory(checkboxItem, cat);
              fieldset.appendChild(checkboxItem);
            });

            const categoryKeys = cv.categories.map(cat => cat.key);

            model.categories.forEach(cat => {
              if (categoryKeys.includes(cat)) {
                fragment.content.querySelector(`input[name="${cat.key}"]`).checked = true;
              }
            });

          } else {

            label.remove();

          }

          this.el.appendChild(fragment);

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

          this.el.appendChild(fragment);

          const waitTime = 1000;

          const debouncedListener = debounce(ev => {
            model.update({ date: new Date(ev.target.value) });
          }, waitTime);

          this.el.querySelector('input[name="date"]').addEventListener('change', debouncedListener);

          break;

        }

        case 'links': {

          const button    = fragment.content.querySelector('button');
          const linkTypes = Object.keys(model.links);
          const li        = fragment.content.querySelector('li');
          const ul        = fragment.content.querySelector('ul');

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

          this.el.appendChild(fragment);

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

              const select = ul.querySelector(`select[data-id="${ev.target.dataset.random}"]`);

              Reflect.deleteProperty(model.links, select.value);
              select.parentNode.remove();
              model.emit('update', model);

            }
          });

          break;

        }

        default: {
          return null;
        }

      }

      /* eslint-enable no-param-reassign */

      return this.el;

    }

    render() {

      this.el.model.removeListeners(); // remove existing listeners
      this.el.innerHTML = ''; // clear the view

      const props = Model.whitelist[this.type];

      props.forEach(prop => {
        if (templateNames.includes(prop)) {

          const template = getTemplate(prop);
          const clone = template.content.cloneNode(true);
          const el = this.populate(prop, clone, this.model);

          if (!el) {

            const message = `Form element for the property "${prop}" not found.`;

            this.hide();
            alert(message);
            throw new Error(message);

          }

        }
      });

      this.el.addEventListener('change', ev => {
        if (ev.target.tagName === 'INPUT' && ev.target.type === 'text') {
          this.model.update({ [ev.target.name]: ev.target.value });
        }
      });

      this.nodes.buttons.addEventListener('click', ev => {

        const handleError = err => {
          this.hide();
          this.el.innerHTML = `<pre>${JSON.stringify(err, null, 2)}</pre>`;
          this.display();
        };

        if (ev.target.id === 'saveButton') {
          this.model.save()
          .then(res => {
            this.model = res;
          })
          .catch(handleError);
        } else if (ev.target.id === 'deleteButton') {
          this.model.destroy()
          .then(() => this.destroy())
          .catch(handleError);
        }

      });

    }

  };

  return FormView;

}());
