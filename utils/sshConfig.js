const sshConfig = {
  host: '192.168.2.99',
  port: 22, // Default SSH port
  username: 'sshuser',
  password: process.env.SSH_PASS
};

module.exports = sshConfig;