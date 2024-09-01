import { Message } from "discord.js";
import { ServerStatus } from "../types";
import { stopServer } from "./stopServer";
import { sendError } from "./sendError";
import { startServer } from "./startServer";

export const readMessage = (message: Message, serverStatus: ServerStatus, client: any) => {
  // prevent the bot responding to itself and if
  if (message.author.id === client.user || message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  console.log(`Message received: ${message.content}`);
  if (!message.channel) return sendError(message, "No channel found.");
  if (message.content === "!status") return message.channel.send("Bot is online!")
  if (message.content === "!help") return sendHelp(message);
  if (message.content === "!stop") return onStop(serverStatus, message, client);
  if (message.content === "!start") return onStart(serverStatus, message, client);
  else {
    console.log(`Command not recognized: ${message.content}`);
    return message.channel.send("Command not recognized. Type !help for a list of commands.");
  }
}

const onStart = (serverStatus: ServerStatus, message: Message, client: any) => {
  console.log('Starting server...');
  if (serverStatus === ServerStatus.STARTING) sendError(message, "Server is already starting.");
  if (serverStatus === ServerStatus.STOPPING) sendError(message, "Server is stopping, please wait before starting.");
  if (serverStatus === ServerStatus.ONLINE) sendError(message, "Server is already online.");
  if (serverStatus === ServerStatus.OFFLINE) startServer(message);
}

const onStop = (serverStatus: ServerStatus, message: Message, client: any) => {
  if (serverStatus === ServerStatus.STARTING) sendError(message, "Server is starting, please wait before stopping.");
  if (serverStatus === ServerStatus.STOPPING) sendError(message, "Server is already stopping.");
  if (serverStatus === ServerStatus.OFFLINE) sendError(message, "Server is already offline.");
  if (serverStatus === ServerStatus.ONLINE) stopServer(message, client);
}

const sendHelp = (message: Message) => {
  message.channel.send(`
  \nHello!\n
  I'm a bot that controls a server. 
  Here are the commands you can use:\n
  **!ping** - Check if I'm awake
  **!help** - You just did this
  **!start** - Start the server
  **!stop** - Power down the server
  **!restart** - Restart the server\n`);
  console.log(`${message.author.globalName} asked for help`)
}