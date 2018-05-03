/**
 * Capitalizes the first letter of a String
 * @param  {String} str The String to capitalize
 * @return {String}     Returns the capitalized String
 */
module.exports = str => str.charAt(0).toUpperCase() + str.slice(1);
