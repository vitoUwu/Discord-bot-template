const fs = require('fs');

module.exports = class Logger {
  /**
	 *
	 * @param {string} path
	 * @param {string|undefined} prefix
	 */
  constructor(path, prefix) {
    if (!path) throw Error('Invalid Path Argument');
    this.path = path;
    this.fileName = `${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replace(/\D/g, '')}_${new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replace(/\D/g, '')}.txt`;
    this.prefix = prefix;
  }

  /**
	 *
	 * @returns {string}
	 */
  get date() {
    return `\x1b[33m[${new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })} ${new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })}]\x1b[0m`;
  }

  /**
	 *
	 * @param {string} data
	 */
  append(data) {
    try {
      if (!fs.existsSync(this.path)) fs.mkdirSync(this.path);
      fs.appendFileSync(`${this.path}/${this.prefix ? `${this.prefix}_` : ''}${this.fileName}`, `${this.normalize(data)}\n`, { encoding: 'utf-8' });
    } catch (err) {
      console.log(err);
    }
  }

  /**
	 *
	 * @param {string} string
	 * @returns {string}
	 */
  normalize(string) {
    // eslint-disable-next-line no-control-regex
    return string.replace(/\x1b\[\d{2}m|\x1b\[0m/g, '');
  }

  /**
	 *
	 * @param {string} string
	 */
  log(string) {
    console.log(`\x1b[42m[LOG]\x1b[0m ${this.date} ${string}`);
    this.append(`[LOG] ${this.date} ${string}`);
  }

  /**
	 *
	 * @param {string|Error}
	 */
  error(data) {
    console.error(`\x1b[00m[ERROR]\x1b[0m ${this.date} ${data.stack ?? data}`);
    this.append(`[ERROR] ${this.date} ${data.stack ?? data}`);
  }
};
