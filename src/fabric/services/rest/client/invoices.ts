import type { Invoice } from "../../../domains/workspace/invoice.js";
import type { InvoicePaymentUrlResponse } from "../dto/invoice.js";
import { BaseResourceClient } from "./base.js";

export class InvoicesClient extends BaseResourceClient<Invoice> {
  protected override extractSearchTerms(item: Invoice): string {
    return `${item.number} ${item.status}`.toLowerCase();
  }

  async listAll(force = false): Promise<Invoice[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items = await this.transport.requestData<Invoice[]>("/invoices");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<Invoice[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<Invoice> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<Invoice>(`/invoices/${id}`);
    this.setItem(item);
    this.bump();
    return item;
  }

  getPaymentUrl(id: string): Promise<InvoicePaymentUrlResponse> {
    return this.transport.request<InvoicePaymentUrlResponse>(
      `/invoices/${id}/payment-url`,
    );
  }

  download(id: string): Promise<Blob> {
    return this.transport.requestBlob(`/invoices/${id}/download`);
  }
}
