// // const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const dotenv = require("dotenv");
import { ServerStatus } from './types';
import { getServerStatus, setOnline } from './functions'
import { ChannelType, Message } from 'discord.js';
import { checkEnv, initClient, readMessage } from './functions';

dotenv.config();
checkEnv();

const client = initClient();
let serverStatus: ServerStatus = ServerStatus.UNKNOWN;
let channel = null as any;

const setDiscordStatus = async (status: ServerStatus) => {
    if (!channel) {
        console.error("Channel is not set. Cannot update status.");
        return;
    }
    switch (status) {
        case ServerStatus.ONLINE:
            await channel.client.user?.setPresence({ status: "online" });
            await channel.client.user?.setActivity("Server is online", { type: "CUSTOM" });
            await channel.send("Server is online!");
            break;
        case ServerStatus.OFFLINE:
            await channel.client.user?.setPresence({ status: "dnd" });
            await channel.client.user?.setActivity("Server is offline", { type: "CUSTOM" });
            await channel.send("Server is offline!");
            break;
        default:
            console.error("Unknown server status.");
    }
}

client.once("ready", async () => {
    console.log("Bot was started successfully!");
});

client.login(process.env.TOKEN);

setInterval(async () => {
    const status = await getServerStatus();
    if (serverStatus !== status) {
        serverStatus = status;
        setDiscordStatus(serverStatus);
    };
}, 10000);

client.on("messageCreate", (message: Message) => {
    if (message.channel.type !== ChannelType.DM) return
    channel = message.channel;
    readMessage(message, serverStatus, client);
});