// Main file for the server side of the application

const express = require('express');
const http = require('http');
const WebSocketServer = require('./websocket-server');
const { getIP, generateQRCode } = require('./utils');
const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode');

const app = express();
const server = http.createServer(app);
const port = 3000;
const portClient = 8123;
const IP_Server = '192.168.1.7';


const webSocketServer = new WebSocketServer(server);

// app.get('/downloadQRCode/:roomCode', (req, res) => {
//     const roomCode = req.params.roomCode;
//     console.log('try to download', roomCode);
//     generateQRCode(IP_Server, portClient, roomCode);
//     res.download('./qr.png');
// });


app.get('/downloadQRCode/:roomCode', async (req, res) => {
    const roomCode = req.params.roomCode;
    console.log('try to download', roomCode);

    const link = `http://${IP_Server}:${portClient}?room=${roomCode}`;

    try {
        const qrCodeBuffer = await generateQRCode2(link);
        res.set('Content-Type', 'image/png');
        res.send(qrCodeBuffer);
    } catch (err) {
        console.error('Erreur lors de la génération du QR code :', err);
        res.status(500).send('Erreur lors de la génération du QR code.');
    }
});

async function generateQRCode2(link) {
    return new Promise((resolve, reject) => {
        qrcode.toBuffer(link, {
            color: {
                dark: '#00F',
                light: '#0000'
            }
        }, function (err, buffer) {
            if (err) {
                reject(err);
            } else {
                console.log('QR code généré avec succès');
                resolve(buffer);
            }
        });
    });
}

server.listen(port, () => {
    console.log('Server listening on port ' + port);
});
