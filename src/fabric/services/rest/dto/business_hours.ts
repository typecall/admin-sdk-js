import { z } from "zod";

export const BusinessHoursStatusSchema = z.enum(["Open", "Closed"]);

export const MonthSchema = z.enum([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);

export const BusinessHoursTimeSlotSchema = z.object({
  start_time: z.string(),
  end_time: z.string(),
  status: BusinessHoursStatusSchema,
  routing_tag_id: z.string().nullable().optional(),
});

export const BusinessHoursScheduleDaySchema = z.object({
  slots: z.array(BusinessHoursTimeSlotSchema),
});

export const BusinessHoursHolidaySchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: BusinessHoursStatusSchema,
  from_month: MonthSchema,
  from_day: z.number().int().min(1).max(31),
  to_month: MonthSchema,
  to_day: z.number().int().min(1).max(31),
  start_time: z.string(),
  end_time: z.string(),
  is_all_day: z.boolean(),
  is_active: z.boolean(),
  is_multiday: z.boolean(),
  source_id: z.string().nullable().optional(),
  routing_tag_id: z.string().nullable().optional(),
});

export const BusinessHoursExceptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: BusinessHoursStatusSchema,
  date: z.string().min(1, "Date is required"),
  start_time: z.string(),
  end_time: z.string(),
  is_all_day: z.boolean(),
  is_active: z.boolean(),
  routing_tag_id: z.string().nullable().optional(),
});

export const BusinessHoursFormBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  timezone: z.string().min(1, "Timezone is required"),
  is_scoped_by_period: z.boolean().default(false),
  from_month: MonthSchema.nullable().optional(),
  from_day: z.number().int().min(1).max(31).nullable().optional(),
  to_month: MonthSchema.nullable().optional(),
  to_day: z.number().int().min(1).max(31).nullable().optional(),
  schedule: z.record(z.string(), BusinessHoursScheduleDaySchema).optional(),
  holidays: z.array(BusinessHoursHolidaySchema).optional(),
  exceptions: z.array(BusinessHoursExceptionSchema).optional(),
});

export const CreateBusinessHoursRequestSchema =
  BusinessHoursFormBaseSchema.refine(
    (data) => {
      if (data.is_scoped_by_period) {
        return (
          data.from_month != null &&
          data.from_day != null &&
          data.to_month != null &&
          data.to_day != null
        );
      }
      return true;
    },
    {
      message:
        "Start and end dates are required when limiting to a specific period",
      path: ["is_scoped_by_period"],
    },
  );

export type CreateBusinessHoursRequest = z.infer<
  typeof CreateBusinessHoursRequestSchema
>;

export const UpdateBusinessHoursRequestSchema =
  BusinessHoursFormBaseSchema.partial();
export type UpdateBusinessHoursRequest = z.infer<
  typeof UpdateBusinessHoursRequestSchema
>;
