import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { Linking } from "react-native";
import { Session, User } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Escuchar estado de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Manejar deep link para Magic Link
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      console.log("🔗 Deep link recibido:", event.url);

      const hash = event.url.split("#")[1];
      if (!hash) {
        console.warn("⚠️ No hay fragmento con tokens");
        return;
      }

      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("❌ Error al establecer sesión:", error.message);
        } else {
          console.log("✅ Sesión establecida manualmente:", data);
        }
      } else {
        console.warn("⚠️ Tokens no encontrados en el link");
      }
    };

    const listener = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => listener.remove();
  }, []);

  return { session, user, isLoggedIn: !!user };
}
