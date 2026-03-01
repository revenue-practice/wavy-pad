import { Pool } from "pg";
import { Config } from "../config/config";

const pool = new Pool({
    user: Config.getDBUser(),
    host: "localhost",
    database: Config.getDBHost(),
    password: Config.getDBPassword(),
    port: Config.getDBPort(),
});

pool.on("error", (err) => {
    console.error("idle client error", err.message, err.stack);
});

export default pool;
