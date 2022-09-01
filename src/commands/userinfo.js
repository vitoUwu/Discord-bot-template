const { EmbedBuilder, Message, ChatInputCommandInteraction, ApplicationCommandOptionType } = require('discord.js'); // eslint-disable-line no-unused-vars
const { error } = require('../utils/embeds');

module.exports = {
  name: 'userinfo',
  description: 'Veja informações sobre um usuário',
  options: [
    {
      name: 'usuário',
      description: 'O usuário para ver informações sobre',
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  usage: '<usuário>',
  category: 'informação',
  aliases: ['ui'],
  cooldown: 5,
  /**
   * 
   * @param {Message} message 
   * @param {String[]} args 
   * @returns 
   */
  async execute(message, args) {
    const member = args[0] ? message.mentions.members.first() || await message.guild.members.fetch({ user: args[0] }).catch(() => null) : message.member;
    const user = member ? member.user : await message.client.users.fetch(args[0]).catch(() => null);

    if (!user) return message.channel.send({ embeds: [ error('Usuário não encontrado!') ] });

    const embed = new EmbedBuilder()
      .setColor(message.guild.members.me.displayColor)
      .setTitle(`Informações sobre ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields([
        { name: 'ID', value: `\`${user.id}\``, inline: true },
        { name: 'Tag', value: `\`${user.tag}\``, inline: true },
        ... user.presence ? [
          { name: 'Status', value: user.presence?.status, inline: true },
          { name: 'Jogando', value: user.presence?.game || '** **', inline: true }
        ] : [],
        ... member ? [
          ... member.nickname ? [{ name: 'Apelido', value: `\`${member.nickname}\`` }] : [],
          { name: 'Cor', value: `\`${member.displayHexColor}\``, inline: true },
          { name: 'Cargos', value: member.roles.cache.map(role => `<@&${role.id}>`).join(' ') },
          { name: 'Entrou em', value: `\`${member.joinedAt.toLocaleString()}\`` },
        ] : [],
        { name: 'Criado', value: `\`${user.createdAt.toLocaleString()}\`` },
      ]);
    message.channel.send({ embeds: [embed] });
  },
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction 
   */
  slashExecute(interaction) {
    const member = interaction.options.getMember('usuário');
    const user = interaction.options.getUser('usuário');

    if (!user) return interaction.reply({ embeds: [ error('Usuário não encontrado!') ] });

    const embed = new EmbedBuilder()
      .setColor(interaction.guild.members.me.displayColor)
      .setTitle(`Informações sobre ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields([
        { name: 'ID', value: `\`${user.id}\``, inline: true },
        { name: 'Tag', value: `\`${user.tag}\``, inline: true },
        ... member ? [
          ... member.nickname ? [{ name: 'Apelido', value: `\`${member.nickname}\`` }] : [],
          { name: 'Cor', value: `\`${member.displayHexColor}\``, inline: true },
          { name: 'Cargos', value: member.roles.cache.map(role => `<@&${role.id}>`).join(' ') },
          { name: 'Entrou em', value: `\`${member.joinedAt.toLocaleString()}\`` },
        ] : [],
        { name: 'Criado', value: `\`${user.createdAt.toLocaleString()}\`` },
      ]);
    interaction.reply({ embeds: [embed] });
  }
};