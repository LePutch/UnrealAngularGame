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
            if (data.type !== 'coordsCharacter' && data.type !== 'draw') {
            }
            switch (data.type) {
                case 'navy':
                    this.handleNavy(socketId, data.content);
                    break;
                case 'navyDestroy':
                    this.handleNavyDestroy(socketId, data.content);
                    break;
                case 'resetLevers':
                    this.handleResetLever(socketId);
                    break;
                case 'nextLevelLevers':
                    this.handlenextLevelLevers(socketId);
                    break;
                case 'lever':
                    this.handleLever(socketId, data.color);
                    break;
                case 'createAdminRoom':
                    this.handleCreateAdminRoom(socketId);
                    break;
                case 'draw':
                    this.handleDraw(socketId, data.imageData);
                    break;
                case 'createRoom':
                    this.handleCreateRoom(socketId);
                    break;
                case 'joinRoom':
                    this.handleJoinRoom(socketId, data.roomCode);
                    break;
                case 'chat':
                    this.handleChat(socketId, data.content);
                    break;
                case 'jump':
                    this.handleJump(socketId);
                    break;
                case 'basicMessage':
                    this.handleBasicMessage(socketId, data.content);
                    break;
                case 'coordsCharacter':
                    this.handleCoords(socketId, data.content);
                    break;
                case 'gems':
                    this.handleGems(socketId, data.content);
                    break;
                case 'phase':
                    this.handlePhase(socketId, data.content);
                    break;
                case 'power':
                    this.handlePower(socketId, data.content);
                    break;
                case 'anger':
                    this.handleAnger(socketId, data.content);
                    break;
                case 'print':
                    this.handlePrint(socketId);
                    break;
                default:
                    // handle other message types here
                    break;
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    handlePrint(socketId) {
        // print all rooms and connections in the server
        console.log("rooms", this.rooms);
    }

    handleAnger(socketId, content) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const angerMessage = JSON.stringify({ type: 'anger', content: content });
                    roomSocket.send(angerMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }


    handlePower(socketId, content) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const powerMessage = JSON.stringify({ type: 'power', content: content });
                    roomSocket.send(powerMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleNavy(socketId, content) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const navyMessage = JSON.stringify({ type: 'navy', content: content });
                    roomSocket.send(navyMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleNavyDestroy(socketId, content) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const navyDestroyMessage = JSON.stringify({ type: 'navyDestroy', content: content });
                    roomSocket.send(navyDestroyMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handlenextLevelLevers(socketId) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const nextLevelLeversMessage = JSON.stringify({ type: 'nextLevelLevers' });
                    roomSocket.send(nextLevelLeversMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleResetLever(socketId) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const resetLeverMessage = JSON.stringify({ type: 'resetLevers' });
                    roomSocket.send(resetLeverMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleLever(socketId, color) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const leverMessage = JSON.stringify({ type: 'lever', color: color });
                    roomSocket.send(leverMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleDraw(socketId, imageData) {
        const room = Array.from(this.rooms.keys()).find(roomCode => this.rooms.get(roomCode).includes(socketId));
        if (room) {
            const roomSockets = this.rooms.get(room);
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const drawMessage = JSON.stringify({ type: 'draw', imageData: imageData });
                    roomSocket.send(drawMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    // find the room of the socket and the connections of the room
    findRoom(socketId) {
        const room = Array.from(this.rooms.keys()).find(roomCode => this.rooms.get(roomCode).includes(socketId));
        if (room) {
            const roomSockets = this.rooms.get(room);
            return roomSockets;
        } else {
            return null;
        }
    }

    handlePhase(socketId, content) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const phaseMessage = JSON.stringify({ type: 'phase', content: content });
                    roomSocket.send(phaseMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleGems(socketId, content) {
        const roomSockets = this.findRoom(socketId);
        if (roomSockets) {
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const gemMessage = JSON.stringify({ type: 'gems', content: content });
                    roomSocket.send(gemMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }


    handleCoords(socketId, content) {
        const room = Array.from(this.rooms.keys()).find(roomCode => this.rooms.get(roomCode).includes(socketId));
        if (room) {
            const roomSockets = this.rooms.get(room);
            for (const roomId of roomSockets) {
                if (roomId !== socketId) { // Vérifier que ce n'est pas le même socket
                    const roomSocket = this.connections.get(roomId);
                    const chatMessage = JSON.stringify({ type: 'coords', message: content });
                    roomSocket.send(chatMessage);
                }
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }



    handleBasicMessage(socketId, content) {
        const room = Array.from(this.rooms.keys()).find(roomCode => this.rooms.get(roomCode).includes(socketId));
        if (room) {
            const roomSockets = this.rooms.get(room);
            for (const roomId of roomSockets) {
                const roomSocket = this.connections.get(roomId);
                const chatMessage = JSON.stringify({ type: 'basicMessage', message: content });
                roomSocket.send(chatMessage);
            }
        } else {
            // Le socket ne fait pas partie d'une salle, traitement alternatif...
        }
    }

    handleCreateRoom(socketId) {
        const roomCode = uuidv4().substr(0, 6);
        console.log('roomCode', roomCode);
        this.rooms.set(roomCode, [socketId]);

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

    handleCreateAdminRoom(socketId) {
        const roomCode = "admin";
        console.log('roomCode', roomCode);
        this.rooms.set(roomCode, [socketId]);

        const roomCreatedMessage = JSON.stringify({ type: 'roomCreated', codeRoom: roomCode });
        this.connections.get(socketId).send(roomCreatedMessage);
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
