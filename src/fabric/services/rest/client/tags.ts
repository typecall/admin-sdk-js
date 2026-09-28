import type { Tag } from "../../../domains/workspace/tag.js";
import type { CreateTagRequest, UpdateTagRequest } from "../dto/tag.js";
import { BaseResourceClient } from "./base.js";

export class TagsClient extends BaseResourceClient<Tag> {
  protected override extractSearchTerms(item: Tag): string {
    return `${item.name} ${item.color} ${item.scopes.join(" ")}`.toLowerCase();
  }

  async listAll(force = false): Promise<Tag[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items = await this.transport.requestData<Tag[]>("/tags");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<Tag[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<Tag> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<Tag>(`/tags/${id}`);
    this.setItem(item);
    this.bump();
    return item;
  }

  async create(data: CreateTagRequest): Promise<Tag> {
    const tag = await this.transport.requestData<Tag>("/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setItem(tag);
    this.bump();
    return tag;
  }

  async update(id: string, data: UpdateTagRequest): Promise<Tag> {
    const tag = await this.transport.requestData<Tag>(`/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.setItem(tag);
    this.bump();
    return tag;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/tags/${id}`, { method: "DELETE" });
    this.removeItem(id);
    this.bump();
  }
}
