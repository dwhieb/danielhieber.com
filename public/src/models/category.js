/* global Emitter, Model */

const defaults = {
  id:          '',
  name:        '',
  description: '',
};

const Category = class Category extends Model {
  constructor(data = defaults) {
    super(data);
  }

  delete() {
    return new Promise((resolve, reject) => {
      socket.emit('deleteCategory', this, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      socket.emit('updateCategory', this, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  }

};
