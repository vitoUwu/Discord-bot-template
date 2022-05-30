const fs = require('fs');

/**
 * 
 * @param {Boolean} colorized 
 * @returns {String}
 */
const date = (colorized = true) => {
  const today = `${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} ${new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`;
  if (colorized) return `${colors.yellow(`[${today}]`)}`;
  else return `[${today}]`;
};

/**
 * 
 * @param {String} message 
 */
const write = (message) => {
  if (!fs.existsSync('./src/logs')) fs.mkdirSync('./src/logs');
  fs.appendFileSync(`./src/logs/log_${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replace(/\//g, '_')}.txt`, `${message}\n`);
};

const colors = {
  green: (str) => `\x1b[32m${str}\x1b[0m`,
  red: (str) => `\x1b[31m${str}\x1b[0m`,
  yellow: (str) => `\x1b[33m${str}\x1b[0m`,
  blue: (str) => `\x1b[34m${str}\x1b[0m`,
  magenta: (str) => `\x1b[35m${str}\x1b[0m`,
  cyan: (str) => `\x1b[36m${str}\x1b[0m`,
  white: (str) => `\x1b[37m${str}\x1b[0m`,
  bg: {
    green: (str) => `\x1b[42m${str}\x1b[0m`,
    red: (str) => `\x1b[41m${str}\x1b[0m`,
    yellow: (str) => `\x1b[43m${str}\x1b[0m`,
    blue: (str) => `\x1b[44m${str}\x1b[0m`,
    magenta: (str) => `\x1b[45m${str}\x1b[0m`,
    cyan: (str) => `\x1b[46m${str}\x1b[0m`,
    white: (str) => `\x1b[47m${str}\x1b[0m`,
  },
};

module.exports = {
  /**
   * 
   * @param {String} message 
   */
  log: (message) => {
    console.log(`${colors.green('[LOG]')} ${date()} ${message}`);
    write(`[LOG] ${date(false)} ${message}`);
  },
  /**
   * 
   * @param {String} message 
   */
  error: (message) => {
    console.error(`${colors.red('[ERROR]')} ${date()} ${message}`);
    write(`[ERROR] ${date(false)} ${message}`);
  }
};