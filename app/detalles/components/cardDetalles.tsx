import { IconSymbol } from "@/components/ui/IconSymbol";
import { View, Text, Image, StyleSheet } from "react-native";

interface Item {
  ciudad: string;
  direccion: string;
  estrellas: number;
  nombre: string;
  image_url: string;
  complejo_deportes: {
    deportes: {
      id: number;
      nombre: string;
    };
  }[];
}

export function CardDetalles({ item }: { item: Item }) {
  return (
    <View style={styles.card}>
      {/* Imagen en la parte superior */}
      <Image source={{ uri: item.image_url }} style={styles.image} />

      <View style={styles.textContainer}>
        {/* Título */}
        <Text style={styles.title}>{item.nombre}</Text>

        {/* Deporte(s) */}
        <Text style={styles.label}>Deportes:</Text>
        {item.complejo_deportes.map((cd) => (
          <Text style={styles.deporte} key={cd.deportes.id}>
            • {cd.deportes.nombre}
          </Text>
        ))}

        {/* Dirección */}
        <Text style={styles.text}>
          Dirección: {item.direccion}, {item.ciudad}
        </Text>

        {/* Valoración */}
        <View style={styles.rating}>
          <Text style={styles.ratingText}>
            <IconSymbol
              style={{ marginTop: 8 }}
              size={15}
              name="star.fill"
              color={"#FFD700"}
            />{" "}
            {item.estrellas.toFixed(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 0, // Sin márgenes
  },
  image: {
    width: "100%",
    height: 300, // Altura considerable para que se vea como un banner
    borderRadius: 0, // Sin bordes redondeados para el estilo
  },
  textContainer: {
    paddingHorizontal: 20, // Margen izquierdo y derecho
    paddingTop: 20, // Para separar un poco del borde inferior de la imagen
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  deporte: {
    marginLeft: 8,
    marginVertical: 4,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  ratingText: {
    fontWeight: "500",
    fontSize: 16,
    color: "#444",
  },
});
