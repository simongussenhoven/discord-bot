import { Message } from "discord.js";

export const sendError = (message: Message, error: string) => {
  const errorMessage = `${String(error).includes('Error: ') ? error : `Error: ${error}`}`;
  message.channel.send(errorMessage);
};