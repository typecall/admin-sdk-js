import type { Channel } from "../../../domains/workspace/channel.js";
import type {
  CreateChannelRequest,
  UpdateChannelRequest,
} from "../dto/channel.js";
import { BaseResourceClient } from "./base.js";

export class ChannelsClient extends BaseResourceClient<Channel> {
  protected override extractSearchTerms(channel: Channel): string {
    return `${channel.name}`.toLowerCase();
  }

  async listAll(force = false): Promise<Channel[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const channels = await this.transport.requestData<Channel[]>("/channels");
    this.setAll(channels);
    return channels;
  }

  async load(force = false): Promise<Channel[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<Channel> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const channel = await this.transport.requestData<Channel>(
      `/channels/${id}`,
    );
    this.setItem(channel);
    this.bump();
    return channel;
  }

  async create(data: CreateChannelRequest): Promise<Channel> {
    const channel = await this.transport.requestData<Channel>("/channels", {
      method: "POST",
      body: JSON.stringify(data),
    });
    this.setItem(channel);
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
    this.setItem(channel);
    this.bump();
    return channel;
  }

  async delete(id: string): Promise<void> {
    await this.transport.request<void>(`/channels/${id}`, {
      method: "DELETE",
    });
    this.removeItem(id);
    this.bump();
  }

  publicChannels(): Channel[] {
    return this.all().filter((c) => !c.is_private);
  }
}
