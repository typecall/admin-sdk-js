import type { Subscription } from "../../../domains/workspace/subscription.js";
import { BaseResourceClient } from "./base.js";

export class SubscriptionsClient extends BaseResourceClient {
  private cachedSubscription: Subscription | null = null;

  async get(force = false): Promise<Subscription> {
    if (this.cachedSubscription && !force) {
      return this.cachedSubscription;
    }
    const sub = await this.transport.requestData<Subscription>("/subscription");
    this.cachedSubscription = sub;
    this.bump();
    return sub;
  }

  async load(force = false): Promise<Subscription> {
    return this.get(force);
  }

  current(): Subscription | null {
    return this.cachedSubscription;
  }

  override clearCache(): void {
    super.clearCache();
    this.cachedSubscription = null;
  }
}
