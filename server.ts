
import ServiceFactory from "./src/servers/serviceFactory";

const serviceFactory = new ServiceFactory();
serviceFactory.buildTCPServer().startServer();