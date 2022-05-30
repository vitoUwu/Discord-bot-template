const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js'); // eslint-disable-line no-unused-vars

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
      permissions: ['ADMINISTRATOR'],
      scopes: ['bot', 'applications.commands'],
    });

    const embed = new MessageEmbed()
      .setDescription('Clique no botão abaixo para convidar o bot para seu servidor.')
      .setColor(message.guild.me.displayColor);
    
    const row = new MessageActionRow()
      .setComponents([
        new MessageButton()
          .setLabel('Convidar')
          .setURL(link)
          .setStyle('LINK'),
      ]);

    message.reply({ embeds: [embed], components: [row] });
  }
};