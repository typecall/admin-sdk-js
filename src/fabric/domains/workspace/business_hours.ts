import type { Month } from "../../common/date.js";
import type { EntityDeleted } from "../../common/entity.js";

export type BusinessHoursStatus = "Open" | "Closed";

export interface BusinessHoursTimeSlot {
  start_time: string;
  end_time: string;
  status: BusinessHoursStatus;
  routing_tag_id?: string | null;
}

export interface BusinessHoursScheduleDay {
  slots: BusinessHoursTimeSlot[];
}

export interface BusinessHoursHoliday {
  name: string;
  status: BusinessHoursStatus;
  from_month: Month;
  from_day: number;
  to_month: Month;
  to_day: number;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  is_active: boolean;
  is_multiday: boolean;
  source_id?: string | null;
  routing_tag_id?: string | null;
}

export interface BusinessHoursException {
  name: string;
  status: BusinessHoursStatus;
  date: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  is_active: boolean;
  routing_tag_id?: string | null;
}

export interface BusinessHours {
  id: string;
  workspace_id: string;
  name: string;
  timezone: string;
  is_scoped_by_period: boolean;
  from_month?: Month | null;
  from_day?: number | null;
  to_month?: Month | null;
  to_day?: number | null;
  schedule: Record<number, BusinessHoursScheduleDay>;
  holidays: BusinessHoursHoliday[];
  exceptions: BusinessHoursException[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type BusinessHoursEventType = "Upserted" | "Deleted";

export type BusinessHoursEvent =
  | { event_type: "Upserted"; payload: BusinessHours }
  | { event_type: "Deleted"; payload: EntityDeleted };
