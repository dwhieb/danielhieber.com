/**
 * A generic comparator function for use with the .sort() method
 * @param  {Any}     a The first value to compare
 * @param  {Any}     b The second value to compare
 * @return {Integer}   Returns 0, +1, or -1
 */
module.exports = (a, b) => {
  if (a < b) return -1;
  if (a > b) return +1;
  return 0;
};
