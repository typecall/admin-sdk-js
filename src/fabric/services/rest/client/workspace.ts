import type {
  WorkspaceBillingProfile,
  UpdateWorkspaceRequest,
} from "../dto/workspace.js";
import { BaseResourceClient } from "./base.js";

export class WorkspaceClient extends BaseResourceClient {
  get(): Promise<WorkspaceBillingProfile> {
    return this.transport.requestData<WorkspaceBillingProfile>("/workspace");
  }

  async update(data: UpdateWorkspaceRequest): Promise<WorkspaceBillingProfile> {
    const profile = await this.transport.requestData<WorkspaceBillingProfile>(
      "/workspace",
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    this.bump();
    return profile;
  }
}
