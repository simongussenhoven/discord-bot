// start the bot with pm2 start ecosystem.config.js

module.exports = {
  apps : [{
    name   : "bot",
    script: "./bot.js",
    autorestart: false,
  }]
}
