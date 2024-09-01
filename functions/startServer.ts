import { Message } from "discord.js";
const wol = require("wakeonlan");

export const startServer = (message: Message) => {
  wol("60:45:CB:86:3C:C6").then(() => {
    message.channel.send("Starting server, please wait...");
    console.log(`${message.author} started the server`)
  });
}