import type { Prompt } from "../../../domains/workspace/prompt.js";
import type {
  CreatePromptRequest,
  UpdatePromptRequest,
} from "../dto/prompt.js";
import { BaseResourceClient } from "./base.js";

export class PromptsClient extends BaseResourceClient {
  listAll(): Promise<Prompt[]> {
    return this.transport.requestData<Prompt[]>("/prompts");
  }

  listAllMy(): Promise<Prompt[]> {
    return this.transport.requestData<Prompt[]>("/prompts/my");
  }

  get(id: string): Promise<Prompt> {
    return this.transport.requestData<Prompt>(`/prompts/${id}`);
  }

  async create(data: CreatePromptRequest): Promise<Prompt> {
    const prompt = await this.transport.requestData<Prompt>("/prompts", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.bump();
    return prompt;
  }

  async update(id: string, data: UpdatePromptRequest): Promise<Prompt> {
    const prompt = await this.transport.requestData<Prompt>(`/prompts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.bump();
    return prompt;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/prompts/${id}`, { method: "DELETE" });
    this.bump();
  }
}
