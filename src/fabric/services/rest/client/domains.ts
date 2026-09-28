import type { Domain } from "../../../domains/workspace/domain.js";
import type {
  CreateDomainRequest,
  UpdateDomainRequest,
} from "../dto/domain.js";
import { BaseResourceClient } from "./base.js";

export class DomainsClient extends BaseResourceClient {
  listAll(): Promise<Domain[]> {
    return this.transport.requestData<Domain[]>("/domains");
  }

  get(id: string): Promise<Domain> {
    return this.transport.requestData<Domain>(`/domains/${id}`);
  }

  async create(data: CreateDomainRequest): Promise<Domain> {
    const domain = await this.transport.requestData<Domain>("/domains", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.bump();
    return domain;
  }

  async update(id: string, data: UpdateDomainRequest): Promise<Domain> {
    const domain = await this.transport.requestData<Domain>(`/domains/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.bump();
    return domain;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/domains/${id}`, { method: "DELETE" });
    this.bump();
  }
}
