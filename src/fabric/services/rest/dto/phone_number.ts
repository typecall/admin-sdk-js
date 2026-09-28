import type { FlowNode } from "../../../domains/workspace/phone_number.js";

export interface UpdatePhoneNumberRequest {
  incoming_call_flow_graph?: Record<string, FlowNode>;
  incoming_call_flow_layout?: Uint8Array | null;
}
