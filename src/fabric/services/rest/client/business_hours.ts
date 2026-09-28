import type { BusinessHours } from "../../../domains/workspace/business_hours.js";
import type {
  CreateBusinessHoursRequest,
  UpdateBusinessHoursRequest,
} from "../dto/business_hours.js";
import { BaseResourceClient } from "./base.js";

export class BusinessHoursClient extends BaseResourceClient<BusinessHours> {
  protected override extractSearchTerms(item: BusinessHours): string {
    return `${item.name} ${item.timezone}`.toLowerCase();
  }

  async listAll(force = false): Promise<BusinessHours[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items =
      await this.transport.requestData<BusinessHours[]>("/business-hours");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<BusinessHours[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<BusinessHours> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<BusinessHours>(
      `/business-hours/${id}`,
    );
    this.setItem(item);
    this.bump();
    return item;
  }

  async create(data: CreateBusinessHoursRequest): Promise<BusinessHours> {
    const item = await this.transport.requestData<BusinessHours>(
      "/business-hours",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    this.setItem(item);
    this.bump();
    return item;
  }

  async update(
    id: string,
    data: UpdateBusinessHoursRequest,
  ): Promise<BusinessHours> {
    const item = await this.transport.requestData<BusinessHours>(
      `/business-hours/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.setItem(item);
    this.bump();
    return item;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/business-hours/${id}`, {
      method: "DELETE",
    });
    this.removeItem(id);
    this.bump();
  }
}
