const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const dotenv = require("dotenv");
const wol = require("wakeonlan");
// const spawn = require("cross-spawn");
// const exec = require("child_process").exec;
const ping = require("net-ping");
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const options = {
  networkProtocol: ping.NetworkProtocol.IPv4,
  packetSize: 16,
  retries: 1,
  sessionId: process.pid % 65535,
  timeout: 2000,
  ttl: 128,
};

// client starting
client.once("ready", () => {
  console.log("Starting bot...");
});
client.login(process.env.TOKEN);

// when the bot starts, the server status is unknown
let serverStatus = "Server status unknown";
let serverIsStarting = false

const setAlive = () => {
  if (serverStatus === "Server is alive") return;
  client.user.setPresence({ status: "online"})
  serverStatus = `Server is alive (${new Date().toISOString().spl})`;
  client.user.setActivity("server is alive", { type: ActivityType.Custom });
  console.log("Server is alive");
};

const setDown = () => {
  if (serverStatus === "Server is down") return;
  serverStatus = "Server is down";
  client.user.setPresence({ status: "idle"})
  client.user.setActivity(`Server is down (${new Date().toISOString()})`, { type: ActivityType.Custom });
  console.log(`Server is down (${new Date().toISOString()})`);
};

// polling server
console.log('Start polling')
setInterval(() => {
  const session = ping.createSession(options);
  session.pingHost("192.168.2.99", (error, target) => {
    if (error) {
      console.log(`Server is down (${new Date().toISOString()})`);
      setDown();
      return;
    }
    console.log(`Server is alive (${new Date().toISOString()})`);
    serverIsStarting = false
    setAlive();
  });
}, 15000);

// function to check if the server is alive

client.on("messageCreate", async (message) => {
  console.log("Message received", message.content);
  if (message.content === "!ping") {
    message.channel.send("Pong.");
  }
  if (message.content === "!help") {
    message.channel.send(`
    Hello!\n
    I'm a bot that controls a server. 
    Here are the commands you can use:\n
    **!ping** - Check if I'm awake\n
    **!help** - You just did this\n
    **!start** - Start the server\n
    **!stop** - Power down the server\n
    **!restart** - Restart the server`);
  }
  if (message.content === "!start") {
    client.user.setActivity("server starting", { type: ActivityType.Custom });
    wol("60:45:CB:86:3C:C6").then(() => {
      message.channel.send("Starting server, please wait...");
      serverIsStarting = true
    });
  }
  if (message.content === "!stop") {
    message.channel.send("Stopping the server...");
  }
  if (message.content === "!restart") {
    message.channel.send("Restarting the server...");
  }
});
