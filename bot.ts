// const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const dotenv = require("dotenv");
const wol = require("wakeonlan");
const { Client: SshClient } = require('ssh2');
import { sshConfig } from './config'
import { ServerStatus } from './types';
import { getServerStatus, setOnline } from './functions'
import { Message } from 'discord.js';
import { checkEnv, initClient, readMessage } from './functions';
import { server } from 'typescript';

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

client.on("messageCreate", (message: Message) => {
  channel = message.channel;
  readMessage(message, serverStatus, client);
});
