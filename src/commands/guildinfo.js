const { Message, MessageActionRow, MessageButton, CommandInteraction } = require('discord.js'); // eslint-disable-line no-unused-vars
const { guildinfo: guildinfoEmbeds } = require('../utils/embeds');

module.exports = {
  name: 'guildinfo',
  aliases: ['guild', 'server', 'serverinfo'],
  category: 'informação',
  description: 'Mostra informações sobre o servidor',
  cooldown: 5,
  /**
   * 
   * @param {Message} message 
   */
  async execute(message) {
    const guild = message.guild;

    const infoEmbed = await guildinfoEmbeds.info(guild);
    const emojiEmbed = guildinfoEmbeds.emojis(guild);
    const bannerEmbed = guildinfoEmbeds.banner(guild);
    const iconEmbed = guildinfoEmbeds.icon(guild);

    const row = new MessageActionRow()
      .setComponents([
        new MessageButton()
          .setCustomId('info-button')
          .setLabel('Informações')
          .setStyle('PRIMARY')
      ]);

    if (guild.emojis.cache.size) row.addComponents([
      new MessageButton()
        .setCustomId('emojis-button')
        .setLabel('Emojis')
        .setStyle('PRIMARY'),
    ]);

    if (guild.bannerURL()) row.addComponents([
      new MessageButton()
        .setCustomId('banner-button')
        .setLabel('Banner')
        .setStyle('PRIMARY'),
    ]);

    if (guild.iconURL()) row.addComponents([
      new MessageButton()
        .setCustomId('icon-button')
        .setLabel('Ícone')
        .setStyle('PRIMARY'),
    ]);

    const components = row.components.length > 1 ? [row] : [];

    const m = await message.channel.send({ embeds: [infoEmbed], components });
    const collector = m.createMessageComponentCollector({
      filter: (i) => i.user.id === message.author.id,
      time: 60000 * 5,
    });

    collector.on('collect', async(i) => {
      await i.deferUpdate();
      if (i.customId === 'info-button') {
        i.message.edit({ embeds: [infoEmbed] });
      } else if (i.customId === 'emojis-button') {
        i.message.edit({ embeds: [emojiEmbed] });
      } else if (i.customId === 'banner-button') {
        i.message.edit({ embeds: [bannerEmbed]});
      } else if (i.customId === 'icon-button') {
        i.message.edit({ embeds: [iconEmbed]});
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') {
        m.edit({ components: [] });
      }
    });
  },
  /**
   * 
   * @param {CommandInteraction} interaction 
   */
  async slashExecute(interaction) {
    const guild = interaction.guild;

    const infoEmbed = await guildinfoEmbeds.info(guild);
    const emojiEmbed = guildinfoEmbeds.emojis(guild);
    const bannerEmbed = guildinfoEmbeds.banner(guild);
    const iconEmbed = guildinfoEmbeds.icon(guild);

    const row = new MessageActionRow()
      .setComponents([
        new MessageButton()
          .setCustomId('info-button')
          .setLabel('Informações')
          .setStyle('PRIMARY')
      ]);

    if (guild.emojis.cache.size) row.addComponents([
      new MessageButton()
        .setCustomId('emojis-button')
        .setLabel('Emojis')
        .setStyle('PRIMARY'),
    ]);

    if (guild.bannerURL()) row.addComponents([
      new MessageButton()
        .setCustomId('banner-button')
        .setLabel('Banner')
        .setStyle('PRIMARY'),
    ]);

    if (guild.iconURL()) row.addComponents([
      new MessageButton()
        .setCustomId('icon-button')
        .setLabel('Ícone')
        .setStyle('PRIMARY'),
    ]);

    const components = row.components.length > 1 ? [row] : [];

    const m = await interaction.reply({ embeds: [infoEmbed], components, fetchReply: true });
    const collector = m.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60000 * 5,
    });

    collector.on('collect', async(i) => {
      await i.deferUpdate();
      if (i.customId === 'info-button') {
        i.message.edit({ embeds: [infoEmbed] });
      } else if (i.customId === 'emojis-button') {
        i.message.edit({ embeds: [emojiEmbed] });
      } else if (i.customId === 'banner-button') {
        i.message.edit({ embeds: [bannerEmbed]});
      } else if (i.customId === 'icon-button') {
        i.message.edit({ embeds: [iconEmbed]});
      }
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') {
        m.edit({ components: [] });
      }
    });
  }
};
