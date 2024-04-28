const { Client, GatewayIntentBits, IntentsBitField } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
  ]
});

client.once("ready", () => {
  console.log("Ready!");
});

// show the help menu
console.log('Listening for messages');
client.on("messageCreate", async (message) => {
  console.log('Message received', message.content)
  if (message.content === "!ping") {
    message.channel.send("Pong.");
  }
  if (message.content === "!help") {
    message.channel.send("Here are the commands you can use: \n !ping - to check if the bot is online \n !help - to show this menu");
  }
  if (message.content === "!start") {
    message.channel.send("Starting the server...");
  }
  if (message.content === "!stop") {
    message.channel.send("Stopping the server...");
  }
  if (message.content === "!restart") {
    message.channel.send("Restarting the server...");
  }
});

client.login(process.env.TOKEN);
