import type { Voice } from "../../../domains/workspace/voice.js";
import { BaseResourceClient } from "./base.js";

export class VoicesClient extends BaseResourceClient {
  listAll(): Promise<Voice[]> {
    return this.transport.requestData<Voice[]>("/voices");
  }

  get(id: string): Promise<Voice> {
    return this.transport.requestData<Voice>(`/voices/${id}`);
  }

  synthesize(id: string, ssml: string): Promise<Blob> {
    return this.transport.requestBlob(`/voices/${id}/tts/synthesize`, {
      method: "POST",
      body: JSON.stringify({ ssml }),
    });
  }
}
