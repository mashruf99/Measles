// supabase.js logic
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const getUserId = () => {
  let userId = localStorage.getItem("device_user_id");
  if (!userId) {
    userId = crypto.randomUUID(); // Generates a unique string
    localStorage.setItem("device_user_id", userId);
  }
  return userId;
};