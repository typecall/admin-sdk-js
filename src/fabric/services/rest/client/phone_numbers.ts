import type { PhoneNumber } from "../../../domains/workspace/phone_number.js";
import type { UpdatePhoneNumberRequest } from "../dto/phone_number.js";
import { BaseResourceClient } from "./base.js";

export class PhoneNumbersClient extends BaseResourceClient<PhoneNumber> {
  protected override extractSearchTerms(item: PhoneNumber): string {
    const rawStart = item.range_start || "";
    const rawEnd = item.range_end || "";
    const cleanStart = rawStart.replace(/^\+/, "");
    const cleanEnd = rawEnd.replace(/^\+/, "");
    return `${item.name} ${rawStart} ${cleanStart} ${rawEnd} ${cleanEnd} ${item.country}`.toLowerCase();
  }

  async listAll(force = false): Promise<PhoneNumber[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items =
      await this.transport.requestData<PhoneNumber[]>("/phone-numbers");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<PhoneNumber[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<PhoneNumber> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<PhoneNumber>(
      `/phone-numbers/${id}`,
    );
    this.setItem(item);
    this.bump();
    return item;
  }

  async update(
    id: string,
    data: UpdatePhoneNumberRequest,
  ): Promise<PhoneNumber> {
    const item = await this.transport.requestData<PhoneNumber>(
      `/phone-numbers/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.setItem(item);
    this.bump();
    return item;
  }
}
