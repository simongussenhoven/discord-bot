const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const dotenv = require("dotenv");
const wol = require("wakeonlan");
const ping = require("net-ping");
const { Client: SshClient } = require('ssh2');

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

const sshConfig = {
  host: '192.168.2.99',
  port: 22, // Default SSH port
  username: 'sshuser',
  password: process.env.SSH_PASS
};

// client starting
client.once("ready", () => {
  console.log("Starting bot...");
});
client.login(process.env.TOKEN);

// when the bot starts, the server status is unknown
let serverStatus = "unknown";
let channel = null;

// set the server status to online
const setOnline = () => {
  if (serverStatus === "Server is online" || serverStatus === "Server is stopping...") return;
  client.user.setPresence({ status: "online" })
  client.user.setActivity("Server is online", { type: ActivityType.Custom });
  serverStatus = `Server is online`;
  if (!channel) return
  channel.send("Server is online!");
};

// set the server status to offline
const setOffline = () => {
  if (serverStatus === "Server is offline" || serverStatus === "Server is starting...") return;
  client.user.setPresence({ status: "idle"})
  client.user.setActivity(`Server is offline`, { type: ActivityType.Custom });
  serverStatus = "Server is offline";
  if (!channel) return
  channel.send("Server is offline!");
};

// set the server status to restarting
const setStarting = () => {
  if (serverStatus === "Server is starting") return;
  client.user.setActivity("Server is starting...", { type: ActivityType.Custom });
  serverStatus = "Server is starting...";
}

// set the server status to stopping
const setStopping = () => {
  if (serverStatus === "Server is stopping") return;
  client.user.setActivity("Server is stopping...", { type: ActivityType.Custom });
  serverStatus = "Server is stopping...";
}

// shutdown the server
const shutDown = () => {
  const sshClient = new SshClient();
  sshClient.on('ready', () => {
    sshClient.exec('sudo -i shutdown now', (err, stream) => {
      if (err) {
        channel.send("Error shutting down server: " + err);
        console.error('Error:', err);
      };
      stream.on('close', (code, signal) => {
        client.user.setActivity("Server is shutting down...", { type: ActivityType.Custom });
        console.log(`Stream closed with code ${code} and signal ${signal}`);
        sshClient.end();
      });
    });
  }).connect(sshConfig);
}

// catch ssh error
client.on('error', (err) => {
  console.error('Error:', err);
});


// polling server
console.log('Start polling')
const regularPolling = setInterval(() => {
  const session = ping.createSession(options);
  session.pingHost("192.168.2.99", (error, target) => {
    if (error) {
      console.log(`Server is offline (${new Date().toISOString()})`);
      setOffline();
      return;
    }
    console.log(`Server is online (${new Date().toISOString()})`);
    setOnline();
  });
}, 15000);

// handle messages
client.on("messageCreate", async (message) => {
  channel = message.channel;
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
    wol("60:45:CB:86:3C:C6").then(() => {
      message.channel.send("Starting server, please wait...");
      serverIsStarting = true
    });
    setStarting();
  }
  if (message.content === "!stop") {
    message.channel.send("Stopping the server...");
    setStopping();
    shutDown();
  }
  if (message.content === "!restart") {
    message.channel.send("Restarting the server...");
  }
});
