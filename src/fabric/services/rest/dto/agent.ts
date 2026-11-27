import { z } from "zod";

export const AgentRoleSchema = z.enum(["Analyst", "Operator", "Receptionist"]);

export const GenderSchema = z.enum(["Female", "Male"]);

export const CreateAgentRequestSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  role: AgentRoleSchema,
  is_active: z.boolean().optional(),
  avatar_path: z.string().max(255).nullable().optional(),
  avatar_hash: z.string().max(255).nullable().optional(),
  language_codes: z.array(z.string()).optional(),
  gender: GenderSchema.nullable().optional(),
  instructions: z.string().min(1, "Instructions are required"),
  tools: z.array(z.record(z.string(), z.unknown())).optional(),
});

export type CreateAgentRequest = z.infer<typeof CreateAgentRequestSchema>;

export const UpdateAgentRequestSchema = CreateAgentRequestSchema.partial();

export type UpdateAgentRequest = z.infer<typeof UpdateAgentRequestSchema>;
