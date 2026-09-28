import type { Prompt } from "../../../domains/workspace/prompt.js";
import type {
  CreatePromptRequest,
  UpdatePromptRequest,
} from "../dto/prompt.js";
import { BaseResourceClient } from "./base.js";

export class PromptsClient extends BaseResourceClient<Prompt> {
  protected override extractSearchTerms(item: Prompt): string {
    return `${item.name} ${item.entity_id}`.toLowerCase();
  }

  async listAll(force = false): Promise<Prompt[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items = await this.transport.requestData<Prompt[]>("/prompts");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<Prompt[]> {
    return this.listAll(force);
  }

  listAllMy(): Promise<Prompt[]> {
    return this.transport.requestData<Prompt[]>("/prompts/my");
  }

  async get(id: string, force = false): Promise<Prompt> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<Prompt>(`/prompts/${id}`);
    this.setItem(item);
    this.bump();
    return item;
  }

  async create(data: CreatePromptRequest): Promise<Prompt> {
    const prompt = await this.transport.requestData<Prompt>("/prompts", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setItem(prompt);
    this.bump();
    return prompt;
  }

  async update(id: string, data: UpdatePromptRequest): Promise<Prompt> {
    const prompt = await this.transport.requestData<Prompt>(`/prompts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.setItem(prompt);
    this.bump();
    return prompt;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/prompts/${id}`, { method: "DELETE" });
    this.removeItem(id);
    this.bump();
  }
}
