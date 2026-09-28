import type { Invoice } from "../../../domains/workspace/invoice.js";
import type { InvoicePaymentUrlResponse } from "../dto/invoice.js";
import { BaseResourceClient } from "./base.js";

export class InvoicesClient extends BaseResourceClient {
  listAll(): Promise<Invoice[]> {
    return this.transport.requestData<Invoice[]>("/invoices");
  }

  getPaymentUrl(id: string): Promise<InvoicePaymentUrlResponse> {
    return this.transport.request<InvoicePaymentUrlResponse>(
      `/invoices/${id}/payment-url`,
    );
  }
}
