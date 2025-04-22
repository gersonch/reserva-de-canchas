import { Stack } from "expo-router";

export default function DetallesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" options={{ title: "Detalles" }} />
    </Stack>
  );
}
