export interface WorkspaceBillingAddress {
  line_1?: string | null;
  line_2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
}

export interface UpdateWorkspaceAddress {
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

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
  created_at: string;
  updated_at: string;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  contact_name?: string;
  contact_surname?: string;
  contact_email?: string;
  address?: UpdateWorkspaceAddress;
}
