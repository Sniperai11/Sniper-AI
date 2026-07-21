import { IUser } from "../types/user";

export class User implements IUser {
  id?: string;
  name?: string;
  email: string;
  role: "Admin" | "Security Analyst" | "Viewer";
  joinedAt?: string;

  constructor(data: IUser) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.joinedAt = data.joinedAt;
  }
}
