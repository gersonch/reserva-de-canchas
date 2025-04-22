import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CardDetalles } from "./components/cardDetalles";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";

import { useRouter } from "expo-router";
import { BackButton } from "@/components/BackButton";

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
      <BackButton />

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
});
