import { ServerStatus } from "../types";

export const getServerStatus = async () => {
    try {
        const response = await fetch('http://192.168.2.99:5000');
        if (response) {
            return ServerStatus.ONLINE;
        }
    }
    catch (error) {
        return ServerStatus.OFFLINE;
    }
    return ServerStatus.UNKNOWN;
}