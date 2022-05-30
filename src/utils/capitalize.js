/**
 * 
 * @param {String} string 
 * @returns 
 */
const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

/**
 * 
 * @param {String} string 
 * @returns 
 */
const capitalizeAll = (string) => {
  return string.split(' ').map(word => capitalize(word)).join(' ');
};

module.exports = {
  capitalize,
  capitalizeAll
};