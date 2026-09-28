export type EntityType =
  | "All"
  | "Account"
  | "AccountDevice"
  | "AccountUser"
  | "AnalyticsCall"
  | "AnalyticsCharge"
  | "AnalyticsUtterance"
  | "PhoneEndpoint"
  | "Workspace"
  | "WorkspaceBusinessHours"
  | "WorkspaceChannel"
  | "WorkspaceChannelNumber"
  | "WorkspaceChannelUser"
  | "WorkspaceChat"
  | "WorkspaceChatUser"
  | "WorkspaceCommunication"
  | "WorkspaceCompany"
  | "WorkspaceContact"
  | "WorkspaceContactChannel"
  | "WorkspaceContactCompany"
  | "WorkspaceDomain"
  | "WorkspaceFile"
  | "WorkspaceIntegration"
  | "WorkspaceIntegrationChannel"
  | "WorkspaceInvoice"
  | "WorkspacePaymentMethod"
  | "WorkspacePhone"
  | "WorkspacePhoneNumber"
  | "WorkspacePrompt"
  | "WorkspaceSipTrunk"
  | "WorkspaceSubscription"
  | "WorkspaceTag"
  | "WorkspaceUser"
  | "WorkspaceVoice";

export interface EntityDeleted {
  id: string;
  entity_type: EntityType;
  workspace_id?: string | null;
  account_id?: string | null;
}
