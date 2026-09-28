import { z } from "zod";

export const CreateDomainRequestSchema = z.object({
  domain: z.string().min(1),
});

export type CreateDomainRequest = z.infer<typeof CreateDomainRequestSchema>;

export const UpdateDomainRequestSchema = CreateDomainRequestSchema.partial();
export type UpdateDomainRequest = z.infer<typeof UpdateDomainRequestSchema>;
