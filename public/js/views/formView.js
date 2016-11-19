'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global cv, Model, View */

var FormView = function FormViewWrapper() {

  var templates = document.querySelectorAll('#templates template');
  var templateNames = Array.from(templates).map(function (template) {
    return template.id.replace('-template', '');
  });

  var getTemplate = function getTemplate(prop) {
    return document.getElementById(prop + '-template');
  };

  var FormView = function (_View) {
    _inherits(FormView, _View);

    function FormView() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var type = arguments[1];

      _classCallCheck(this, FormView);

      var el = document.getElementById('formItems');

      var _this = _possibleConstructorReturn(this, (FormView.__proto__ || Object.getPrototypeOf(FormView)).call(this, el, null, data));

      if (typeof type === 'string' || typeof data.type === 'string') {
        _this.type = type || data.type;
      } else {
        throw new Error('Please include a "type" argument or attribute.');
      }

      _this.nodes = {
        buttons: View.bind(document.getElementById('buttons')),
        form: View.bind(document.getElementById('details'))
      };

      return _this;
    }

    _createClass(FormView, [{
      key: 'destroy',
      value: function destroy() {
        this.removeListeners();
        this.hide();
        this.el.innerHTML = '';
        this.emit('destroy');
      }
    }, {
      key: 'displayError',
      value: function displayError(err) {
        var message = err instanceof Error ? err.message : JSON.stringify(err, null, 2);
        this.hide();
        this.el.innerHTML = '<code>' + message + '</code>';
        this.display();
      }

      // - populate template
      // - insert into DOM
      // - add listeners (if necessary)

    }, {
      key: 'populate',
      value: function populate(prop, clone, model) {
        var _this2 = this;

        var textInputProps = ['abbreviation', 'author', 'autonym', 'key', 'location', 'name', 'organization', 'program', 'publication', 'role', 'title'];

        if (textInputProps.includes(prop)) {
          var input = clone.querySelector('input[name="' + prop + '"]');
          if (model[prop]) input.value = model[prop];
          return this.el.appendChild(clone);
        }

        var simpleProps = {
          competency: 'select[name=competency]',
          description: 'textarea[name=description]',
          email: 'input[name=email]',
          endYear: 'input[name=endYear]',
          phone: 'input[name=phone]',
          proficiencyType: 'input[name=proficiencyType]',
          publicationType: 'input[name=publicationType]',
          startYear: 'input[name=startYear]',
          year: 'input[name=year]'
        };

        if (prop in simpleProps) {

          this.el.appendChild(clone);

          var _input = this.el.querySelector(simpleProps[prop]);

          if (model[prop]) _input.value = model[prop];

          _input.addEventListener('change', function (ev) {
            model.update(_defineProperty({}, prop, ev.target.value));
          });

          return this.el;
        }

        /* eslint-disable no-param-reassign */
        switch (prop) {

          case 'achievements':
            {
              var _ret = function () {

                var button = clone.querySelector('button');
                var li = clone.querySelector('li');
                var ul = clone.querySelector('ul');

                var populateAchievement = function populateAchievement(listItem, data) {

                  var img = listItem.querySelector('img');
                  var input = listItem.querySelector('input');
                  var random = Math.random();

                  input.value = data;
                  input.dataset.id = random;
                  img.dataset.id = random;
                };

                if (model.achievements.length) {

                  populateAchievement(li, model.achievements[0]);

                  model.achievements.slice(1).forEach(function (ach) {
                    var listItem = li.cloneNode(true);
                    populateAchievement(listItem, ach);
                    ul.appendChild(listItem);
                  });
                } else {

                  li.remove();
                }

                _this2.el.appendChild(clone);

                button.addEventListener('click', function () {
                  var listItem = li.cloneNode(true);
                  populateAchievement(listItem, '');
                  ul.appendChild(listItem);
                  model.achievements.push('');
                  model.emit('update', model);
                });

                ul.addEventListener('change', function () {
                  var achievements = Array.from(ul.querySelectorAll('input')).map(function (input) {
                    return input.value;
                  });
                  model.update({ achievements: achievements });
                });

                ul.addEventListener('click', function (ev) {
                  if (ev.target.tagName === 'IMG') {

                    var _input2 = ul.querySelector('input[data-id="' + ev.target.dataset.random + '"]');
                    var i = model.achievements.indexOf(_input2.value);

                    _input2.parentNode.remove();

                    if (i >= 0) {
                      model.achievements.splice(i, 1);
                      model.emit('update', model);
                    }
                  }
                });

                return 'break';
              }();

              if (_ret === 'break') break;
            }

          case 'categories':
            {
              var _ret2 = function () {

                var fieldset = clone.querySelector('fieldset');
                var label = clone.querySelector('label');
                var addCategory = function addCategory(label, category) {
                  var p = label.querySelector('b');
                  var input = label.querySelector('input');
                  p.textContent = category.title;
                  input.value = category.key;
                  input.name = category.key;
                };

                if (cv.categories.length) {
                  (function () {

                    addCategory(label, cv.categories[0]);

                    cv.categories.slice(1).forEach(function (cat) {
                      var checkboxItem = label.cloneNode(true);
                      addCategory(checkboxItem, cat);
                      fieldset.appendChild(checkboxItem);
                    });

                    var categoryKeys = cv.categories.map(function (cat) {
                      return cat.key;
                    });

                    model.categories.forEach(function (cat) {
                      if (categoryKeys.includes(cat)) {
                        clone.querySelector('input[name="' + cat.key + '"]').checked = true;
                      }
                    });
                  })();
                } else {

                  label.remove();
                }

                _this2.el.appendChild(clone);

                fieldset.addEventListener('change', function (ev) {

                  var checked = ev.target.checked;
                  var key = ev.target.name;

                  if (checked) {
                    var cats = new Set(model.categories);
                    cats.add(key);
                    model.categories = Array.from(cats);
                    model.emit('update', model);
                  } else {
                    var i = model.categories.indexOf(key);
                    if (i >= 0) {
                      model.categories.splice(i, 1);
                      model.emit('update', model);
                    }
                  }
                });

                return 'break';
              }();

              if (_ret2 === 'break') break;
            }

          case 'date':
            {

              this.el.appendChild(clone);

              var waitTime = 1000;

              var debouncedListener = debounce(function (ev) {
                model.update({ date: new Date(ev.target.value) });
              }, waitTime);

              this.el.querySelector('input[name="date"]').addEventListener('change', debouncedListener);

              break;
            }

          case 'links':
            {
              var _ret4 = function () {

                var button = clone.querySelector('button');
                var linkTypes = Object.keys(model.links);
                var li = clone.querySelector('li');
                var ul = clone.querySelector('ul');

                var populateLink = function populateLink(listItem, linkType, link) {

                  var img = listItem.querySelector('img');
                  var input = listItem.querySelector('input');
                  var select = listItem.querySelector('select');
                  var random = Math.random();

                  input.value = link;
                  input.dataset.id = random;
                  img.dataset.id = random;
                  select.dataset.id = random;

                  if (linkType) select.value = linkType;
                };

                if (linkTypes.length) {

                  populateLink(li, linkTypes[0], model.links[linkTypes[0]]);

                  linkTypes.slice(1).forEach(function (linkType) {
                    var listItem = li.cloneNode(true);
                    populateLink(listItem, linkType, model.links[linkType]);
                    ul.appendChild(listItem);
                  });
                } else {

                  li.remove();
                }

                _this2.el.appendChild(clone);

                button.addEventListener('click', function () {
                  var listItem = li.cloneNode(true);
                  populateLink(listItem, null, '');
                  ul.appendChild(listItem);
                });

                ul.addEventListener('change', function (ev) {
                  if (ev.target.name === 'linkType') {

                    var _input3 = ul.querySelector('input[data-id="' + ev.target.dataset.id + '"]');

                    for (var linkType in model.links) {
                      if (model.links.hasOwnProperty(linkType)) {
                        if (model.links[linkType] === _input3.value) {
                          Reflect.deleteProperty(model.links, linkType);
                        }
                      }
                    }

                    model.links[ev.target.value] = _input3.value;
                    model.emit('update', model);
                  }
                });

                ul.addEventListener('click', function (ev) {
                  if (ev.target.tagName === 'IMG') {

                    var confirmed = confirm('Are you sure you want to delete this item?');

                    if (confirmed) {
                      var select = ul.querySelector('select[data-id="' + ev.target.dataset.random + '"]');
                      Reflect.deleteProperty(model.links, select.value);
                      select.parentNode.remove();
                      model.emit('update', model);
                    }
                  }
                });

                return 'break';
              }();

              if (_ret4 === 'break') break;
            }

          default:
            {
              return null;
            }

        }

        /* eslint-enable no-param-reassign */

        return this.el;
      }
    }, {
      key: 'render',
      value: function render() {
        var _this3 = this;

        this.el.removeListeners(); // remove existing listeners
        this.el.innerHTML = ''; // clear the view

        var props = Model.whitelist[this.type];

        props.forEach(function (prop) {
          if (templateNames.includes(prop)) {

            var template = getTemplate(prop);

            if (!template) {
              var err = new Error('Template not found for property "' + prop + '".');
              _this3.displayError(err);
              throw err;
            }

            var clone = template.content.cloneNode(true);
            var el = _this3.populate(prop, clone, _this3.model);

            if (!el) {
              var _err = new Error('Form element for the property "' + prop + '" not found.');
              _this3.displayError(_err);
              throw _err;
            }
          }
        });

        this.el.addEventListener('change', function (ev) {
          if (ev.target.tagName === 'INPUT' && ev.target.type === 'text') {
            _this3.model.update(_defineProperty({}, ev.target.name, ev.target.value));
          }
        });

        this.nodes.buttons.addEventListener('click', function (ev) {

          if (ev.target.id === 'saveButton') {

            _this3.model.save().then(function (res) {
              _this3.model = res;
            }).catch(function (err) {
              return _this3.displayError(err);
            });
          } else if (ev.target.id === 'deleteButton') {

            var confirmed = confirm('Are you sure you want to delete this item?');

            if (confirmed) {
              _this3.model.destroy().then(function () {
                return _this3.destroy();
              }).catch(function (err) {
                return _this3.displayError(err);
              });
            }
          }
        });

        this.nodes.buttons.display();
        this.display();
      }
    }]);

    return FormView;
  }(View);

  return FormView;
}();