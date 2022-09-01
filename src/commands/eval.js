const { EmbedBuilder } = require('discord.js');
const codeInBlock = /```(?:js)?\s(.+[^\\])```$/is;

module.exports = {
  name: 'eval',
  description: 'Evaluate code',
  usage: '<código>',
  ownerOnly: true,
  args: true,
  category: 'utilidade',
  aliases: ['ev'],
  /**
   * 
   * @param {Message} message
   * @returns
   */
  async execute(message) {
    let code = message.content.trim().split(/ +/g).slice(1).join(' ');
    if(codeInBlock.test(code)) code = code.match(codeInBlock)[1];
    code = code.includes('await') ? `async () => {${code}}` : `() => {${code}}`;
    const silent = code.match(/--silent/gmi) ? !!(code = code.replace(/--silent/gmi, '')) : false;
    let output;
    let classe = 'void';
    try {
      output = await eval(code)();
    } catch(err) {
      output = {
        method: err.method || null,
        path: err.path || null,
        code: err.code || null,
        httpStatus: err.httpStatus || null,
        name: err.name || null,
        message: err.message || null
      };
    }
    if(output) classe = output.constructor.name;
    const type = typeof output;
    if(type !== 'string') output = require('util').inspect(output);
    if(silent) return;
    output = `${output}`.length > 0 ? `${output}`.slice(0, 1800) : 'void';
    const embed = new EmbedBuilder()
      .setDescription(`**Output**\n\`\`\`js\n${output}\n\`\`\``)
      .addFields([
        { name: 'Class', value: `\`\`\`yml\n${classe}\`\`\``, inline: true },
        { name: 'Type', value: `\`\`\`ts\n${type}\`\`\``, inline: true }
      ]);
    message.reply({ embeds: [embed] });
    return;
  },
};