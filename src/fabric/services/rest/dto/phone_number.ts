import { z } from "zod";

export const FlowLayoutSchema = z.any();
export type FlowLayout = any;

export const UpdatePhoneNumberRequestSchema = z.object({
  incoming_call_flow_graph: z.record(z.string(), z.any()).optional(),
  incoming_call_flow_layout: FlowLayoutSchema.nullable().optional(),
});

export type UpdatePhoneNumberRequest = z.infer<
  typeof UpdatePhoneNumberRequestSchema
>;
