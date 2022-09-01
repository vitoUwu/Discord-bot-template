const { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionFlagsBits, ButtonStyle } = require('discord.js'); // eslint-disable-line no-unused-vars

module.exports = {
  name: 'invite',
  description: 'Convide o bot para seu servidor',
  usage: '',
  category: 'utilidade',
  aliases: ['convite'],
  cooldown: 5,
  /**
   * 
   * @param {Message} message
   * @returns
   */
  async execute(message) {
    const link = message.client.generateInvite({
      permissions: [PermissionFlagsBits.Administrator],
      scopes: ['bot', 'applications.commands'],
    });

    const embed = new EmbedBuilder()
      .setDescription('Clique no botão abaixo para convidar o bot para seu servidor.')
      .setColor(message.guild.members.me.displayColor);
    
    const row = new ActionRowBuilder()
      .setComponents([
        new ButtonBuilder()
          .setLabel('Convidar')
          .setURL(link)
          .setStyle(ButtonStyle.Link),
      ]);

    message.reply({ embeds: [embed], components: [row] });
  }
};