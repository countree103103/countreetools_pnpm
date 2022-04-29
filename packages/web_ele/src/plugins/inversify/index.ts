import { Container } from "inversify";
import SocketioManager from "../socketio/Manager";

const container = new Container();

container.bind<SocketioManager>(SocketioManager).toSelf().inSingletonScope();

export { container };
