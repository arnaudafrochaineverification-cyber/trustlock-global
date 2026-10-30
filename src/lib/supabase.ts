
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://hmvbppfhenqytetdqhaq.supabase.co";

const supabasePublishableKey =
  "sb_publishable_qL4ong89f-yUEQF_EQYETg_jEm_xamF";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
