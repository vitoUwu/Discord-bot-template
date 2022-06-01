const { Message, MessageEmbed, CommandInteraction } = require('discord.js'); // eslint-disable-line no-unused-vars
const { error } = require('../utils/embeds');

module.exports = {
  name: 'help',
  description: 'Mostra ajuda',
  options: [
    {
      name: 'comando',
      description: 'O comando para mostrar ajuda',
      type: 'STRING',
      required: false,
      autocomplete: true
    },
  ],
  usage: '<comando>',
  category: 'utilidade',
  aliases: ['h'],
  cooldown: 5,
  /**
   * 
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  async execute(message, args) {
    if (!args.length) {
      const embed = new MessageEmbed()
        .setTitle('Help')
        .setDescription(`Use \`${process.env.PREFIX}help <comando>\` para mostrar informações sobre o comando.`)
        .setColor(message.guild.me.displayColor);
      
      message.client.commands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i).forEach(category => {
        const commands = message.client.commands.filter(c => c.category === category && !c.ownerOnly);
        embed.addField(category || 'sem categoria', commands.map(c => `\`${c.name}\``).join(', '));
      });

      return message.reply({ embeds: [embed] });
    } else {
      const command = message.client.commands.get(args[0]) || message.client.commands.find(c => c.aliases && c.aliases.includes(args[0]));
      if (!command) return message.reply('Comando não encontrado!');

      const embed = new MessageEmbed()
        .setTitle(command.name)
        .setDescription(command.description || 'Sem descrição')
        .setColor(message.guild.me.displayColor)
        .setFields([
          ... command.usage ? [{ name: 'Uso', value: `\`${command.usage}\``, inline: true }] : [],
          ... command.category ? [{ name: 'Categoria', value: `\`${command.category}\``, inline: true }] : [],
          ... command.aliases ? [{ name: 'Aliases', value: `\`${command.aliases.join(' ')}\``, inline: true }] : [],
        ])
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    }
  },
  /**
   * 
   * @param {CommandInteraction} interaction 
   * @returns 
   */
  slashExecute(interaction) {
    const selectedCommand = interaction.options.getString('comando');
    if (!selectedCommand) {
      const embed = new MessageEmbed()
        .setTitle('Help')
        .setDescription(`Use \`${process.env.PREFIX}help <comando>\` para mostrar informações sobre o comando.`)
        .setColor(interaction.guild.me.displayColor);

      interaction.client.commands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i).forEach(category => {
        const commands = interaction.client.commands.filter(c => c.category === category && !c.ownerOnly);
        embed.addField(category || 'sem categoria', commands.map(c => `\`${c.name}\``).join(', '));
      });

      return interaction.reply({ embeds: [embed] });
    } else {
      const command = interaction.client.commands.get(selectedCommand) || interaction.client.commands.find(c => c.aliases && c.aliases.includes(selectedCommand));
      if (!command) return interaction.reply({ embeds: [ error('Comando não encontrado!') ] });

      const embed = new MessageEmbed()
        .setTitle(command.name)
        .setDescription(command.description || 'Sem descrição')
        .setColor(interaction.guild.me.displayColor)
        .setFields([
          ... command.usage ? [{ name: 'Uso', value: `\`${command.usage}\``, inline: true }] : [],
          ... command.category ? [{ name: 'Categoria', value: `\`${command.category}\``, inline: true }] : [],
          ... command.aliases ? [{ name: 'Aliases', value: `\`${command.aliases.join(' ')}\``, inline: true }] : [],
        ])
        .setTimestamp();

      interaction.reply({ embeds: [embed] });
    }
  }
};
