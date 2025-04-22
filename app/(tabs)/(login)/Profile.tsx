import { Text, View, Pressable, StyleSheet } from "react-native";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "expo-router";
import { ProfileButton } from "@/components/ProfileButton";
import { iconNames, IconName } from "@/types/iconNames";

interface ProfileProps {
  styles: {
    container: object;
    title: object;
    buttonText: object;
    signOut: object;
  };
}

const rutas: { nombre: string; ruta: string; icon: IconName }[] = [
  { nombre: "Mis complejos", ruta: "/complejos", icon: "cancha" },
  { nombre: "Mis reservas", ruta: "/reservas", icon: "calendar" },
  { nombre: "Mis pagos", ruta: "/pagos", icon: "pagos" },
];

export function Profile() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
      <View style={styles.containerSection}>
        {rutas.map((ruta) => (
          <Pressable
            onPress={() => router.push(ruta.ruta as any)}
            key={ruta.nombre}
          >
            <ProfileButton nombre={ruta.nombre} icon={ruta.icon} />
          </Pressable>
        ))}
      </View>
      <Pressable style={{ marginTop: 20 }}>
        <Text style={styles.signOut} onPress={() => supabase.auth.signOut()}>
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  containerSection: {
    width: "100%",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  section: {
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
    paddingVertical: 10, // Cambié `paddingBlock` por `paddingVertical` para React Native
    flexDirection: "row", // Coloca los elementos en una fila
    justifyContent: "space-between", // Distribuye los elementos a los extremos
    alignItems: "center", // Alinea los elementos verticalmente
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "semibold",
    paddingLeft: 10,
  },
  signOut: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBlock: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "red",
    color: "white",
  },
});
