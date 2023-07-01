import { v4 as uuidv4, validate } from "uuid";
// import * as uuid from "uuid";

type User = { id: string; usename: string; age: number; hobbies: string[] };

export class UserService {
  public users: User[] = [
    { id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", usename: "Alex", age: 48, hobbies: ["dev", "travel"] },
    { id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", usename: "Yan", age: 1, hobbies: [] },
  ];
  getAllUsers() {
    return this.users;
  }

  getUserById(id: string) {
    const user = this.users.find((el) => el.id === id);
    return user;
  }

  createUser(userDto) {
    const newUser = { id: uuidv4(), ...userDto };
    this.users.push(newUser);
    return newUser;
  }
  validateUserDto(userdto) {
    const { username, age, hobbies } = userdto;

    const validateErrors: string[] = [];
    if (!username || username.length === 0 || typeof username !== "string") {
      validateErrors.push("username in requered as not empty string");
    }
    if (!age || age <= 0 || typeof age !== "number") {
      validateErrors.push("age in requered as positive number");
    }
    if (!hobbies || !Array.isArray(hobbies)) {
      validateErrors.push("hobbies in requered as array");
    }
    return validateErrors;
  }
  // helpers
  validateId(id: string) {
    const checkedId = validate(id) ? id : "invalid";
    return checkedId;
  }
  parseToJson(body: any[]) {
    const bufferToString = Buffer.concat(body).toString("utf-8");
    const parsedJson = JSON.parse(bufferToString);
    return parsedJson;
  }
}
