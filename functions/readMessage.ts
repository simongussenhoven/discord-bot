import { Message } from "discord.js";
import { ServerStatus } from "../types";
import { stopServer } from "./stopServer";
import { sendError } from "./sendError";
import { startServer } from "./startServer";
import { getServerStatus } from "./getServerStatus";

export const readMessage = (message: Message, serverStatus: ServerStatus, client: any) => {
    // prevent the bot responding to itself
    if (message.author.id === client.user || message.author.bot) return;
    if (!message.channel) return sendError(message, "No channel found.");
    if (message.content === "!help") return sendHelp(message);
    if (message.content === "!stop") return onStop(serverStatus, message, client);
    if (message.content === "!start") return onStart(serverStatus, message, client);
    if (message.content === "!restart") {
        if (serverStatus === ServerStatus.ONLINE) {
            stopServer(message, client);
            setTimeout(() => startServer(message), 5000); // wait 5 seconds before starting again
        } else {
            sendError(message, "Server is not online, cannot restart.");
        }
    }
    else {
        return message.channel.send("Command not recognized. Type !help for a list of commands.");
    }
}

const onStart = (serverStatus: ServerStatus, message: Message, client: any) => {
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
    message.channel.send(`\n
  I'm a bot that controls a server. 
  Here are the commands you can use:\n
  **!help** - You just did this
  **!start** - Start the server
  **!stop** - Power down the server
  **!restart** - Restart the server\n
  **!status** - Get the current status of the server\n`);
}