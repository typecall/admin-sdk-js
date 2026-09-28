export interface FlowNode {
   id: string;
   type: string;
   data: Record<string, any>;
   position?: { x: number; y: number };
}

export interface PhoneNumber {
   id: string;
   workspace_id: string;
   number: string;
   incoming_call_flow_graph?: Record<string, FlowNode>;
   incoming_call_flow_layout?: Uint8Array | null;
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
