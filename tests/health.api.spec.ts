import { describe, it, expect } from "vitest";
import request from "supertest";
import { HealthRoutes } from "../src/health/routes.constants";
import { createApp } from "../src/app";

describe("Health Check API", () => {
    const app = createApp();

    it("Health Check", async () => {
        const response = await request(app)
            .get(HealthRoutes.getHealthRoute())
            .send({});
        expect(response.status).toStrictEqual(200);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({ ok: true });
    });
});
