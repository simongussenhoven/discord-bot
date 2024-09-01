//const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
import { Client, GatewayIntentBits } from 'discord.js'
export const initClient = () => {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessageReactions,
    ],
  });
}