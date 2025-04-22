import { Stack } from "expo-router";

export default function MisComplejosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="complejos" options={{ title: "Mis complejos" }} />
    </Stack>
  );
}
