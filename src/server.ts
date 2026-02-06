import { createApp } from "./app";
import { Config } from "./config";

const server = createApp();

server.listen(Config.getPort(), () => {
    console.log(`Server is listening on PORT ${Config.getPort()}`);
});
