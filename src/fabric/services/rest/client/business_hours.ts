import type { BusinessHours } from "../../../domains/workspace/business_hours.js";
import type {
  CreateBusinessHoursRequest,
  UpdateBusinessHoursRequest,
} from "../dto/business_hours.js";
import { BaseResourceClient } from "./base.js";

export class BusinessHoursClient extends BaseResourceClient {
  listAll(): Promise<BusinessHours[]> {
    return this.transport.requestData<BusinessHours[]>("/business-hours");
  }

  get(id: string): Promise<BusinessHours> {
    return this.transport.requestData<BusinessHours>(`/business-hours/${id}`);
  }

  async create(data: CreateBusinessHoursRequest): Promise<BusinessHours> {
    const businessHours = await this.transport.requestData<BusinessHours>(
      "/business-hours",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    this.bump();
    return businessHours;
  }

  async update(
    id: string,
    data: UpdateBusinessHoursRequest,
  ): Promise<BusinessHours> {
    const businessHours = await this.transport.requestData<BusinessHours>(
      `/business-hours/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.bump();
    return businessHours;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/business-hours/${id}`, {
      method: "DELETE",
    });
    this.bump();
  }
}
