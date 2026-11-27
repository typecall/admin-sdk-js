import type { Agent } from "../../../domains/workspace/agent.js";
import type {
  CreateAgentRequest,
  UpdateAgentRequest,
} from "../dto/agent.js";
import { BaseResourceClient } from "./base.js";

export class AgentsClient extends BaseResourceClient<Agent> {
  protected override extractSearchTerms(agent: Agent): string {
    return `${agent.name} ${agent.role}`.toLowerCase();
  }

  async listAll(force = false): Promise<Agent[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const agents = await this.transport.requestData<Agent[]>("/agents");
    this.setAll(agents);
    return agents;
  }

  async load(force = false): Promise<Agent[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<Agent> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const agent = await this.transport.requestData<Agent>(`/agents/${id}`);
    this.setItem(agent);
    this.bump();
    return agent;
  }

  async create(data: CreateAgentRequest): Promise<Agent> {
    const agent = await this.transport.requestData<Agent>("/agents", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setItem(agent);
    this.bump();
    return agent;
  }

  async update(id: string, data: UpdateAgentRequest): Promise<Agent> {
    const agent = await this.transport.requestData<Agent>(`/agents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.setItem(agent);
    this.bump();
    return agent;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/agents/${id}`, {
      method: "DELETE",
    });
    this.removeItem(id);
    this.bump();
  }

  active(): Agent[] {
    return this.all().filter((a) => a.is_active);
  }
}
