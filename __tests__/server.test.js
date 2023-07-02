"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../src/server");
const service_1 = require("../src/service");
describe("GET /", () => {
    let server;
    beforeAll(() => {
        server = new server_1.Server(5555, service_1.UserService);
        server.start();
    });
    afterAll(() => {
        server.stop();
    });
    test("should return  statuscode 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server.getServer()).get("/");
        expect(response.status).toBe(200);
    }));
    test("should return users Array", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server.getServer()).get("/api/users");
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toContain("application/json");
        expect(Array.isArray(response.body)).toBe(true);
    }));
    test("should return New User", () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = { username: "Alex", age: 45, hobbies: ["dev", "travel"] };
        const response = yield (0, supertest_1.default)(server.getServer()).post("/api/users").send(userData);
        expect(response.status).toBe(201);
        expect(response.header["content-type"]).toContain("application/json");
        expect(response.body).toHaveProperty("id");
        expect(response.body.username).toBe(userData.username);
        expect(response.body.age).toBe(userData.age);
        expect(response.body.hobbies).toEqual(userData.hobbies);
    }));
    test("should return user by Id", () => __awaiter(void 0, void 0, void 0, function* () {
        const id = `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`;
        const response = yield (0, supertest_1.default)(server.getServer()).get(`/api/users/${id}`);
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toContain("application/json");
        expect(response.body.id).toBe(id);
    }));
    test("should return  updated user", () => __awaiter(void 0, void 0, void 0, function* () {
        const id = `9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d`;
        const userData = { username: "Alex", age: 45, hobbies: ["dev", "travel", "sport"] };
        const response = yield (0, supertest_1.default)(server.getServer()).put(`/api/users/${id}`).send(userData);
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toContain("application/json");
        expect(response.body.id).toBe(id);
        expect(response.body.hobbies).toContain("sport");
    }));
    test("should delete user by Id", () => __awaiter(void 0, void 0, void 0, function* () {
        const id = `1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed`;
        const response = yield (0, supertest_1.default)(server.getServer()).delete(`/api/users/${id}`);
        expect(response.status).toBe(204);
        expect(response.text).toBe("");
    }));
    test("should return status code 404 for delete not existing user", () => __awaiter(void 0, void 0, void 0, function* () {
        const id = `aa1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6a`;
        const respText = `user doesn't exist`;
        const response = yield (0, supertest_1.default)(server.getServer()).get(`/api/users/${id}`);
        expect(response.status).toBe(404);
        expect(response.text).toBe(respText);
    }));
});
