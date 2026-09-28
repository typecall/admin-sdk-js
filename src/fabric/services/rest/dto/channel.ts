import { z } from "zod";

export const CallRecordingModeSchema = z.enum([
  "Off",
  "On",
  "OffForced",
  "OnForced",
]);

export const ChannelCallDistributionStrategySchema = z.enum([
  "All",
  "Ordered",
  "Random",
  "RandomSequence",
]);

export const ChannelCallDistributionStepSchema = z.object({
  user_ids: z.array(z.string()),
  ring_duration_ms: z.number().int().min(0),
});

export const ChannelIncomingCallDistributionSchema = z.object({
  strategy: ChannelCallDistributionStrategySchema,
  user_ids: z.array(z.string()),
  routing_tag_id: z.string().nullable().optional(),
  ring_duration_ms: z.number().int().min(0),
  reporting_tag_ids: z.array(z.string()),
  ordering: z.array(ChannelCallDistributionStepSchema),
});

export const ChannelDestinationPrefixSchema = z.object({
  name: z.string(),
  prefix: z.string(),
});

export const ChannelOutgoingCallMappingSchema = z.object({
  prefixes: z.array(ChannelDestinationPrefixSchema),
  channel_number_id: z.string(),
  is_enforced: z.boolean(),
});

export const ChannelAiAgentSchema = z.object({
  voice_id: z.string().nullable().optional(),
  is_active: z.boolean(),
  instructions: z.string().optional(),
  call_handle_rate: z.number().min(0).max(1).optional(),
  instructions_calls: z.string().nullable().optional(),
  instructions_messages: z.string().nullable().optional(),
});

export const ChannelUserAssignmentSchema = z.object({
  id: z.string(),
  role: z.string(),
});

export const CreateChannelRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  avatar_path: z.string().nullable().optional(),
  avatar_hash: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  record_incoming: CallRecordingModeSchema.optional(),
  record_outgoing: CallRecordingModeSchema.optional(),
  incoming_call_distribution: z
    .array(ChannelIncomingCallDistributionSchema)
    .optional(),
  outgoing_call_mappings: z.array(ChannelOutgoingCallMappingSchema).optional(),
  ai_agent: ChannelAiAgentSchema.nullable().optional(),
  users: z.array(ChannelUserAssignmentSchema).optional(),
});

export type CreateChannelRequest = z.infer<typeof CreateChannelRequestSchema>;

export const UpdateChannelRequestSchema = CreateChannelRequestSchema.partial();
export type UpdateChannelRequest = z.infer<typeof UpdateChannelRequestSchema>;

export type ChannelUserAssignment = z.infer<typeof ChannelUserAssignmentSchema>;
