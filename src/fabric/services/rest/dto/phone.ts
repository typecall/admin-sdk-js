import { z } from "zod";

export const PhoneModelSchema = z.enum([
  "SnomD120",
  "SnomD140",
  "SnomD150",
  "SnomD717",
  "SnomD785",
  "YealinkSipT48u",
  "YealinkSipT48U",
]);

export const PhoneLineAssignmentSchema = z.object({
  id: z.string().optional(),
  line_number: z.number().int().min(1),
  user_id: z.string().min(1),
  password: z.string().optional(),
});
export type PhoneLineAssignment = z.infer<typeof PhoneLineAssignmentSchema>;

export const CreatePhoneRequestSchema = z.object({
  name: z.string().min(1),
  model: PhoneModelSchema,
  location: z.string().min(1),
  is_cloud_managed: z.boolean(),
  serial_number: z.string().nullable().optional(),
  mac_address: z.string().nullable().optional(),
  lines: z.array(PhoneLineAssignmentSchema).optional(),
});
export type CreatePhoneRequest = z.infer<typeof CreatePhoneRequestSchema>;

export const UpdatePhoneRequestSchema = CreatePhoneRequestSchema.partial();
export type UpdatePhoneRequest = z.infer<typeof UpdatePhoneRequestSchema>;

export interface PhoneConfigResponse {
  config: string;
}
