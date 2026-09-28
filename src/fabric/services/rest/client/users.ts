import type { User } from "../../../domains/workspace/user.js";
import type { CreateUserRequest, UpdateUserRequest } from "../dto/user.js";
import { BaseResourceClient } from "./base.js";

export class UsersClient extends BaseResourceClient<User> {
  protected override extractSearchTerms(user: User): string {
    return `${user.first_name} ${user.last_name} ${user.display_name ?? ""} ${user.email} ${user.extension ?? ""}`.toLowerCase();
  }

  async listAll(force = false): Promise<User[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const users = await this.transport.requestData<User[]>("/users");
    this.setAll(users);
    return users;
  }

  async load(force = false): Promise<User[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<User> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const user = await this.transport.requestData<User>(`/users/${id}`);
    this.setItem(user);
    this.bump();
    return user;
  }

  async create(data: CreateUserRequest): Promise<User> {
    const user = await this.transport.requestData<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setItem(user);
    this.bump();
    return user;
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const user = await this.transport.requestData<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.setItem(user);
    this.bump();
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/users/${id}`, { method: "DELETE" });
    this.removeItem(id);
    this.bump();
  }
}
