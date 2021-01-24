const ws = require('ws');

const wsServer = new ws.Server({ port: 8181 });

wsServer.on('connection', (ws) => {
    console.log('> starting WS server ...');
    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        ws.send('>> ping');
    });
    ws.send('WS Server is eady!')
});
