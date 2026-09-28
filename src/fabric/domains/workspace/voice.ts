export interface Voice {
   id: string;
   name: string;
   gender: string;
   language: string;
   provider: string;
   sample_url?: string | null;
}
