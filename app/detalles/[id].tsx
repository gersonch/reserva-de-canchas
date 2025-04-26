import { StyleSheet, ScrollView, Text, Pressable, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { CardDetalles } from "./components/cardDetalles";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { useRouter } from "expo-router";
import { BackButton } from "@/components/BackButton";
import { Cancha } from "./Cancha";
import { Calificar } from "./Calificar";

interface Item {
  nombre: string;
  image_url: string;
  ciudad: string;
  direccion: string;
  estrellas: number;
  numero_direccion: number;
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
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    };

    fetchData();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Botón de retroceso */}
      <BackButton />

      {/* Contenido */}
      {loading || !items ? (
        <View style={{ padding: 16 }}>
          <View
            style={{
              height: 200,
              backgroundColor: "#e0e0e0",
              borderRadius: 10,
            }}
          />
          <View
            style={{
              height: 20,
              marginTop: 16,
              backgroundColor: "#e0e0e0",
              borderRadius: 5,
            }}
          />
          <View
            style={{
              height: 20,
              marginTop: 8,
              width: "70%",
              backgroundColor: "#e0e0e0",
              borderRadius: 5,
            }}
          />
          <View
            style={{
              height: 20,
              marginTop: 8,
              width: "50%",
              backgroundColor: "#e0e0e0",
              borderRadius: 5,
            }}
          />
        </View>
      ) : (
        <CardDetalles item={items} />
      )}

      <Cancha complejoId={Array.isArray(id) ? id[0] : id} />
      <Calificar complejoId={Array.isArray(id) ? id[0] : id} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  map: {
    width: "100%",
    height: 300,
    marginTop: 20,
  },
});
