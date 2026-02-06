export class NotesRoutes {
    private static DEFAULT_ROUTE: string = "/notes";
    private static ID: string = this.DEFAULT_ROUTE + "/:id";

    public static getDefaultRoute(): string {
        return this.DEFAULT_ROUTE;
    }

    public static getID(): string {
        return this.ID;
    }
}
