const { Message, ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ButtonStyle } = require('discord.js'); // eslint-disable-line no-unused-vars
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

    const row = new ActionRowBuilder()
      .setComponents([
        new ButtonBuilder()
          .setCustomId('info-button')
          .setLabel('Informações')
          .setStyle(ButtonStyle.Primary)
      ]);

    if (guild.emojis.cache.size) row.addComponents([
      new ButtonBuilder()
        .setCustomId('emojis-button')
        .setLabel('Emojis')
        .setStyle(ButtonStyle.Primary),
    ]);

    if (guild.bannerURL()) row.addComponents([
      new ButtonBuilder()
        .setCustomId('banner-button')
        .setLabel('Banner')
        .setStyle(ButtonStyle.Primary),
    ]);

    if (guild.iconURL()) row.addComponents([
      new ButtonBuilder()
        .setCustomId('icon-button')
        .setLabel('Ícone')
        .setStyle(ButtonStyle.Primary),
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
   * @param {ChatInputCommandInteraction} interaction 
   */
  async slashExecute(interaction) {
    const guild = interaction.guild;

    const infoEmbed = await guildinfoEmbeds.info(guild);
    const emojiEmbed = guildinfoEmbeds.emojis(guild);
    const bannerEmbed = guildinfoEmbeds.banner(guild);
    const iconEmbed = guildinfoEmbeds.icon(guild);

    const row = new ActionRowBuilder()
      .setComponents([
        new ButtonBuilder()
          .setCustomId('info-button')
          .setLabel('Informações')
          .setStyle(ButtonStyle.Primary)
      ]);

    if (guild.emojis.cache.size) row.addComponents([
      new ButtonBuilder()
        .setCustomId('emojis-button')
        .setLabel('Emojis')
        .setStyle(ButtonStyle.Primary),
    ]);

    if (guild.bannerURL()) row.addComponents([
      new ButtonBuilder()
        .setCustomId('banner-button')
        .setLabel('Banner')
        .setStyle(ButtonStyle.Primary),
    ]);

    if (guild.iconURL()) row.addComponents([
      new ButtonBuilder()
        .setCustomId('icon-button')
        .setLabel('Ícone')
        .setStyle(ButtonStyle.Primary),
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
