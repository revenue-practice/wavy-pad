import { notesRepo } from "./notes/service";

export async function initiateDB() {
    await notesRepo.init();
}
