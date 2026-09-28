import type { Subscription } from "../../../domains/workspace/subscription.js";
import { BaseResourceClient } from "./base.js";

export class SubscriptionsClient extends BaseResourceClient {
  get(): Promise<Subscription> {
    return this.transport.requestData<Subscription>("/subscription");
  }
}
