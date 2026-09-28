import type { Voice } from "../../../domains/workspace/voice.js";
import { BaseResourceClient } from "./base.js";

export class VoicesClient extends BaseResourceClient<Voice> {
  protected override extractSearchTerms(item: Voice): string {
    return `${item.name} ${item.language_code} ${item.gender} ${item.provider}`.toLowerCase();
  }

  async listAll(force = false): Promise<Voice[]> {
    if (this.isLoaded && !force) {
      return this.all();
    }
    const items = await this.transport.requestData<Voice[]>("/voices");
    this.setAll(items);
    return items;
  }

  async load(force = false): Promise<Voice[]> {
    return this.listAll(force);
  }

  async get(id: string, force = false): Promise<Voice> {
    if (!force) {
      const cached = this.find(id);
      if (cached) return cached;
    }
    const item = await this.transport.requestData<Voice>(`/voices/${id}`);
    this.setItem(item);
    this.bump();
    return item;
  }

  voiceAgents(): Voice[] {
    return this.all().filter(
      (v) => v.scope.toLowerCase().replace(/[-_]/g, "") === "voiceagent",
    );
  }

  synthesize(id: string, ssml: string): Promise<Blob> {
    return this.transport.requestBlob(`/voices/${id}/tts/synthesize`, {
      method: "POST",
      body: JSON.stringify({ ssml }),
    });
  }
}
