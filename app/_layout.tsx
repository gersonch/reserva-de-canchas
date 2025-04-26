import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { supabase } from "@/supabase/supabase";
import { Linking } from "react-native";
import { Alert } from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { useColorScheme } from "@/hooks/useColorScheme";
import { toastConfig } from "@/components/toastConfig";

// Prevenir que el splash screen desaparezca automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Ocultar splash una vez que cargan las fuentes
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Manejo de Magic Link
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const hash = event.url.split("#")[1];
      if (!hash) {
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
          Alert.alert("Error", "No se pudo iniciar sesión con el enlace.");
        } else {
          router.replace("/");
        }
      } else {
        console.warn("⚠️ Tokens no encontrados en el link");
      }
    };

    // Escuchar eventos de deep links mientras la app está abierta
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Verificar si la app se abrió directamente con un link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove(); // Limpieza del listener
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="detalles" options={{ headerShown: false }} />
          <Stack.Screen name="complejos" options={{ headerShown: false }} />
          <Stack.Screen
            name="registro-complejo"
            options={{ headerShown: false }}
          />
          <Stack />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      <Toast config={toastConfig} />
    </>
  );
}
