import "dotenv/config";
import { createApp } from "./app";
import { Config } from "./config/config";
import "./models/pool";

async function main() {
    const app = createApp();
    app.listen(Config.getPort(), () => {
        console.log(`Server listening on ${Config.getPort()}`);
    });
}

void main();
