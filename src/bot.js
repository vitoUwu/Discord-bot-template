const { Client, GatewayIntentBits } = require('discord.js');
const Logger = require('./utils/logger');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
});

client.logger = new Logger('./src/logs', 'bot');
client.commandCooldowns = new Map();

process.on('unhandledRejection', (err) => {
  client.logger.error(err);
});

process.on('uncaughtException', (err) => {
  client.logger.error(err);
});

module.exports = async () => {
  try {
    fs.readdirSync('./src/handlers').forEach(handler => require(`./handlers/${handler}`)(client));
    await client.login(process.env.DISCORD_TOKEN);
    client.logger.log(`Logged in as ${client.user.tag}!`);
  } catch (err) {
    client.logger.error(err);
  }
};