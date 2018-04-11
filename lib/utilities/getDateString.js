module.exports = date => {

  const d = date instanceof Date ? date : new Date(date);

  return d.toLocaleDateString('en-US', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });

};
