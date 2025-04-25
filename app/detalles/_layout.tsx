import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function DetallesLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="[id]" options={{ title: "Detalles" }} />
      </Stack>
    </>
  );
}
