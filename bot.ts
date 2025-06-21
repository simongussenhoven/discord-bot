// // const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const dotenv = require("dotenv");
import { ServerStatus } from './types';
import { getServerStatus, setOnline } from './functions'
import { ActivityType, ChannelType, Message } from 'discord.js';
import { checkEnv, initClient, readMessage } from './functions';
import { DateTime } from 'luxon';

dotenv.config();
checkEnv();

const client = initClient();
let serverStatus: ServerStatus = ServerStatus.UNKNOWN;
let channel = null as any;

const setDiscordStatus = async (status: ServerStatus) => {
    const currentTime = DateTime.now().toLocaleString(DateTime.DATETIME_MED);
    if (!channel) {
        console.error("Channel is not set. Cannot update status.");
        return;
    }
    switch (status) {
        case ServerStatus.ONLINE:
            await channel.client.user?.setPresence({ status: "online" });
            await channel.client.user?.setActivity("Server is online", { type: ActivityType.Custom });
            await channel.send(`✅ Server is online at ${currentTime}!`);
            break;
        case ServerStatus.OFFLINE:
            await channel.client.user?.setPresence({ status: "dnd" });
            await channel.client.user?.setActivity("Server is offline", { type: ActivityType.Custom });
            await channel.send(`💀 Server is offline at ${currentTime}.`);
            break;
        default:
            console.error("Unknown server status.");
    }
}

client.once("ready", async () => {
    console.log("Bot was started successfully!");
});

client.login(process.env.TOKEN);

const checkServerStatus = async () => {
    const status = await getServerStatus();
    if (serverStatus !== status) {
        console.log(`Server status changed: ${ServerStatus[serverStatus]} -> ${ServerStatus[status]}`);
        serverStatus = status;
        setDiscordStatus(serverStatus);
    };
    return status;
}

checkServerStatus();

setInterval(() => {
    checkServerStatus()
}, 10000);

client.on("messageCreate", async (message: Message) => {
    if (message.channel.type !== ChannelType.DM) return
    channel = message.channel;
    readMessage(message, serverStatus, client);
});