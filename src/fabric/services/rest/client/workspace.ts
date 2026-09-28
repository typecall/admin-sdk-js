import type {
  WorkspaceBillingProfile,
  UpdateWorkspaceRequest,
} from "../dto/workspace.js";
import { BaseResourceClient } from "./base.js";

export class WorkspaceClient extends BaseResourceClient {
  private cachedProfile: WorkspaceBillingProfile | null = null;

  async get(force = false): Promise<WorkspaceBillingProfile> {
    if (this.cachedProfile && !force) {
      return this.cachedProfile;
    }
    const profile =
      await this.transport.requestData<WorkspaceBillingProfile>("/workspace");
    this.cachedProfile = profile;
    this.bump();
    return profile;
  }

  async load(force = false): Promise<WorkspaceBillingProfile> {
    return this.get(force);
  }

  current(): WorkspaceBillingProfile | null {
    return this.cachedProfile;
  }

  async update(data: UpdateWorkspaceRequest): Promise<WorkspaceBillingProfile> {
    const profile = await this.transport.requestData<WorkspaceBillingProfile>(
      "/workspace",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.cachedProfile = profile;
    this.bump();
    return profile;
  }

  override clearCache(): void {
    super.clearCache();
    this.cachedProfile = null;
  }
}
