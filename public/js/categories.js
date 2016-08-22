/* global socket */

(function categories() {
  socket.emit('getCategories');
}());

socket.emit('deleteCategory', 'revitalization', (err, res) => {
  console.log(err || res);
});
