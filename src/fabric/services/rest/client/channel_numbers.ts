import type { ChannelNumber } from "../../../domains/workspace/channel_number.js";
import type {
  CreateChannelNumberRequest,
  UpdateChannelNumberRequest,
} from "../dto/channel_number.js";
import { BaseResourceClient } from "./base.js";

export class ChannelNumbersClient extends BaseResourceClient<ChannelNumber> {
  protected override extractSearchTerms(item: ChannelNumber): string {
    const rawCid = item.cid || "";
    const cleanCid = rawCid.replace(/^\+/, "");
    return `${item.name || ""} ${rawCid} ${cleanCid} ${item.label || ""} ${item.country || ""}`.toLowerCase();
  }

  async listAll(force = false): Promise<ChannelNumber[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items =
      await this.transport.requestData<ChannelNumber[]>("/channel-numbers");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<ChannelNumber[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<ChannelNumber> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<ChannelNumber>(
      `/channel-numbers/${id}`,
    );
    this.setItem(item);
    this.bump();
    return item;
  }

  async create(data: CreateChannelNumberRequest): Promise<ChannelNumber> {
    const channelNumber = await this.transport.requestData<ChannelNumber>(
      "/channel-numbers",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    this.setItem(channelNumber);
    this.bump();
    return channelNumber;
  }

  async update(
    id: string,
    data: UpdateChannelNumberRequest,
  ): Promise<ChannelNumber> {
    const channelNumber = await this.transport.requestData<ChannelNumber>(
      `/channel-numbers/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.setItem(channelNumber);
    this.bump();
    return channelNumber;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/channel-numbers/${id}`, {
      method: "DELETE",
    });
    this.removeItem(id);
    this.bump();
  }
}
