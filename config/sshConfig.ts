export const sshConfig = () => {
    if (!process.env.SSH_USER) {
        throw new Error('SSH_USER environment variable is not set');
    }
    return {
        host: '192.168.2.99',
        port: 22, // Default SSH port
        username: process.env.SSH_USER,
        password: process.env.SSH_PASS,
        debug: console.log
    }
};