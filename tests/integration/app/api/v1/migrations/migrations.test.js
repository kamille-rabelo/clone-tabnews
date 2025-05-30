import database from "infra/database";

describe("api/v1/migrations", () => {
  beforeEach(async () => {
    await database.query(
      "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;",
    );
  });

  describe("GET", () => {
    test("should return 200 with migrations list", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");

      const responseBody = await response.json();
      expect(response.status).toBe(200);
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });

  describe("POST", () => {
    test("should return 200 on successful migration", async () => {
      const firstResponse = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "POST",
        },
      );

      const firstResponseBody = await firstResponse.json();
      expect(firstResponse.status).toBe(201);
      expect(Array.isArray(firstResponseBody)).toBe(true);
      expect(firstResponseBody.length).toBeGreaterThan(0);

      const secondResponse = await fetch(
        "http://localhost:3000/api/v1/migrations",
        {
          method: "POST",
        },
      );

      const secondResponseBody = await secondResponse.json();
      expect(secondResponse.status).toBe(200);
      expect(Array.isArray(secondResponseBody)).toBe(true);
      expect(secondResponseBody.length).toBe(0);
    });
  });
});
