import { Socket } from 'net';
import RespParser from '../respParser';

export default class SocketEventHandler {
    private respParser: RespParser;

    constructor(respParser: RespParser) {
        this.respParser = respParser;
    }
    
    eventListener(socket: Socket) {
        socket.on('data', (buffer) => {
            let command;
            try {
                command = this.respParser.deserialize(buffer);  
            } catch (error) {
                socket.write('-ERR Invalid command format\r\n');
                return;
            }


            if (Array.isArray(command) && command.length > 0) {
                const mainCommand = command[0]; // The primary command keyword (e.g., "PING" or "ECHO")
    
                switch (mainCommand) {
                    case 'PING':
                        socket.write('+PONG\r\n');
                        break;
    
                    case 'ECHO':
                        // Ensure there's a second element to echo back
                        if (command.length > 1 && typeof command[1] === 'string') {
                            socket.write(`+${command[1]}\r\n`);
                        } else {
                            socket.write('-ERR ECHO requires a message to echo\r\n');
                        }
                        break;
    
                    default:
                        socket.write('-ERR Unknown command\r\n');
                        break;
                }
            } else if (typeof command === 'string' || typeof command === 'number') {
                // Handle inline or integer commands here if applicable
                socket.write(`+${command}\r\n`);
            } else {
                socket.write('-ERR Unsupported command format\r\n');
            }
        });

        socket.on('end', () => {
            console.log(`DISCONNECTED: ${socket.remoteAddress}:${socket.remotePort}`);
        });
        
        socket.on('error', (error) => {
            console.error(`Socket error: ${error.message}`);
        });
    }
}