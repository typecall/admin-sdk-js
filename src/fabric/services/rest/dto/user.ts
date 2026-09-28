import { z } from "zod";
import type { UserRedirectAction } from "../../../domains/workspace/user.js";

export const UserRoleSchema = z.enum(["Owner", "Admin", "Member", "Guest"]);

export const UserAvailabilitySchema = z.enum([
  "Available",
  "Busy",
  "DoNotDisturb",
  "BeRightBack",
  "AppearAway",
  "AppearOffline",
]);

export const CreateUserRequestSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  role: UserRoleSchema,
  extension: z.string().nullable().optional(),
  avatar_path: z.string().nullable().optional(),
  avatar_hash: z.string().nullable().optional(),
  availability: UserAvailabilitySchema.optional(),
  ring_duration_ms: z.number().int().min(1000).optional(),
  redirect_action: z.custom<UserRedirectAction>().optional(),
  default_channel_number_id: z.string().nullable().optional(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = CreateUserRequestSchema.partial();
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
