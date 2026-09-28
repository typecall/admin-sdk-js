import type { Tag } from "../../../domains/workspace/tag.js";
import type { CreateTagRequest, UpdateTagRequest } from "../dto/tag.js";
import { BaseResourceClient } from "./base.js";

export class TagsClient extends BaseResourceClient {
  listAll(): Promise<Tag[]> {
    return this.transport.requestData<Tag[]>("/tags");
  }

  get(id: string): Promise<Tag> {
    return this.transport.requestData<Tag>(`/tags/${id}`);
  }

  async create(data: CreateTagRequest): Promise<Tag> {
    const tag = await this.transport.requestData<Tag>("/tags", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.bump();
    return tag;
  }

  async update(id: string, data: UpdateTagRequest): Promise<Tag> {
    const tag = await this.transport.requestData<Tag>(`/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.bump();
    return tag;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/tags/${id}`, { method: "DELETE" });
    this.bump();
  }
}
