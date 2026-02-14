import "dotenv/config";
import { createApp } from "./app";
import { Config } from "./config";
import { initiateDB } from "./db";

async function main() {
    await initiateDB();

    const app = createApp();
    app.listen(Config.getPort(), () => {
        console.log(`Server listening on ${Config.getPort()}`);
    });
}

void main();
