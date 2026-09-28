import type { Phone } from "../../../domains/workspace/phone.js";
import type {
  CreatePhoneRequest,
  UpdatePhoneRequest,
  PhoneConfigResponse,
} from "../dto/phone.js";
import { BaseResourceClient } from "./base.js";

export class PhonesClient extends BaseResourceClient<Phone> {
  protected override extractSearchTerms(item: Phone): string {
    const rawMac = item.mac_address || "";
    const cleanMac = rawMac.replace(/[:-]/g, "");
    return `${item.name} ${item.model} ${item.serial_number || ""} ${rawMac} ${cleanMac} ${item.location}`.toLowerCase();
  }

  async listAll(force = false): Promise<Phone[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items = await this.transport.requestData<Phone[]>("/phones");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<Phone[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<Phone> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<Phone>(`/phones/${id}`);
    this.setItem(item);
    this.bump();
    return item;
  }

  getConfig(id: string): Promise<PhoneConfigResponse> {
    return this.transport.request<PhoneConfigResponse>(`/phones/${id}/config`);
  }

  async create(data: CreatePhoneRequest): Promise<Phone> {
    const item = await this.transport.requestData<Phone>("/phones", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setItem(item);
    this.bump();
    return item;
  }

  async update(id: string, data: UpdatePhoneRequest): Promise<Phone> {
    const item = await this.transport.requestData<Phone>(`/phones/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    this.setItem(item);
    this.bump();
    return item;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/phones/${id}`, { method: "DELETE" });
    this.removeItem(id);
    this.bump();
  }
}
