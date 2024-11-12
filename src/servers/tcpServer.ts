import { Server } from 'net';
import SocketEventHandler from '../handlers/socketEventHandler';

export default class TCPServer {
    server: Server
    socketEventHandler: SocketEventHandler;

    constructor(server: Server, socketEventHandler: SocketEventHandler) {
        this.server = server;
        this.socketEventHandler = socketEventHandler;
    }

    startServer() {
        try {
            const PORT = process.env.PORT || 6379;
            this.server.on('connection', (socket) => {
                console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);
    
                this.socketEventHandler.eventListener(socket);
            });

            this.server.listen(PORT, ()=> {
                console.log('Redis server started on port', PORT);
                
            })
        } catch (error) {
            console.error(`Cannot connect to REDIS server, error: ${error}`);
            return;
        }
    }
}