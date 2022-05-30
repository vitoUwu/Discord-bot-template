const { Message, CommandInteraction } = require('discord.js'); // eslint-disable-line no-unused-vars
const { error, success } = require('../utils/embeds');

module.exports = {
  name: 'deploy',
  description: 'Implementa comandos em slash',
  options: [
    {
      name: 'comando',
      description: 'O comando para implementar',
      type: 'STRING',
      required: true,
      autocomplete: true
    },
    {
      name: 'global',
      description: 'Implementar o comando para todos os servidores',
      type: 'BOOLEAN',
      required: false,
    },
  ],
  usage: '<comando>',
  ownerOnly: true,
  args: true,
  category: 'utilidade',
  /**
   * 
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(message, args) {
    const command = message.client.commands.get(args[0]);
    if (!command) return message.reply({ embeds: [ error(`O comando \`${args[0]}\` não existe!`) ] });
    if (!command.slashExecute) return message.reply({ embeds: [ error(`O comando \`${args[0]}\` não possui suporte ao slash commands!`) ] });

    const global = args[1] === 'global';

    message.client.application.commands.create({
      name: command.name,
      description: command.description,
      description_localizations: command.description_localizations,
      options: command.options,
      type: command.type || 'CHAT_INPUT',
    }, global ? null : message.guild.id).then(() => {
      message.reply({ embeds: [ success(`O comando \`${command.name}\` foi implementado com sucesso!`) ] });
    }).catch((err) => {
      message.client.logger.error(err);
      message.reply({ embeds: [ error(`Ocorreu um erro ao implementar o comando \`${command.name}\`!`) ] });
    });
  },
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  slashExecute(interaction) {
    const command = interaction.client.commands.get(interaction.options.getString('command'));
    if (!command) return interaction.reply({ embeds: [ error(`O comando \`${interaction.options.getString('command')}\` não existe!`) ] });
    if (!command.slashExecute) return interaction.reply({ embeds: [ error(`O comando \`${interaction.options.getString('command')}\` não possui suporte ao slash commands!`) ] });

    interaction.client.application.commands.create({
      name: command.name,
      description: command.description,
      description_localizations: command.description_localizations,
      options: command.options,
      type: command.type || 'CHAT_INPUT',
    }, interaction.options.getBoolean('global') ? null : interaction.guildId).then(() => {
      interaction.reply({ embeds: [ success(`O comando \`${command.name}\` foi implementado com sucesso!`) ] });
    }).catch((err) => {
      interaction.client.logger.error(err);
      interaction.reply({ embeds: [ error(`Ocorreu um erro ao implementar o comando \`${command.name}\`!`) ] });
    });
  },
};