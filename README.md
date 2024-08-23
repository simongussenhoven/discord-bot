# discord-bot

This bot sends commands to a server. Add this bot to your server to control your linux server with discord bot commands!

# known issues

Find the path to the Node.js binary:

*bash*
```which node```

This will typically return something like /usr/bin/node.
Add the CAP_NET_RAW capability to the Node.js binary:

*bash*

```sudo setcap cap_net_raw+ep /usr/bin/node```

Replace /usr/bin/node with the correct path if it differs.

cap_net_raw+ep gives the binary the capability to create raw sockets (cap_net_raw) and allows it to keep the effective capability after gaining additional privileges (+ep).