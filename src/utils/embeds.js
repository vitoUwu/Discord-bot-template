const { MessageEmbed, Guild } = require('discord.js'); // eslint-disable-line no-unused-vars
const { capitalizeAll } = require('./capitalize');

const guildinfo = {
  /**
   * 
   * @param {Guild} guild 
   * @returns {Promise<MessageEmbed>}
   */
  info: async (guild) => {
    let bans = guild.me.permissions.has('BAN_MEMBERS') ? (await guild.bans.fetch({ cache: false }).catch(() => null))?.size : 'Não tenho permissão';
    if (typeof bans === 'number') bans = bans === 1000 ? '1000+' : bans;

    const channels = {
      text: guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size,
      voice: guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size,
      categories: guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size,
      privateThreads: guild.channels.cache.filter(c => c.type === 'GUILD_PRIVATE_THREAD').size,
      publicThreads: guild.channels.cache.filter(c => c.type === 'GUILD_PUBLIC_THREAD').size,
      news: guild.channels.cache.filter(c => c.type === 'GUILD_NEWS').size,
    };

    const roles = {
      total: guild.roles.cache.size,
      bots: guild.roles.cache.filter(r => r.managed).size,
      humans: guild.roles.cache.filter(r => !r.managed).size,
    };

    const emojis = {
      total: guild.emojis.cache.size,
      animated: guild.emojis.cache.filter(e => e.animated).size,
      normal: guild.emojis.cache.filter(e => !e.animated).size,
    };

    const stickers = {
      total: guild.stickers.cache.size,
      apng: guild.stickers.cache.filter(e => e.format === 'APNG').size,
      lottie: guild.stickers.cache.filter(e => e.format === 'LOTTIE').size,
      png: guild.stickers.cache.filter(e => e.format === 'PNG').size,
    };

    return new MessageEmbed()
      .setColor(guild.me.displayColor)
      .setTitle(`Informações sobre ${guild.name}`)
      .setThumbnail(guild.iconURL())
      .setImage(guild.bannerURL())
      .addFields([
        { name: 'ID', value: `\`${guild.id}\``, inline: true },
        { name: 'Dono', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Criado em', value: `\`${guild.createdAt.toLocaleString()}\`` },
        { name: 'Canais', value: `
\`Canais de Voz: ${channels.voice}\`
\`Canais de Texto: ${channels.text}\`
\`Categorias: ${channels.categories}\`
\`Tópicos Privados: ${channels.privateThreads}\`
\`Tópicos Públicos: ${channels.publicThreads}\`
\`Canais de Anúncio: ${channels.news}\`
\`Canal Afk:\` ${guild.afkChannel ? `<#${guild.afkChannel.id}>` : '`Não Definido`'}
`, inline: true },
        { name: 'Membros', value: `\`Total: ${guild.memberCount}\`\n\`Máximo: ${guild.maximumMembers}\`\n\`Banidos: ${bans}\``, inline: true },
        { name: 'Cargos', value: `\`Total: ${roles.total}\`\n\`Bots: ${roles.bots}\`\n\`Comuns: ${roles.humans}\``, inline: true },
        ... emojis.total ? [{ name: 'Emojis', value: `\`Total: ${emojis.total}\`\n\`Comuns: ${emojis.normal}\`\n\`Animados: ${emojis.animated}\``, inline: true }] : [],
        ... stickers.total ? [{ name: 'Figurinhas', value: `\`Total: ${stickers.total}\`\n\`Apng: ${stickers.apng}\`\n\`Lottie: ${stickers.lottie}\`\n\`Png: ${stickers.png}\``, inline: true }] : [],
        ... guild.features.length ? [
          { name: 'Recursos', value: guild.features.map(feature => `\`${capitalizeAll(feature.replace(/_/g, ' '))}\``).join('\n'), inline: true },
          ... guild.features.includes('COMMUNITY') ? [{ name: 'Canal de Regras', value: `<#${guild.rulesChannelId}>`, inline: true }] : [],
        ] : [],
        { name: `Boosts (${guild.premiumSubscriptionCount})`, value: `\`Tier: ${guild.premiumTier === 'NONE' ? '0' : guild.premiumTier.slice(-1)}\``, inline: true },
      ]);
  },
  /**
   * 
   * @param {Guild} guild 
   * @returns {MessageEmbed}
   */
  emojis: (guild) => {
    const animated = guild.emojis.cache.filter(e => e.animated).map(e => `<a:${e.name}:${e.id}>`).join(' ');
    const normal = guild.emojis.cache.filter(e => !e.animated).map(e => `<:${e.name}:${e.id}>`).join(' ');
    return new MessageEmbed()
      .setColor(guild.me.displayColor)
      .setTitle(`Emojis de ${guild.name}`)
      .setDescription(`**Normais**\n${normal}\n\n**Animados**\n${animated}`);
  },
  /**
   * 
   * @param {Guild} guild 
   * @returns {MessageEmbed}
   */
  icon: (guild) => {
    const guildIcon = guild.iconURL({ format: 'png', dynamic: true, size: 2048 });
    return new MessageEmbed()
      .setColor(guild.me.displayColor)
      .setTitle(`Ícone de ${guild.name}`)
      .setDescription(`[Clique aqui](${guildIcon}) para baixar o ícone`)
      .setImage(guildIcon);
  },
  /**
   * 
   * @param {Guild} guild 
   * @returns {MessageEmbed}
   */
  banner: (guild) => {
    const guildBanner = guild.bannerURL({ format: 'png', size: 2048 });
    return new MessageEmbed()
      .setColor(guild.me.displayColor)
      .setTitle(`Banner de ${guild.name}`)
      .setDescription(`[Clique aqui](${guildBanner}) para baixar o banner`)
      .setImage(guildBanner);
  }
};

/**
 * 
 * @param {String} message
 * @returns {MessageEmbed}
 */
const error = (message) => new MessageEmbed()
  .setColor('#ff0000')
  .setDescription(`🚫 **|** ${message}`);

/**
 * 
 * @param {String} message 
 * @returns {MessageEmbed}
 */
const success = (message) => new MessageEmbed()
  .setColor('#00ff00')
  .setDescription(`✅ **|** ${message}`);

module.exports = {
  guildinfo,
  error,
  success
};