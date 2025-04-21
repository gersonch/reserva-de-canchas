import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { CardDetalles } from "./components/cardDetalles";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { IconSymbol } from "@/components/ui/IconSymbol"; // Asegúrate de importar el icono
import { useRouter } from "expo-router";

interface Item {
  nombre: string;
  image_url: string;
  ciudad: string;
  direccion: string;
  estrellas: number;
  complejo_deportes: {
    deportes: {
      id: number;
      nombre: string;
    };
  }[];
}

export default function DetallesComplejo() {
  const { id } = useLocalSearchParams();
  const [items, setItems] = useState<Item | null>(null);
  const router = useRouter(); // Inicializa el router

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("complejo")
        .select(
          `*, complejo_deportes (
            deportes(
              id, nombre
            )
          )`
        )
        .eq("id", id)
        .single();

      if (!error) {
        setItems(data);
      }
      if (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botón de retroceso */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <IconSymbol size={40} name="arrow.backward.circle.fill" color="#fff" />
      </TouchableOpacity>

      {/* Contenido */}
      {items && <CardDetalles item={items} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
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
