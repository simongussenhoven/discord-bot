import { ActivityType, Channel, Client } from "discord.js";
import { ServerStatus } from "../types";

export const setOnline = (channel: any) => {
    console.log(channel)
    if (!channel) return;
    channel.client.user?.setPresence({ status: "online" })
    channel.client.user?.setActivity("Server is online", { type: ActivityType.Custom });
    channel.send("Server is online!");
    return ServerStatus.ONLINE;
};

export const setOffline = (channel: any) => {
    console.log(channel)
    if (!channel) return;
    channel.client.user?.setPresence({ status: "dnd" })
    channel.client.user?.setActivity("Server is offline", { type: ActivityType.Custom });
    channel.send("Server is offline!");
    return ServerStatus.OFFLINE
}