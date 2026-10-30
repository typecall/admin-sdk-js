import { z } from "zod";

export const CreatePaymentMethodRequestSchema = z.object({
  provider_type: z.string().min(1),
  provider_id: z.string().min(1),
});

export type CreatePaymentMethodRequest = z.infer<
  typeof CreatePaymentMethodRequestSchema
>;

export interface CreatePaymentMethodUrlResponse {
  url: string;
}
