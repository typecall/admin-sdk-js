import { z } from "zod";

export const CreateChannelNumberRequestSchema = z.object({
  phone_number_id: z.string().min(1),
  channel_id: z.string().min(1),
  cid: z.string().min(1),
  priority: z.number().int().min(0),
  is_exclusive: z.boolean().optional(),
  label: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
});

export type CreateChannelNumberRequest = z.infer<
  typeof CreateChannelNumberRequestSchema
>;

export const UpdateChannelNumberRequestSchema =
  CreateChannelNumberRequestSchema.partial();
export type UpdateChannelNumberRequest = z.infer<
  typeof UpdateChannelNumberRequestSchema
>;
