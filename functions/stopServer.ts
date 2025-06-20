import { ActivityType, Message } from "discord.js";
const { Client: SshClient } = require('ssh2');
import { sendError } from './sendError'
import { sshConfig } from "../config";
import { DateTime } from "luxon";



export const stopServer = (message: Message) => {
    const currentTime = DateTime.now().toLocaleString(DateTime.DATETIME_MED);
    message.channel.send(`🛑 Stopping server at ${currentTime}, please wait...`);
    const sshClient = new SshClient();
    sshClient.on('ready', () => {

        sshClient.exec('sudo -i shutdown -h now', (err: Error, stream: any) => {
            if (err) {
                console.error('(SSH Connection error)', err);
                sendError(message, String(`(SSH client connection error) ${err}`));
                sshClient.end();
                return;
            }

            stream.on('close', (code: any, signal: any) => {
                // Close the SSH connection gracefully
                sshClient.end();
            });

            // Handle potential stream errors
            stream.on('error', (err: any) => {
                console.error('(SSH Stream Connection)', err);
                sendError(message, err);
                sshClient.end();
            });

            // It's optional to consume the stream's output
            stream.on('data', (data: any) => {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', (data: any) => {
                console.log('STDERR: ' + data);
            });
        });
    }).on('error', (err: any) => {
        // Handle SSH connection errors
        console.error('(SSH Connection)', err);
        sendError(message, err);
    }).connect(sshConfig());
}