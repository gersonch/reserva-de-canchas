import { Pressable, Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { IconSymbol } from "@/components/ui/IconSymbol";

export function Calificar() {
  const [calificacion, setCalificacion] = useState(0);
  const starButtonArray = new Array(5).fill(false);

  const toggleCalificacion = (index: number) => {
    if (calificacion === index + 1) {
      // Si la estrella ya está seleccionada, desactívala
      setCalificacion(0);
    } else {
      // Si no está seleccionada, actívala
      setCalificacion(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Califícanos!</Text>
      <View style={styles.starsContainer}>
        {starButtonArray.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => toggleCalificacion(index)}
            style={({ pressed }) => [
              styles.starButton,
              pressed && styles.starButtonPressed,
            ]}
          >
            <IconSymbol
              name={index < calificacion ? "star.fill" : "star"}
              size={40}
              color={index < calificacion ? "#FFD700" : "#ccc"} // Estrella dorada si está seleccionada
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
    opacity: 0.7, // Efecto visual al presionar
  },
});
