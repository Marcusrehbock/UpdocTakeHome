// src/types.ts
export interface Request {
  id: string; // UUID
  i_am_seeking: string;
  from: string;
  what_is_the_main_reason_for_this_pain: string;
  how_many_days_are_you_requesting: number;
  please_describe: string;
  email: string;
  mobile: number;
  first_name: string;
  last_name: string;
  address: string;
  submittedat: string | null; // ISO timestamp
  formmode: string;
  status?: string; // e.g., 'pending', 'confirmed', 'denied'
  approveddays?: number;
  doctorremarks?: string;
}
