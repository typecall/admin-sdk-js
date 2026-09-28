import type { ChannelNumber } from "../../../domains/workspace/channel_number.js";
import type {
  CreateChannelNumberRequest,
  UpdateChannelNumberRequest,
} from "../dto/channel_number.js";
import { BaseResourceClient } from "./base.js";

export class ChannelNumbersClient extends BaseResourceClient {
  listAll(): Promise<ChannelNumber[]> {
    return this.transport.requestData<ChannelNumber[]>("/channel-numbers");
  }

  get(id: string): Promise<ChannelNumber> {
    return this.transport.requestData<ChannelNumber>(`/channel-numbers/${id}`);
  }

  async create(data: CreateChannelNumberRequest): Promise<ChannelNumber> {
    const channelNumber = await this.transport.requestData<ChannelNumber>(
      "/channel-numbers",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
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
    this.bump();
    return channelNumber;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/channel-numbers/${id}`, {
      method: "DELETE",
    });
    this.bump();
  }
}
