import type { UserRole, UserAvailability } from "../../common/user.js";
import type { UserRedirectAction } from "../../domains/workspace/user.js";
import type {
  CallRecordingMode,
  ChannelIncomingCallDistribution,
  ChannelOutgoingCallMapping,
  ChannelAiAgent,
} from "../../domains/workspace/channel.js";
import type { PhoneModel } from "../../domains/workspace/phone.js";
import type { FlowNode } from "../../domains/workspace/phone-number.js";
import type {
  BusinessHoursScheduleDay,
  BusinessHoursHoliday,
  BusinessHoursException,
} from "../../domains/workspace/business-hours.js";
import type { TagScope } from "../../domains/workspace/tag.js";
import type { UpdateWorkspaceAddress } from "../../domains/workspace/workspace.js";
import type {
  PromptScope,
  PromptTrack,
} from "../../domains/workspace/prompt.js";

// Envelopes
export interface ApiResponse<T> {
  data: T;
}

export interface ApiCollectionResponse<T> {
  data: T[];
}

// User DTOs
export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: UserRole;
  extension?: string | null;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  availability?: UserAvailability;
  ring_duration_ms?: number;
  redirect_action?: UserRedirectAction;
  redirect_handle?: string | null;
  default_channel_number_id?: string | null;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  extension?: string | null;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  availability?: UserAvailability;
  ring_duration_ms?: number;
  redirect_action?: UserRedirectAction;
  redirect_handle?: string | null;
  default_channel_number_id?: string | null;
}

// Channel DTOs
export interface ChannelUserAssignment {
  id: string;
  role: string;
}

export interface CreateChannelRequest {
  name: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  icon?: string | null;
  record_incoming?: CallRecordingMode;
  record_outgoing?: CallRecordingMode;
  incoming_call_distribution?: ChannelIncomingCallDistribution[];
  outgoing_call_mappings?: ChannelOutgoingCallMapping[];
  ai_agent?: ChannelAiAgent | null;
  users?: ChannelUserAssignment[];
}

export interface UpdateChannelRequest {
  name?: string;
  avatar_path?: string | null;
  avatar_hash?: string | null;
  icon?: string | null;
  record_incoming?: CallRecordingMode;
  record_outgoing?: CallRecordingMode;
  incoming_call_distribution?: ChannelIncomingCallDistribution[];
  outgoing_call_mappings?: ChannelOutgoingCallMapping[];
  ai_agent?: ChannelAiAgent | null;
  users?: ChannelUserAssignment[];
}

// Channel Number DTOs
export interface CreateChannelNumberRequest {
  phone_number_id: string;
  channel_id: string;
  cid: string;
  priority: number;
  is_exclusive?: boolean;
  label?: string | null;
  user_id?: string | null;
}

export interface UpdateChannelNumberRequest {
  channel_id?: string;
  cid?: string;
  priority?: number;
  is_exclusive?: boolean;
  label?: string | null;
  user_id?: string | null;
}

// Phone DTOs
export interface PhoneLineAssignment {
  line_number: number;
  user_id: string;
  password?: string;
}

export interface CreatePhoneRequest {
  name: string;
  model: PhoneModel;
  location: string;
  is_cloud_managed: boolean;
  serial_number?: string | null;
  mac_address?: string | null;
  lines?: PhoneLineAssignment[];
}

export interface UpdatePhoneRequest {
  name?: string;
  model?: PhoneModel;
  location?: string;
  is_cloud_managed?: boolean;
  serial_number?: string | null;
  mac_address?: string | null;
  lines?: PhoneLineAssignment[];
}

export interface PhoneConfigResponse {
  config: string;
}

// Phone Number DTOs
export interface UpdatePhoneNumberRequest {
  incoming_call_flow_graph?: Record<string, FlowNode>;
  incoming_call_flow_layout?: Uint8Array | null;
}

// Business Hours DTOs
export interface CreateBusinessHoursRequest {
  name: string;
  timezone: string;
  is_scoped_by_period: boolean;
  from_month?: number | null;
  from_day?: number | null;
  to_month?: number | null;
  to_day?: number | null;
  schedule?: Record<number, BusinessHoursScheduleDay>;
  holidays?: BusinessHoursHoliday[];
  exceptions?: BusinessHoursException[];
}

export interface UpdateBusinessHoursRequest {
  name?: string;
  timezone?: string;
  is_scoped_by_period?: boolean;
  from_month?: number | null;
  from_day?: number | null;
  to_month?: number | null;
  to_day?: number | null;
  schedule?: Record<number, BusinessHoursScheduleDay>;
  holidays?: BusinessHoursHoliday[];
  exceptions?: BusinessHoursException[];
}

// Tag DTOs
export interface CreateTagRequest {
  name: string;
  color: string;
  scopes: TagScope[];
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
  scopes?: TagScope[];
}

// Domain DTOs
export interface CreateDomainRequest {
  domain: string;
}

export interface UpdateDomainRequest {
  domain: string;
}

// Workspace DTOs
export interface UpdateWorkspaceRequest {
  name?: string;
  contact_name?: string;
  contact_surname?: string;
  contact_email?: string;
  address?: UpdateWorkspaceAddress;
}

// Prompt DTOs
export interface CreatePromptRequest {
  name: string;
  scope: PromptScope;
  entity_id: string;
  default_track_id: string;
  tracks: Record<string, PromptTrack>;
}

export interface UpdatePromptRequest {
  name?: string;
  default_track_id?: string;
  tracks?: Record<string, PromptTrack>;
}

// File DTOs
export interface FileDownloadLink {
  url: string;
}

export interface FileUploadLink {
  url: string;
  path: string;
}

// Billing DTOs
export interface InvoicePaymentUrlResponse {
  payment_url: string;
}

export interface CreatePaymentMethodUrlResponse {
  url: string;
}

// Analytics DTOs
export interface PaginateCallLogsParams {
  from?: string;
  to?: string;
  status?: string[];
  category?: string[];
  page?: number;
  per_page?: number;
}
