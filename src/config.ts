export class Config {
    private static PORT: number = 3000;
    private static DEFAULT_ROUTE: string = "/";
    private static GITHUB_URL: string = "https://api.github.com/users";
    private static SERVER_URL: string = "http://localhost:3000";

    public static getPort(): number {
        return this.PORT;
    }

    public static getDefaultRoute(): string {
        return this.DEFAULT_ROUTE;
    }

    public static getGithubUrl(): string {
        return this.GITHUB_URL;
    }

    public static getServerUrl(): string {
        return this.SERVER_URL;
    }
}
