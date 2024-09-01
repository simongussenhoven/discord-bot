import { ActivityType, Client } from "discord.js";
import { ServerStatus } from "../types";

export const setOnline = (serverStatus: ServerStatus, client: Client, channel: any) => {
  client.user?.setPresence({ status: "online" })
  client.user?.setActivity("Server is online", { type: ActivityType.Custom });
  if (!channel) return;
  channel.send("Server is online!");
  return ServerStatus.ONLINE;
};

export const setOffline = (serverStatus: ServerStatus, client: Client, channel: any) => {
  client.user?.setPresence({ status: "dnd" })
  client.user?.setActivity("Server is offline", { type: ActivityType.Custom });
  if (!channel) return;
  channel.send("Server is offline!");
  return ServerStatus.OFFLINE
}

export const setStarting = (serverStatus: ServerStatus, client: Client, channel: any) => {
  client.user?.setPresence({ status: "idle" })
  client.user?.setActivity("Server is starting", { type: ActivityType.Custom });
  if (!channel) return;
  channel.send("Server is starting!");
  return ServerStatus.STARTING;
}

export const setStopping = (serverStatus: ServerStatus, client: Client, channel: any) => {
  client.user?.setPresence({ status: "idle" })
  client.user?.setActivity("Server is stopping", { type: ActivityType.Custom });
  if (!channel) return;
  channel.send("Server is stopping!");
  return ServerStatus.STOPPING;
}