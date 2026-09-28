import { z } from "zod";

export interface WorkspaceBillingAddress {
  line_1?: string | null;
  line_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}

export const UpdateWorkspaceAddressSchema = z.object({
  address_1: z.string().optional(),
  address_2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateWorkspaceAddress = z.infer<
  typeof UpdateWorkspaceAddressSchema
>;

export interface WorkspaceBillingProfile {
  id: string;
  name: string;
  status: string;
  preferred_language?: string | null;
  currency?: string | null;
  contact_name?: string | null;
  contact_surname?: string | null;
  contact_email?: string | null;
  tax_number?: string | null;
  address?: WorkspaceBillingAddress | null;
  created_at?: string;
  updated_at?: string;
}

export const UpdateWorkspaceRequestSchema = z.object({
  name: z.string().min(1).max(65).optional(),
  contact_name: z.string().optional(),
  contact_surname: z.string().optional(),
  contact_email: z.string().email().optional(),
  address: UpdateWorkspaceAddressSchema.optional(),
});

export type UpdateWorkspaceRequest = z.infer<
  typeof UpdateWorkspaceRequestSchema
>;
