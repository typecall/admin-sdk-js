import type { PaymentMethod } from "../../../domains/workspace/payment_method.js";
import type { CreatePaymentMethodUrlResponse } from "../dto/payment_method.js";
import { BaseResourceClient } from "./base.js";

export class PaymentMethodsClient extends BaseResourceClient<PaymentMethod> {
  protected override extractSearchTerms(item: PaymentMethod): string {
    return (item.last_four || item.last_four_digits || "").toLowerCase();
  }

  async listAll(force = false): Promise<PaymentMethod[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items =
      await this.transport.requestData<PaymentMethod[]>("/payment-methods");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<PaymentMethod[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<PaymentMethod> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<PaymentMethod>(
      `/payment-methods/${id}`,
    );
    this.setItem(item);
    this.bump();
    return item;
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
    this.removeItem(id);
    this.bump();
  }

  async setAsPrimary(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.transport.requestData<PaymentMethod>(
      `/payment-methods/${id}/set-as-primary`,
      { method: "POST" },
    );
    for (const item of this.items.values()) {
      item.is_primary = item.id === id;
    }
    this.setItem(paymentMethod);
    this.bump();
    return paymentMethod;
  }
}
