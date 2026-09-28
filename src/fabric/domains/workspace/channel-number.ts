export type ChannelNumberCapability =
   | "Voice"
   | "Sms"
   | "Mms"
   | "WhatsAppMessaging"
   | "WhatsAppVoice";

export interface ChannelNumber {
   id: string;
   workspace_id: string;
   phone_number_id: string;
   channel_id: string;
   cid: string;
   name: string;
   country: string;
   label?: string | null;
   user_id?: string | null;
   priority: number;
   is_exclusive: boolean;
   capabilities: ChannelNumberCapability[];
   created_at: string;
   updated_at: string;
   deleted_at?: string | null;
}
