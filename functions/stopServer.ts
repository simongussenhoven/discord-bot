import { ActivityType, Message } from "discord.js";
const { Client: SshClient } = require('ssh2');
import { sendError } from './sendError'
import { sshConfig } from "../config";

export const stopServer = (message: Message, client: any) => {
    console.log('Stopping server...');
    const sshClient = new SshClient();
    console.log('Connecting with config: ' + JSON.stringify(sshConfig()));
    sshClient.on('ready', () => {

        sshClient.exec('sudo -i shutdown -h now', (err: Error, stream: any) => {
            if (err) {
                console.log('(SSH Connection error)', err);
                sendError(message, String(`(SSH client connection error) ${err}`));
                sshClient.end();
                return;
            }

            stream.on('close', (code: any, signal: any) => {
                // Log the shutdown initiation
                console.log(`Shutdown command sent. Stream closed with code ${code} and signal ${signal}`);
                client.user.setActivity("Server is shutting down in 5 seconds...", { type: ActivityType.Custom });

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