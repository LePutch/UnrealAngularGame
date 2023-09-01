const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;

const connections = new Map();
const rooms = new Map();

wss.on('connection', (socket) => {
    const socketId = uuidv4();
    connections.set(socketId, socket);

    console.log(`Socket ${socketId} connected`);

    const successMessage = JSON.stringify({ type: 'success', message: 'Connexion réussie !' });
    socket.send(successMessage);

    socket.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`Received message from socket ${socketId}: ${message}`);


            console.log('Existing room:', rooms);
            console.log('Socket ID:', socketId);

            if (data.type === 'createRoom') {
                const roomCode = uuidv4().substr(0, 6);
                console.log('roomCode', roomCode);
                rooms.set(roomCode, [socketId]);

                const roomCreatedMessage = JSON.stringify({ type: 'roomCreated', roomCode });
                socket.send(roomCreatedMessage);
            } else if (data.type === 'joinRoom') {
                const roomCode = data.roomCode;
                if (rooms.has(roomCode)) {
                    const room = rooms.get(roomCode);
                    if (!room.some(id => id === socketId)) {
                        console.log('room', room);
                        room.push(socketId);
                        rooms.set(roomCode, room);
                        const roomJoinedMessage = JSON.stringify({ type: 'roomJoined', message: 'Vous avez rejoint la salle.' });
                        socket.send(roomJoinedMessage);

                        const otherSocket = Array.from(room).find(id => id !== socketId);
                        if (otherSocket) {
                            const otherSocketObjs = room
                                .map(roomId => connections.get(roomId))
                                .filter(sock => sock !== socket);

                            if (otherSocketObjs.length > 0) {
                                const partnerJoinedMessage = JSON.stringify({ type: 'partnerJoined', message: 'Votre partenaire a rejoint la salle.' });
                                for (const otherSocketObj of otherSocketObjs) {
                                    otherSocketObj.send(partnerJoinedMessage);
                                }
                            }
                        } else {
                            const partnerDisconnectedMessage = JSON.stringify({ type: 'partnerDisconnected', message: 'Votre partenaire s\'est déconnecté.' });
                            socket.send(partnerDisconnectedMessage);
                        }
                    }
                } else {
                    const roomNotFoundMessage = JSON.stringify({ type: 'error', message: 'Salle introuvable.' });
                    socket.send(roomNotFoundMessage);
                }
            } else if (data.type === 'chat') {
                // Traitements pour les messages de chat
                const room = Array.from(rooms.keys()).find(roomCode => rooms.get(roomCode).includes(socketId));
                if (room) {
                    const roomSockets = rooms.get(room);
                    for (const roomId of roomSockets) {
                        const roomSocket = connections.get(roomId);
                        const chatMessage = JSON.stringify({ type: 'chat', message: data.content });
                        roomSocket.send(chatMessage);
                    }
                } else {
                    // Le socket ne fait pas partie d'une salle, traitement alternatif...
                }
            }
            else {
                // Traitements pour les autres types de messages
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });

    socket.on('close', () => {
        console.log(`Socket ${socketId} disconnected`);
        connections.delete(socketId);

        // Retirer le socket de toutes les salles
        for (const [roomCode, room] of rooms.entries()) {
            console.log("socket close", socketId, room[0]);

            const index = room.indexOf(socketId);
            const tempSocket = room[0];
            if (index !== -1) {
                room.splice(index, 1);
                if (room.length === 0) {
                    rooms.delete(roomCode);
                } else {
                    rooms.set(roomCode, room);
                }

                const otherSocketIndex = room.indexOf(socketId) === 0 ? 1 : 0;
                const otherSocket = room[otherSocketIndex];

                if (otherSocket) {
                    const otherSocketObj = connections.get(otherSocket);
                    if (otherSocketObj) {
                        if (socketId === tempSocket) {
                            console.log(socketId, room[0]);
                            const creatorDisconnectedMessage = JSON.stringify({ type: 'creatorDisconnected', message: 'Le créateur s\'est déconnecté.' });
                            for (const otherSocketObj of room.map(roomId => connections.get(roomId)).filter(sock => sock !== socket)) {
                                otherSocketObj.send(creatorDisconnectedMessage);
                            }
                        }
                        else {
                            const partnerDisconnectedMessage = JSON.stringify({ type: 'partnerDisconnected', message: 'Votre partenaire s\'est déconnecté.' });
                            for (const otherSocketObj of room.map(roomId => connections.get(roomId)).filter(sock => sock !== socket)) {
                                otherSocketObj.send(partnerDisconnectedMessage);
                            }
                        }
                    }
                }

                // Vérifier si la room est vide après avoir retiré la socket
                if (room.length === 0) {
                    rooms.delete(roomCode);
                    console.log('Room deleted:', roomCode);
                }
                break;
            }
        }
    });

});

server.listen(port, () => {
    console.log('Server listening on port ' + port);
});
