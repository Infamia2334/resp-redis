
import ServiceFactory from "./servers/serviceFactory";

const serviceFactory = new ServiceFactory();
serviceFactory.buildTCPServer().startServer();