import { v4 as uuidv4 } from "uuid";

type User = { id: string; usename: string; age: number; hobbies: string[] };

export class UserService {
  users: User[] = [
    { id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", usename: "Alex", age: 48, hobbies: ["dev", "travel"] },
    { id: "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed", usename: "Yan", age: 1, hobbies: [] },
  ];
  getAllUsers() {
    return this.users;
  }
}
