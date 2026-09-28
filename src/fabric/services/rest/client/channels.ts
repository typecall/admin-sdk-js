import type { Channel } from "../../../domains/workspace/channel.js";
import type {
  CreateChannelRequest,
  UpdateChannelRequest,
} from "../dto/channel.js";
import { BaseResourceClient } from "./base.js";

export class ChannelsClient extends BaseResourceClient {
  listAll(): Promise<Channel[]> {
    return this.transport.requestData<Channel[]>("/channels");
  }

  get(id: string): Promise<Channel> {
    return this.transport.requestData<Channel>(`/channels/${id}`);
  }

  async create(data: CreateChannelRequest): Promise<Channel> {
    const channel = await this.transport.requestData<Channel>("/channels", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.bump();
    return channel;
  }

  async update(id: string, data: UpdateChannelRequest): Promise<Channel> {
    const channel = await this.transport.requestData<Channel>(
      `/channels/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.bump();
    return channel;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/channels/${id}`, {
      method: "DELETE",
    });
    this.bump();
  }
}
