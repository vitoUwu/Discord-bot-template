const { Client } = require('discord.js');  // eslint-disable-line no-unused-vars
const fs = require('fs');

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
  const commandsFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
  commandsFiles.forEach(file => {
    const event = require(`../events/${file}`);
    client.on(event.name, event.execute);
  });
};