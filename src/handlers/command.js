const { Collection, Client } = require('discord.js'); // eslint-disable-line no-unused-vars
const fs = require('fs');

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
  client.commands = new Collection();
  const commandsFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
  commandsFiles.forEach(file => {
    const command = require(`../commands/${file}`);
    client.commands.set(command.name, command);
  });
};