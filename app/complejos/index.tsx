import {
  Text,
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  ViewComponent,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/supabase/supabase";
import { BackButton } from "@/components/BackButton";
import ComplejoForm from "./ComplejosForm";

interface ProfileProps {
  styles: {
    container: object;
    title: object;
    buttonText: object;
    backButton: object;
  };
}

export default function MisComplejos() {
  const router = useRouter();
  const { session } = useAuth();

  interface User {
    id: string;
    is_arrendador: boolean;
  }

  const [user, setUser] = useState<User | null>(null);
  interface Complejo {
    id: string;
    nombre: string;
  }

  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [loading, setLoading] = useState(true);

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
          setComplejos(data);
        }
      }
    };

    fetchComplejos();
  }, [user]);

  const isArrendador = user?.is_arrendador;

  return (
    <View style={styles.container}>
      <BackButton />

      {loading ? (
        <Text
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          Cargando...
        </Text>
      ) : isArrendador || user === null ? (
        <>
          <Text style={styles.title}>Mis Complejos</Text>
          <ScrollView style={{ marginTop: 20 }}>
            {complejos.map((complejo) => (
              <Pressable
                key={complejo.id}
                style={styles.complejoItem}
                onPress={() => router.push(`/detalles/${complejo.id}`)}
              >
                <Text style={styles.complejoText}>{complejo.nombre}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <View>
            <ComplejoForm />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  complejoItem: {
    backgroundColor: "#f2f2f2",
    paddingBlock: 30,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  complejoText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    color: "#0a84ff",
    fontWeight: "600",
    textAlign: "center",
  },
});
