const { Message } = require('discord.js'); // eslint-disable-line no-unused-vars
const { error } = require('../utils/embeds');

module.exports = {
  name: 'messageCreate',
  /**
   * 
   * @param {Message} message 
   * @returns 
   */
  execute(message) {
    const prefix = process.env.PREFIX;
    if (message.author.bot || message.channel.type !== 'GUILD_TEXT' || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (command.ownerOnly && message.author.id !== process.env.OWNER_ID) return;
    if (command.args && !args.length) {
      let reply = `Você não providenciou os argumentos necessários, ${message.author}!`;
      if (command.usage) {
        reply += `\nO uso correto seria: \`${prefix}${command.name} ${command.usage}\``;
      }
      return message.channel.send({ embeds: [ error(reply) ] });
    }

    const userCooldown = message.client.commandCooldowns.get(`${message.author.id}_${command.name}`);
    if (userCooldown) return message.reply({ embeds: [ error(`Espere mais \`${((userCooldown - Date.now()) / 1000).toFixed(1)} segundos\` para executar o comando`) ] });
    if (command.cooldown && !userCooldown) {
      message.client.commandCooldowns.set(`${message.author.id}_${command.name}`, Date.now() + command.cooldown * 1000);
      setTimeout(() => message.client.commandCooldowns.delete(`${message.author.id}_${command.name}`), command.cooldown * 1000);
    }

    try {
      command.execute(message, args);
    } catch (error) {
      message.client.logger.error(error);
      message.reply({ embeds: [ error(`Ocorreu um erro ao executar o comando \`${command.name}\`!`) ] });
    }
  }
};