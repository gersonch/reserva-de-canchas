import { Pressable, Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { supabase } from "@/supabase/supabase";
import { useAuth } from "@/hooks/useAuth";

export function Calificar({ complejoId }: { complejoId: string }) {
  const { session, user } = useAuth();
  const userId = session?.user.id;
  const [calificacion, setCalificacion] = useState(0);
  const starButtonArray = new Array(5).fill(false);
  useEffect(() => {
    const debug = async () => {
      console.log(session?.user.id);
    };
    debug();
  }, []);

  async function toggleCalificacion(
    index: number,
    current: number,
    setCalificacion: (value: number) => void,
    userId: string,
    complejoId: string
  ) {
    const nuevaCalificacion = current === index + 1 ? 0 : index + 1;

    setCalificacion(nuevaCalificacion);

    if (nuevaCalificacion === 0) return; // No guardar si se deselecciona

    const { data, error } = await supabase.from("calificaciones").upsert(
      [
        {
          user_id: userId,
          complejo_id: complejoId,
          calificacion: nuevaCalificacion,
        },
      ],
      {
        onConflict: "user_id,complejo_id",
      }
    );

    if (error) {
      console.error("Error guardando calificación:", error);
    } else {
      console.log("Calificación guardada:", data);
    }
  }

  const handleCalificacion = (index: number) => {
    if (userId) {
      toggleCalificacion(
        index,
        calificacion,
        setCalificacion,
        userId,
        complejoId
      );
    } else {
      console.error("User ID is undefined. Cannot save rating.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Califícanos!</Text>
      <View style={styles.starsContainer}>
        {starButtonArray.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => handleCalificacion(index)}
            style={({ pressed }) => [
              styles.starButton,
              pressed && styles.starButtonPressed,
            ]}
          >
            <IconSymbol
              name={index < calificacion ? "star.fill" : "star"}
              size={40}
              color={index < calificacion ? "#FFD700" : "#ccc"}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: "row",
    width: "100%",
  },
  starButton: {
    padding: 5,
  },
  starButtonPressed: {
    opacity: 0.7,
  },
});
