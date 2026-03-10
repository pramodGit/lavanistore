import request from "supertest";
import app from "../app.js";

describe("Dashboard API", () => {
  it("should get overview data", async () => {
    const res = await request(app).get("/api-doc/dashboard/overview");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalProperties");
  });

  it("should get user list", async () => {
    const res = await request(app).get("/api-doc/dashboard/users");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
  });

  it("should update user role", async () => {
    const res = await request(app)
      .patch("/api-doc/dashboard/users/u102")
      .send({ role: "admin" });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe("admin");
  });
});