import { Stack } from "expo-router";

export default function RegistroComplejosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="registro-complejo"
        options={{ title: "Registro de complejos" }}
      />
    </Stack>
  );
}
