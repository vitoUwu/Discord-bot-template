const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const { error } = require('../utils/embeds');

module.exports = {
  name: 'interactionCreate',
  /**
   * 
   * @param {Interaction} interaction 
   */
  execute(interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command || !command.slashExecute) return interaction.reply({ embeds: [ error(`O comando \`${interaction.commandName}\` não existe!`) ] });
      if (command.ownerOnly && interaction.user.id !== process.env.OWNER_ID) return;

      const userCooldown = interaction.client.commandCooldowns.get(`${interaction.user.id}_${command.name}`);
      if (userCooldown) return interaction.reply({ embeds: [ error(`Espere mais \`${((userCooldown - Date.now()) / 1000).toFixed(1)} segundos\` para executar o comando`) ] });
      if (command.cooldown && !userCooldown) {
        interaction.client.commandCooldowns.set(`${interaction.user.id}_${command.name}`, Date.now() + command.cooldown * 1000);
        setTimeout(() => interaction.client.commandCooldowns.delete(`${interaction.user.id}_${command.name}`), command.cooldown * 1000);
      }
      
      try {
        command.slashExecute(interaction);
      } catch (error) {
        interaction.client.logger.error(error);
        interaction.reply({ embeds: [ error(`Ocorreu um erro ao executar o comando \`${command.name}\`!`) ] });
      }
    }

    if (interaction.isAutocomplete()) {
      const commandName = interaction.commandName;
      const option = interaction.options.getFocused(true).name;

      if (['deploy', 'help'].includes(commandName) && option === 'comando') {
        const commands = interaction.client.commands.filter(cmd => cmd.slashExecute && !cmd.ownerOnly);
        const choicesData = commands.map(cmd => { return { name: cmd.name, value: cmd.name }; });
        interaction.respond(choicesData);
      }
    }
  }
};
