import type { PhoneNumber } from "../../../domains/workspace/phone_number.js";
import type { UpdatePhoneNumberRequest } from "../dto/phone_number.js";
import { BaseResourceClient } from "./base.js";

export class PhoneNumbersClient extends BaseResourceClient {
  listAll(): Promise<PhoneNumber[]> {
    return this.transport.requestData<PhoneNumber[]>("/phone-numbers");
  }

  get(id: string): Promise<PhoneNumber> {
    return this.transport.requestData<PhoneNumber>(`/phone-numbers/${id}`);
  }

  async update(
    id: string,
    data: UpdatePhoneNumberRequest,
  ): Promise<PhoneNumber> {
    const phoneNumber = await this.transport.requestData<PhoneNumber>(
      `/phone-numbers/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.bump();
    return phoneNumber;
  }
}
