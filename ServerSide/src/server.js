// Main file for the server side of the application

const express = require('express');
const http = require('http');
const WebSocketServer = require('./websocket-server');
const { getIP, generateQRCode } = require('./utils');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode-svg');
const svg2img = require('svg2img');

const app = express();
const server = http.createServer(app);
const port = 3000;
const portClient = 8123;
const IP_Server = '192.168.1.7';


const webSocketServer = new WebSocketServer(server);

app.get('/downloadQRCode/:roomCode', (req, res) => {
    const roomCode = req.params.roomCode;
    console.log('Try to download', roomCode);

    const link = `http://${IP_Server}:${portClient}?room=${roomCode}`;

    try {
        const qrCodeSVG = generateQRCode2(link);

        svg2img(qrCodeSVG, (error, buffer) => {
            if (error) {
                console.error('Erreur lors de la conversion en PNG :', error);
                res.status(500).send('Erreur lors de la conversion en PNG.');
            } else {
                res.set('Content-Type', 'image/png');
                res.send(buffer);
            }
        });
    } catch (err) {
        console.error('Erreur lors de la génération du QR code :', err);
        res.status(500).send('Erreur lors de la génération du QR code.');
    }
});

function generateQRCode2(link) {
    const qr = new QRCode(link, {
        width: 300,
        height: 300,
        color: '#000',
        background: 'transparent'
    });
    return qr.svg();
}


server.listen(port, () => {
    console.log('Server listening on port ' + port);
});
