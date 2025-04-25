import { IconSymbol } from "@/components/ui/IconSymbol";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Linking } from "react-native";

interface Item {
  ciudad: string;
  direccion: string;
  estrellas: number;
  nombre: string;
  image_url: string;
  numero_direccion: number;
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>{item.nombre}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconSymbol size={15} name="star.fill" color={"#FFD700"} />
            <Text style={styles.ratingText}> {item.estrellas.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.label}>Deportes:</Text>
        {item.complejo_deportes.map((cd) => (
          <Text style={styles.deporte} key={cd.deportes.id}>
            • {cd.deportes.nombre}
          </Text>
        ))}

        {/* Dirección */}
        <Pressable
          style={styles.text}
          onPress={() => {
            try {
              const query = encodeURIComponent(
                `${item.direccion} ${item.numero_direccion}, ${item.ciudad}`
              );
              const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
              Linking.openURL(url);
            } catch (error) {
              console.error("No se pudo abrir Google Maps:", error);
            }
          }}
        >
          <Text>
            Dirección:{" "}
            <Text
              style={{
                color: "#555", // azul moderno
                textDecorationLine: "underline",
                fontSize: 14, // o lo que uses para detalles
                fontWeight: "500",
              }}
            >
              {item.direccion} {item.numero_direccion.toString()}, {item.ciudad}
            </Text>
          </Text>
        </Pressable>
        <Text style={{ marginTop: 10, fontWeight: "bold", fontSize: 20 }}>
          Reservar
        </Text>

        <View style={styles.rating}></View>
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
    alignItems: "center",
    justifyContent: "center",
  },
});
