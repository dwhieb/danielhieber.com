/* global socket */

(function categories() {
  socket.emit('getCategories');
}());

socket.emit('addCategory', {
  id: 'revitalization',
  name: 'Revitalization & Documentation',
  description: 'Some stuff about revitalization.'
}, (err, res) => {
  e = err;
  console.log(err || res);
});
