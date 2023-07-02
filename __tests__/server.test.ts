import request from "supertest";
import { Server } from "../src/server";
import { UserService } from "../src/service";

describe("GET /", () => {
  let server;

  beforeAll(() => {
    server = new Server(5555, UserService);
    server.start();
  });

  afterAll(() => {
    server.stop();
  });

  test("should return  statuscode 200", async () => {
    const response = await request(server.getServer()).get("/");
    expect(response.status).toBe(200);
  });

  test("should return users Array", async () => {
    const response = await request(server.getServer()).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toContain("application/json");
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("should return New User", async () => {
    const userData = { username: "Alex", age: 45, hobbies: ["dev", "travel"] };
    const response = await request(server.getServer()).post("/api/users").send(userData);
    expect(response.status).toBe(201);
    expect(response.header["content-type"]).toContain("application/json");
    expect(response.body).toHaveProperty("id");
    expect(response.body.username).toBe(userData.username);
    expect(response.body.age).toBe(userData.age);
    expect(response.body.hobbies).toEqual(userData.hobbies);
  });

  test("should return user by Id", async () => {
    const id = `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`;
    const response = await request(server.getServer()).get(`/api/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toContain("application/json");
    expect(response.body.id).toBe(id);
  });

  test("should return  updated user", async () => {
    const id = `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`;
    const userData = { username: "Alex", age: 45, hobbies: ["dev", "travel", "sport"] };
    const response = await request(server.getServer()).put(`/api/users/${id}`).send(userData);
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toContain("application/json");
    expect(response.body.id).toBe(id);
    expect(response.body.hobbies).toContain("sport");
  });

  test("should delete user by Id", async () => {
    const id = `1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed`;
    const response = await request(server.getServer()).delete(`/api/users/${id}`);
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
  });

  test("should return status code 404 for delete not existing user", async () => {
    const id = `aa1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a`;
    const respText = `user doesn't exist`;
    const response = await request(server.getServer()).get(`/api/users/${id}`);
    expect(response.status).toBe(404);
    expect(response.text).toBe(respText);
  });
});
