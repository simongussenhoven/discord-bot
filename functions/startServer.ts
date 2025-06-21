import { Message } from "discord.js";
import { DateTime } from "luxon";
const wol = require("wakeonlan");

export const startServer = (message: Message) => {
    const currentTime = DateTime.now().toLocaleString(DateTime.DATETIME_MED);
    wol("60:45:CB:86:3C:C6").then(() => {
        message.channel.send(`🚀 Starting server at ${currentTime}, this takes about 3 minutes...`);
        console.log(`${message.author} started the server`)
    });
}