// All the logic for the WebSocket server goes here

const WebSocket = require('ws');
const qrcode = require('qrcode');
const { getIP, generateQRCode } = require('./utils');
const { v4: uuidv4 } = require('uuid');

const portClient = 8123;
const IP_Server = '192.168.1.7';


class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.connections = new Map();
        this.rooms = new Map();

        this.wss.on('connection', this.handleConnection.bind(this));
    }

    handleConnection(socket) {
        const socketId = uuidv4();
        this.connections.set(socketId, socket);

        console.log(`Socket ${socketId} connected`);

        const successMessage = JSON.stringify({ type: 'success', message: 'Connexion succeed !' });
        socket.send(successMessage);

        socket.on('message', (message) => {
            this.handleMessage(socketId, message);
        });

        socket.on('close', () => {
            this.handleSocketClose(socketId);
        });
    }

    // Core function of the server 

    handleMessage(socketId, message) {
        try {
            const data = JSON.parse(message);
            console.log(`Received message from socket ${socketId}: ${message}`);

            if (data.type === 'createRoom') {
                this.handleCreateRoom(socketId);
            } else if (data.type === 'joinRoom') {
                this.handleJoinRoom(socketId, data.roomCode);
            } else if (data.type === 'chat') {
                this.handleChat(socketId, data.content);
            } else if (data.type === 'jump') {
                this.handleJump(socketId);
            } else {
                // handle other message types here
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    handleCreateRoom(socketId) {
        const roomCode = uuidv4().substr(0, 6);
        console.log('roomCode', roomCode);
        this.rooms.set(roomCode, [socketId]);

        generateQRCode(IP_Server, portClient, roomCode);
        const roomCreatedMessage = JSON.stringify({ type: 'roomCreated', codeRoom: roomCode });
        this.connections.get(socketId).send(roomCreatedMessage);


        // For self-host server (not implemented yet)
        /*
        const IP = getIP();
        if (IP.length > 0) {
            generateQRCode(IP[0], portClient, roomCode);
            const roomCreatedMessage = JSON.stringify({ type: 'roomCreated', roomCode });
            this.connections.get(socketId).send(roomCreatedMessage);
        } else {
            const roomCreatedFailedMessage = JSON.stringify({ type: 'roomCreatedFailed', roomCode });
            this.connections.get(socketId).send(roomCreatedFailedMessage);
        }
        */
    }

    handleJoinRoom(socketId, roomCode) {
        if (this.rooms.has(roomCode)) {
            const room = this.rooms.get(roomCode);
            if (!room.some(id => id === socketId)) {
                room.push(socketId);
                this.rooms.set(roomCode, room);

                const roomJoinedMessage = JSON.stringify({ type: 'roomJoined', message: 'You join the room.' });
                const socket = this.connections.get(socketId);
                socket.send(roomJoinedMessage);

                const otherSocket = Array.from(room).find(id => id !== socketId);
                if (otherSocket) {
                    const otherSocketObjs = room.map(roomId => this.connections.get(roomId)).filter(sock => sock !== socket);
                    if (otherSocketObjs.length > 0) {
                        const partnerJoinedMessage = JSON.stringify({ type: 'partnerJoined', message: 'Your partner joined the room.' });
                        for (const otherSocketObj of otherSocketObjs) {
                            otherSocketObj.send(partnerJoinedMessage);
                        }
                    }
                } else {
                    const partnerDisconnectedMessage = JSON.stringify({ type: 'partnerDisconnected', message: 'Your partner disconnected.' });
                    this.connections.get(socketId).send(partnerDisconnectedMessage);
                }
            }
        } else {
            const roomNotFoundMessage = JSON.stringify({ type: 'error', message: 'Room not found.' });
            this.connections.get(socketId).send(roomNotFoundMessage);
        }
    }

    handleJump(socketId) {
        const room = Array.from(this.rooms.keys()).find(roomCode => this.rooms.get(roomCode).includes(socketId));
        if (room) {
            const roomSockets = this.rooms.get(room);
            for (const roomId of roomSockets) {
                const roomSocket = this.connections.get(roomId);
                const chatMessage = JSON.stringify({ type: 'jump' });
                roomSocket.send(chatMessage);
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleChat(socketId, content) {
        const room = Array.from(this.rooms.keys()).find(roomCode => this.rooms.get(roomCode).includes(socketId));
        if (room) {
            const roomSockets = this.rooms.get(room);
            for (const roomId of roomSockets) {
                const roomSocket = this.connections.get(roomId);
                const chatMessage = JSON.stringify({ type: 'chat', message: content });
                roomSocket.send(chatMessage);
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }


    handleSocketClose(socketId) {
        console.log(`Socket ${socketId} disconnected`);
        this.connections.delete(socketId);

        // Remove the socket from the room it was in
        for (const [roomCode, room] of this.rooms.entries()) {
            const index = room.indexOf(socketId);
            if (index !== -1) {
                room.splice(index, 1);
                if (room.length === 0) {
                    this.rooms.delete(roomCode);
                } else {
                    this.rooms.set(roomCode, room);
                }
                // Notify the other socket in the room that their partner disconnected
                const otherSocket = room.find(id => id !== socketId);
                if (otherSocket) {
                    const otherSocketObj = this.connections.get(otherSocket);
                    const partnerDisconnectedMessage = JSON.stringify({ type: 'partnerDisconnected', message: 'Your partner disconnected.' });
                    otherSocketObj.send(partnerDisconnectedMessage);
                }
                break;
            }
        }
    }
}

module.exports = WebSocketServer;
