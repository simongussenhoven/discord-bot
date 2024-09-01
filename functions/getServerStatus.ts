import { ServerStatus } from "../types";

export const getServerStatus = async (serverStatus: ServerStatus, channel: any) => {

  try {
    const response = await fetch('http://192.168.2.99:5000');
    if (response) {
      console.info(new Date().toLocaleString() + ': Server is online');
      if (serverStatus === ServerStatus.OFFLINE) channel.send('Server status changed to online');
      return ServerStatus.ONLINE;
    }
  }
  catch (error) {
    console.info(new Date().toLocaleString() + ': Server is offline');
    if (serverStatus === ServerStatus.ONLINE) channel.send('Server status changed to offline');
    return ServerStatus.OFFLINE;
  }
  return ServerStatus.UNKNOWN;
}