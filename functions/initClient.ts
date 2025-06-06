import { Client, GatewayIntentBits, Partials } from 'discord.js'
export const initClient = () => {
    return new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.DirectMessages,
        ],
        partials: [Partials.Channel, Partials.Message, Partials.Reaction],
    });
}