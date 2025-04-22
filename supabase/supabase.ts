import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto"; // Necesario en React Native
import { AppState } from "react-native";

const supabaseUrl = "https://comqzmlorypjiesbhkao.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvbXF6bWxvcnlwamllc2Joa2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxOTA4NzMsImV4cCI6MjA2MDc2Njg3M30.b-mc9favzHoXKdnksC-jzos5_qIult448nQsY1bqvLw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
