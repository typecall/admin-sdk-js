import type { PaymentMethod } from "../../../domains/workspace/payment_method.js";
import type { CreatePaymentMethodUrlResponse } from "../dto/payment_method.js";
import { BaseResourceClient } from "./base.js";

export class PaymentMethodsClient extends BaseResourceClient {
  listAll(): Promise<PaymentMethod[]> {
    return this.transport.requestData<PaymentMethod[]>("/payment-methods");
  }

  createUrl(): Promise<CreatePaymentMethodUrlResponse> {
    return this.transport.request<CreatePaymentMethodUrlResponse>(
      "/payment-methods/create-url",
    );
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/payment-methods/${id}`, {
      method: "DELETE",
    });
    this.bump();
  }

  async setAsPrimary(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.transport.requestData<PaymentMethod>(
      `/payment-methods/${id}/set-as-primary`,
      { method: "POST" },
    );
    this.bump();
    return paymentMethod;
  }
}
