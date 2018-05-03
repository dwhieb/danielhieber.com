/**
 * Converts a Date Object to a human-readable date String
 * @param  {Date|String} date A Date Object or date String
 * @return {String}      Returns the human-readable date String
 */
module.exports = date => {

  const d = date instanceof Date ? date : new Date(date);

  return d.toLocaleDateString('en-US', {
    day:   'numeric',
    month: 'long',
    year:  'numeric',
  });

};
