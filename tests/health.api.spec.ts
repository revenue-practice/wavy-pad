import { describe, it, expect } from "vitest";
import request from "supertest";
import { HealthRoutes } from "../src/health/routes.constants";
import { createApp } from "../src/app";
import { Constants } from "../src/utils/constants";

describe("Health Check API", () => {
    const app = createApp();

    it("Health Check", async () => {
        const response = await request(app)
            .get(HealthRoutes.getHealthRoute())
            .send({});

        expect(response.status).toStrictEqual(Constants.STATUS_CODES[200]);
        expect(response.headers["x-request-id"]).toBeTruthy();
        expect(response.body).toStrictEqual({ ok: true });
    });
});
