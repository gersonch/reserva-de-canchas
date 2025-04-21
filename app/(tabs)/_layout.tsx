import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Linking } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "@/supabase/supabase"; // Asegúrate de importar supabase
import { useAuth } from "@/hooks/useAuth"; // Asegúrate de importar el hook de autenticación

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isLoggedIn = true; // Aquí debes verificar si el usuario está logueado
  const { session } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // Efecto de transparencia en iOS
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(home)/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Reservas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="calendar.and.person" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(login)/index"
        options={{
          title: session ? "Mi Cuenta" : "Iniciar Sesión",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name={session ? "person.fill" : "person.crop.circle.fill"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
