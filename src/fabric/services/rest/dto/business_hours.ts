import type { Month } from "../../../common/date.js";
import type {
  BusinessHoursScheduleDay,
  BusinessHoursHoliday,
  BusinessHoursException,
} from "../../../domains/workspace/business_hours.js";

export interface CreateBusinessHoursRequest {
  name: string;
  timezone: string;
  is_scoped_by_period: boolean;
  from_month?: Month | null;
  from_day?: number | null;
  to_month?: Month | null;
  to_day?: number | null;
  schedule?: Record<number, BusinessHoursScheduleDay>;
  holidays?: BusinessHoursHoliday[];
  exceptions?: BusinessHoursException[];
}

export interface UpdateBusinessHoursRequest {
  name?: string;
  timezone?: string;
  is_scoped_by_period?: boolean;
  from_month?: Month | null;
  from_day?: number | null;
  to_month?: Month | null;
  to_day?: number | null;
  schedule?: Record<number, BusinessHoursScheduleDay>;
  holidays?: BusinessHoursHoliday[];
  exceptions?: BusinessHoursException[];
}
