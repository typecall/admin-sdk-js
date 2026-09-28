import type { Domain } from "../../../domains/workspace/domain.js";
import type {
  CreateDomainRequest,
  UpdateDomainRequest,
} from "../dto/domain.js";
import { BaseResourceClient } from "./base.js";

export class DomainsClient extends BaseResourceClient<Domain> {
  protected override extractSearchTerms(item: Domain): string {
    return item.domain.toLowerCase();
  }

  async listAll(force = false): Promise<Domain[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items = await this.transport.requestData<Domain[]>("/domains");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<Domain[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<Domain> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<Domain>(`/domains/${id}`);
    this.setItem(item);
    this.bump();
    return item;
  }

  async create(data: CreateDomainRequest): Promise<Domain> {
    const domain = await this.transport.requestData<Domain>("/domains", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setItem(domain);
    this.bump();
    return domain;
  }

  async update(id: string, data: UpdateDomainRequest): Promise<Domain> {
    const domain = await this.transport.requestData<Domain>(`/domains/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.setItem(domain);
    this.bump();
    return domain;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/domains/${id}`, { method: "DELETE" });
    this.removeItem(id);
    this.bump();
  }
}
