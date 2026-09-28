import type { Country } from "../../common/country.js";
import type { EntityDeleted } from "../../common/entity.js";
import type { LanguageCode } from "../../common/language.js";
import type { Money } from "../../common/money.js";

export type PhoneNumberCapability = "Voice" | "Sms" | "Mms";

export type NumberMappingType = "Channel" | "User" | "Extension" | "Continue";

export type NumberMappingData =
  | { Channel: { user_id?: string | null; channel_id: string } }
  | { Extension: { extension_start: string; extension_end: string } }
  | { User: { user_id: string } };

export interface NumberMapping {
  cid_start: string;
  cid_end?: string | null;
  mapping_type: NumberMappingType;
  data?: NumberMappingData | null;
}

export interface AssignedNumberGroup {
  label: string;
  mappings: NumberMapping[];
  language_code?: LanguageCode | null;
  routing_tag_id?: string | null;
}

export interface DigitOption {
  name: string;
  number: string;
  next?: string | null;
}

export interface RoutingTagCase {
  routing_tag_id: string;
  next?: string | null;
}

export type MatchStrategy = "All" | "Any";

export type ConditionField = "From" | "To";

export type ConditionOperator = "Equal" | "NotEqual" | "Regex" | "NotRegex";

export interface Condition {
  field: ConditionField;
  operator: ConditionOperator;
  value: string;
}

export interface ConditionCase {
  id: string;
  next?: string | null;
  label?: string | null;
  strategy: MatchStrategy;
  conditions: Condition[];
  language_code?: LanguageCode | null;
  routing_tag_id?: string | null;
}

export type CallbackEntityType = "Channel" | "User";

export type FlowNode =
  | { CallStart: { id: string; next?: string | null } }
  | {
      ConnectToChannel: {
        id: string;
        next?: string | null;
        channel_id: string;
        connect_to_specific_user: boolean;
        user_id?: string | null;
      };
    }
  | {
      ConnectToUser: {
        id: string;
        next?: string | null;
        user_id: string;
        ring_duration_ms?: number | null;
        override_ring_duration: boolean;
      };
    }
  | { PlayPrompt: { id: string; next?: string | null; prompt_id: string } }
  | {
      RequestInput: {
        id: string;
        digits: DigitOption[];
        timeout_ms: number;
        max_iterations: number;
        options_prompt_id: string;
        invalid_prompt_id: string;
        timeout_prompt_id?: string | null;
        treat_timeout_as_invalid: boolean;
        max_iterations_prompt_id?: string | null;
        next_timeout?: string | null;
        next_max_iterations?: string | null;
      };
    }
  | {
      CheckBusinessHours: {
        id: string;
        business_hours_id: string;
        next_open?: string | null;
        next_closed?: string | null;
        next?: string | null;
      };
    }
  | {
      ConnectToAssignedNumbers: {
        id: string;
        next?: string | null;
        groups: AssignedNumberGroup[];
      };
    }
  | {
      MatchRoutingTag: {
        id: string;
        next?: string | null;
        cases: RoutingTagCase[];
      };
    }
  | {
      MatchCondition: {
        id: string;
        next?: string | null;
        cases: ConditionCase[];
      };
    }
  | {
      SetReportingTags: {
        id: string;
        next?: string | null;
        replace_existing: boolean;
        reporting_tag_ids: string[];
      };
    }
  | {
      JumpTo: {
        id: string;
        next?: string | null;
        target_node_id: string;
        max_iterations: number;
      };
    }
  | {
      RequestCallback: {
        id: string;
        entity_id: string;
        prompt_id: string;
        entity_type: CallbackEntityType;
      };
    };

export interface PhoneNumber {
  id: string;
  workspace_id: string;
  name: string;
  country: Country;
  range_start: string;
  range_end: string;
  channels?: number | null;
  incoming_rate?: Money | null;
  capabilities: PhoneNumberCapability[];
  sip_trunk_id: string;
  range_exclusions: string[];
  incoming_call_flow_graph: Record<string, FlowNode>;
  incoming_call_flow_layout?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type PhoneNumberEventType = "Upserted" | "Deleted";

export type PhoneNumberEvent =
  | { event_type: "Upserted"; payload: PhoneNumber }
  | { event_type: "Deleted"; payload: EntityDeleted };
