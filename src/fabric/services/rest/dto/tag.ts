import { z } from "zod";

export const TagScopeSchema = z.enum([
  "CallScreen",
  "Contact",
  "Flow",
  "call-screen",
  "contact",
  "flow",
]);

export const CreateTagRequestSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  scopes: z.array(TagScopeSchema).min(1),
});

export type CreateTagRequest = z.infer<typeof CreateTagRequestSchema>;

export const UpdateTagRequestSchema = CreateTagRequestSchema.partial();
export type UpdateTagRequest = z.infer<typeof UpdateTagRequestSchema>;
