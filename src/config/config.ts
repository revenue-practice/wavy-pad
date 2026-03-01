export class Config {
    private static PORT: number = 3000;
    private static DEFAULT_ROUTE: string = "/";
    private static SERVER_URL: string = "http://localhost:3000";

    private static dbUser: string = process.env.DB_USER!;
    private static dbHost: string = process.env.DB_NAME!;
    private static dbPassword: string = process.env.DB_PASSWORD!;
    private static dbPort: number = Number(process.env.DB_PORT!);
    private static dbUrl: string = process.env.DATABASE_URL!;

    public static getPort(): number {
        return this.PORT;
    }

    public static getDefaultRoute(): string {
        return this.DEFAULT_ROUTE;
    }

    public static getServerUrl(): string {
        return this.SERVER_URL;
    }

    public static getDBUser(): string {
        return this.dbUser;
    }

    public static getDBHost(): string {
        return this.dbHost;
    }

    public static getDBPassword(): string {
        return this.dbPassword;
    }

    public static getDBPort(): number {
        return this.dbPort;
    }

    public static getDatabaseUrl(): string {
        return this.dbUrl;
    }
}
