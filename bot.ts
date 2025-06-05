// // const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const dotenv = require("dotenv");
import { ServerStatus } from './types';
import { getServerStatus, setOnline } from './functions'
import { Message } from 'discord.js';
import { checkEnv, initClient, readMessage } from './functions';

dotenv.config();
checkEnv();

const client = initClient();
let serverStatus: ServerStatus = ServerStatus.UNKNOWN;
let channel = null as any;

client.once("ready", async () => {
    console.log("Bot was started successfully!");
    serverStatus = await getServerStatus(serverStatus, channel);
});
client.login(process.env.TOKEN);

setInterval(async () => {
    serverStatus = await getServerStatus(serverStatus, channel);
}, 10000);

console.log("Adding messageCreate listener...");

client.on("messageCreate", (message: Message) => {
    console.log(`Message received: ${message.content}`);
    channel = message.channel;
    readMessage(message, serverStatus, client);
});
// import { Client, GatewayIntentBits } from 'discord.js';
// import dotenv from 'dotenv';

// dotenv.config();

// const client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.MessageContent,
//         GatewayIntentBits.DirectMessages,
//     ]
// });

// client.on('ready', () => {
//     console.log(`🤖 Logged in as ${client.user?.tag}`);
// });

// client.on('messageCreate', (message) => {
//     console.log(`📩 Message from ${message.author.username}: ${message.content}`);
// });

// client.login(process.env.TOKEN);