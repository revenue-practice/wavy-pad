import { createApp } from "./app";
import { Config } from "./config";
import { notesRepo } from "./notes/service";

const server = createApp();

async function initiateDB() {
    await notesRepo.init();
    console.log(`DB initialised`);
}

server.listen(Config.getPort(), () => {
    console.log(`Server is listening on PORT ${Config.getPort()}`);
});

initiateDB();
