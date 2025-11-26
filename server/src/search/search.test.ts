import request from "supertest";
import app from "../app";

describe("GET /search", () => {
  it("rejects short queries", async () => {
    const r = await request(app).get("/search/ab");
    expect(r.status).toBe(400);
  });

  it("returns results for a valid query", async () => {
    const r = await request(app).get("/search/rod");
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);

    if (r.body.length > 0) {
      const first = r.body[0];
      expect(first).toHaveProperty("street");
      expect(first).toHaveProperty("postNumber");
      expect(first).toHaveProperty("city");
    }
  });
});
