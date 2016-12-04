/* global app, debounce, Model, View */

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
      buttons: View.bind(document.getElementById('buttons')),
      form:    View.bind(document.getElementById('form')),
    };

  }

  // destroy this view, removing any existing listeners
  destroy() {
    this.hide();
    this.removeListeners();
    this.nodes.form.innerHTML = '';
  }

  /* eslint-disable no-param-reassign */

  // - populate template
  // - insert into DOM
  // - add listeners (if necessary)
  populate(prop, clone, model) {

    if (this.textProps.includes(prop)) {
      const input = clone.querySelector(`input[name="${prop}"]`);
      if (model[prop]) input.value = model[prop];
      return this.nodes.form.appendChild(clone);
    }

    const simpleProps = {
      competency:      'select[name=competency]',
      description:     'textarea[name=description]',
      email:           'input[name=email]',
      phone:           'input[name=phone]',
      proficiencyType: 'select[name=proficiencyType]',
      publicationType: 'select[name=publicationType]',
    };

    if (prop in simpleProps) {

      this.nodes.form.appendChild(clone);

      const input = this.nodes.form.querySelector(simpleProps[prop]);

      if (model[prop]) {
        input.value = model[prop];
      } else if (simpleProps[prop].includes('select')) {
        model[prop] = input.value;
      }

      input.addEventListener('change', ev => model.update({ [prop]: ev.target.value }));

      return input;

    }

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

        this.nodes.form.appendChild(clone);

        button.addEventListener('click', () => {
          const listItem = li.cloneNode(true);
          populateAchievement(listItem, '');
          ul.appendChild(listItem);
          model.achievements.push('');
        });

        ul.addEventListener('change', () => {
          const achievements = Array.from(ul.querySelectorAll('input')).map(input => input.value);
          model.update({ achievements });
        });

        ul.addEventListener('click', ev => {
          if (ev.target.tagName === 'IMG') {

            const confirmed = confirm('Are you sure you want to delete this item?');

            if (confirmed) {

              const input = ul.querySelector(`input[data-id="${ev.target.dataset.id}"]`);
              const i = model.achievements.indexOf(input.value);

              input.parentNode.remove();

              if (i >= 0) {
                model.achievements.splice(i, 1);
              }

            }

          }
        });

        break;

      }

      case 'categories': {

        const fieldset         = clone.querySelector('fieldset');
        const label            = clone.querySelector('label');
        const populateCategory = (label, category) => {
          const p       = label.querySelector('i');
          const input   = label.querySelector('input');
          p.textContent = category.title;
          input.value   = category.key;
          input.name    = category.key;
        };

        if (app.categories.length) {

          app.categories.sort((a, b) => a.title > b.title);

          populateCategory(label, app.categories[0]);

          app.categories.slice(1).forEach(cat => {
            const checkboxItem = label.cloneNode(true);
            populateCategory(checkboxItem, cat);
            fieldset.appendChild(checkboxItem);
          });

          const categoryKeys = app.categories.map(cat => cat.key);

          model.categories = model.categories || [];

          model.categories.forEach(cat => {
            if (categoryKeys.includes(cat)) {
              clone.querySelector(`input[name="${cat}"]`).checked = true;
            }
          });

        } else {

          label.remove();

        }

        this.nodes.form.appendChild(clone);

        fieldset.addEventListener('change', ev => {

          const checked = ev.target.checked;
          const key = ev.target.name;

          if (checked) {
            const cats = new Set(model.categories);
            cats.add(key);
            model.categories = Array.from(cats);
          } else {
            const i = model.categories.indexOf(key);
            if (i >= 0) {
              model.categories.splice(i, 1);
            }
          }

        });

        break;

      }

      case 'date': {

        this.nodes.form.appendChild(clone);

        const input = this.nodes.form.querySelector('input[name=date]');
        const waitTime = 1000;
        const debouncedListener = debounce(ev => {
          model.update({ date: new Date(ev.target.value) });
        }, waitTime);

        input.value = model.date ? new Date(model.date).toISOString().slice(0, 10) : '';
        input.addEventListener('change', debouncedListener);

        break;

      }

      case 'endYear': {

        this.nodes.form.appendChild(clone);

        const input = this.nodes.form.querySelector('input[name=endYear]');

        if (model.endYear) input.value = model.endYear;

        input.addEventListener('change', () => {
          const endYear = isNaN(input.value) ? input.value : Number(input.value);
          model.update({ endYear });
        });

        return input;

      }

      case 'files': {

        this.nodes.form.appendChild(clone);

        const ul     = this.nodes.form.querySelector('fieldset[name=files] ul');
        const input  = this.nodes.form.querySelector('input[name=file]');
        const upload = document.getElementById('uploadFileButton');

        model.files = model.files || {};

        Object.keys(model.files).forEach(filename => ul.insertAdjacentHTML('beforeend', `
          <li>
            <p><a href='${model.files[filename]}'>${filename}</a></p>
            <img
              data-filename="${filename}"
              src=/img/icons/delete.svg
              alt='delete this file'
            >
          </li>
        `));

        ul.addEventListener('click', ev => {
          if (ev.target.tagName === 'IMG') {
            socket.emit('deleteFile', ev.target.dataset.filename, err => {
              if (err) return app.displayError(err, 'Error deleting file.');

              delete model.files[ev.target.dataset.filename];

              model.save()
              .then(res => {
                this.model.update(res);
                app.list.render();
                this.render();
              }).catch(err => app.displayError(err));

            });
          }
        });

        upload.addEventListener('click', () => {

          if (!input.files.length) {
            return app.displayError(new Error('Please select a file to upload.'));
          }

          const file = input.files[0];

          if (!file.name.endsWith('.pdf')) {
            return app.displayError(new Error('The file to upload must have a .pdf extension.'));
          }

          socket.emit('upsertFile', file.name, input.files[0], (err, res) => {

            if (err) return app.displayError(err);

            model.files[file.name] = `https://danielhieber.blob.core.windows.net/publications/${res.name}`;

            this.model.save()
            .then(res => {
              this.model.update(res);
              this.render();
            }).catch(err => app.displayError(err));

          });

        });

        return input;

      }

      case 'links': {

        model.links = model.links || {};

        const button    = clone.querySelector('button');
        const linkTypes = Object.keys(model.links);
        const li        = clone.querySelector('li');
        const ul        = clone.querySelector('ul');
        let currentType = null;

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

        this.nodes.form.appendChild(clone);

        button.addEventListener('click', () => {
          const listItem = li.cloneNode(true);
          populateLink(listItem, null, '');
          ul.appendChild(listItem);
        });

        ul.addEventListener('focus', ev => {
          if (ev.target.name === 'linkType') {
            currentType = ev.target.value;
          }
        });

        ul.addEventListener('change', ev => {

          const input = ul.querySelector(`input[data-id="${ev.target.dataset.id}"]`);
          const type = ul.querySelector(`select[data-id="${ev.target.dataset.id}"]`).value;

          if (ev.target.name === 'linkType') {
            Reflect.deleteProperty(model.links, currentType);
          }

          model.links[type] = input.value;

        });

        ul.addEventListener('click', ev => {
          if (ev.target.tagName === 'IMG') {

            const confirmed = confirm('Are you sure you want to delete this item?');

            if (confirmed) {
              const select = ul.querySelector(`select[data-id="${ev.target.dataset.id}"]`);
              Reflect.deleteProperty(model.links, select.value);
              select.parentNode.remove();
            }

          }
        });

        break;

      }

      case 'startYear': {

        this.nodes.form.appendChild(clone);

        const input = this.nodes.form.querySelector('input[name=startYear]');

        if (model.startYear) input.value = model.startYear;

        input.addEventListener('change', ev => model.update({ startYear: Number(ev.target.value) }));

        return input;

      }

      case 'year': {

        this.nodes.form.appendChild(clone);

        const input = this.nodes.form.querySelector('input[name=year]');

        if (model.year) input.value = model.year;

        input.addEventListener('change', ev => model.update({ year: Number(ev.target.value) }));

        return input;

      }

      default: {
        return null;
      }

    }

    return this.nodes.form;

  }

  /* eslint-enable no-param-reassign */

  render() {

    const props = Model.whitelist[this.type];
    const templateNames = Array.from(app.templates).map(template => template.id.replace('-template', ''));

    this.removeListeners(); // remove existing listeners
    this.nodes.form.innerHTML = ''; // clear the view

    props.forEach(prop => {
      if (templateNames.includes(prop)) {

        const template = app.getTemplate(prop);

        if (!template) {
          const err = new Error(`Template not found for property "${prop}".`);
          app.displayError(err);
          throw err;
        }

        const clone = template.content.cloneNode(true);
        const el = this.populate(prop, clone, this.model);

        if (!el) {
          const err = new Error(`Form element for the property "${prop}" not found.`);
          app.displayError(err);
          throw err;
        }

      }
    });

    const waitTime = 5000;
    const debouncedListRender = debounce(app.list.render.bind(app.list), waitTime, true);
    const displayProps = [
      'location',
      'name',
      'organization',
      'title',
    ];

    this.el.addEventListener('change', ev => {
      if (ev.target.tagName === 'INPUT' && this.textProps.includes(ev.target.name)) {
        this.model.update({ [ev.target.name]: ev.target.value });
        if (displayProps.includes(ev.target.name)) debouncedListRender();
      }
    });

    this.nodes.buttons.addEventListener('click', ev => {

      if (ev.target.id === 'saveButton') {

        this.model.save()
        .then(res => {
          this.model.update(res);
          app.list.render();
          this.render();
        }).catch(err => app.displayError(err));

      } else if (ev.target.id === 'deleteButton') {

        const confirmed = confirm('Are you sure you want to delete this item?');

        if (confirmed) app.removeModel(this.model);

      }

    });

    this.nodes.buttons.display();
    this.display();

  }

  get textProps() {
    return [
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
  }

};
