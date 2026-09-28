export type FieldType =
  | "Date"
  | "Email"
  | "Number"
  | "PhoneNumber"
  | "Text";

export interface Field {
  field_type: FieldType;
  label: string;
  value?: string | null;
}
