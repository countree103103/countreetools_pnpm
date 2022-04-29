import { Container } from "inversify";
import SocketioManager from "@/plugins/socketio";

const container = new Container();

container.bind<SocketioManager>(SocketioManager).toSelf().inSingletonScope();

export { container };
