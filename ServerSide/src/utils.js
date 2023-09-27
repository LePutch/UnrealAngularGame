// Utils functions for the server side

const { networkInterfaces } = require('os');
const qrcode = require('qrcode');

function getIP() {
    const nets = networkInterfaces();
    const ipv4Addresses = [];

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                ipv4Addresses.push(net.address);
            }
        }
    }
    return ipv4Addresses;
}

function generateQRCode(IP, portClient, roomCode) {
    const link = `http://${IP}:${portClient}?room=${roomCode}`;

    qrcode.toFile('./qr.png', link, {
        color: {
            dark: '#00F',
            light: '#0000'
        }
    }, function (err) {
        if (err) throw err;
        console.log('QR code généré avec succès');
    });
}

module.exports = { getIP, generateQRCode };
