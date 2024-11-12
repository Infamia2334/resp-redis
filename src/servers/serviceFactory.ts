import { createServer, Server } from 'net';
import TCPServer from './tcpServer';
import SocketEventHandler from '../handlers/socketEventHandler';
import RespParser from '../respParser';

export default class ServiceFactory {
    server: Server;
    socketEventHandler: SocketEventHandler;
    respParser: RespParser;

    constructor() {
        this.server = new Server();
        this.respParser = new RespParser();
        this.socketEventHandler = new SocketEventHandler(this.respParser);
    }

    buildTCPServer() {
        console.log('Inside TCP SERVER')
        return new TCPServer(this.server, this.socketEventHandler);
    }
}