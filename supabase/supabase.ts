import { createClient } from "@supabase/supabase-js";
import { supabaseSecureStorageAdapter } from "./supabaseSecureStorageAdapter";
import "react-native-url-polyfill/auto"; // Necesario en React Native

const supabaseUrl = "https://gumxeoeiskcmheomnkcx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1bXhlb2Vpc2tjbWhlb21ua2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzOTg5ODQsImV4cCI6MjA1OTk3NDk4NH0.lMFg7824ZmmDacZOBc8jW0u1QPOzcqEtTwCZyXvK7g0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseSecureStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
