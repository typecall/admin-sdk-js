import type { Phone } from "../../../domains/workspace/phone.js";
import type {
  CreatePhoneRequest,
  UpdatePhoneRequest,
  PhoneConfigResponse,
} from "../dto/phone.js";
import { BaseResourceClient } from "./base.js";

export class PhonesClient extends BaseResourceClient {
  listAll(): Promise<Phone[]> {
    return this.transport.requestData<Phone[]>("/phones");
  }

  get(id: string): Promise<Phone> {
    return this.transport.requestData<Phone>(`/phones/${id}`);
  }

  getConfig(id: string): Promise<PhoneConfigResponse> {
    return this.transport.request<PhoneConfigResponse>(`/phones/${id}/config`);
  }

  async create(data: CreatePhoneRequest): Promise<Phone> {
    const phone = await this.transport.requestData<Phone>("/phones", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.bump();
    return phone;
  }

  async update(id: string, data: UpdatePhoneRequest): Promise<Phone> {
    const phone = await this.transport.requestData<Phone>(`/phones/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.bump();
    return phone;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/phones/${id}`, { method: "DELETE" });
    this.bump();
  }
}
