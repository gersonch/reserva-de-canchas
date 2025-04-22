import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/supabase/supabase";
import { BackButton } from "@/components/BackButton";

interface ProfileProps {
  styles: {
    container: object;
    title: object;
    buttonText: object;
    backButton: object;
  };
}

export default function MisComplejos() {
  const router = useRouter(); // Inicializa el router
  const { session } = useAuth(); // Obtiene la sesión de autenticación
  interface User {
    id: string;
    is_arrendador: boolean;
    // Agrega otras propiedades del usuario según sea necesario
  }

  const [user, setUser] = useState<User | null>(null); // Estado para almacenar el usuario
  interface Complejo {
    id: string;
    nombre: string;
    // Agrega otras propiedades según la estructura de la tabla "complejo"
  }

  const [complejos, setComplejos] = useState<Complejo[]>([]); // Estado para almacenar los complejos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  //si tiene session, traer tabla users

  useEffect(() => {
    const fetchUser = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("user")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (error) {
          console.error("Error fetching user data:", error);
        } else {
          setUser(data);
        }
        setLoading(false);
      }
    };

    if (!session) {
      setLoading(false);
      return;
    }
    fetchUser();
  }, [session]);

  useEffect(() => {
    const fetchComplejos = async () => {
      if (user?.is_arrendador) {
        const { data, error } = await supabase
          .from("complejo")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching complejos:", error);
        } else {
          setComplejos(data); // ✅ esta era la línea incorrecta
        }
      }
    };

    fetchComplejos();
  }, [user]);

  const isArrendador = user?.is_arrendador;

  return (
    <View style={styles.container}>
      <BackButton />
      <Text>Mis Complejos</Text>
      <Text>Esta es la pantalla de mis complejos</Text>
      {loading ? (
        <Text>Cargando...</Text>
      ) : isArrendador ? (
        <ScrollView>
          {complejos.map((complejo) => (
            <Pressable
              key={complejo.id}
              onPress={() => router.push(`/detalles/${complejo.id}`)}
            >
              <Text>{complejo.nombre}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <Pressable onPress={() => router.push("/registro-complejo")}>
          <Text>Inscribe aqui tu Complejo deportivo</Text>
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 1,
    padding: 10,
    shadowColor: "#000", // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra (hacia abajo)
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 5, // Radio de la sombra (difusión)
    elevation: 5, // Sombra en Android
  },
});
