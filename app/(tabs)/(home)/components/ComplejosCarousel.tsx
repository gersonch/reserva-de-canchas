import { supabase } from "@/supabase/supabase";
import { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useLocationStore } from "@/store/useLocation";
import { Link } from "expo-router";

interface Complejo {
  id: string | number;
  estrellas: number;
  image_url: string | undefined;
  nombre: any;
  pais: string;
  ciudad: string;
  direccion: string;
}

export function ComplejosCarousel() {
  const [data, setData] = useState<Complejo[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga
  const city = useLocationStore((state) => state.city); // Obtiene la ciudad del store

  useEffect(() => {
    const fetchComplejos = async () => {
      setIsLoading(true); // Inicia el estado de carga
      const { data, error } = await supabase
        .from("complejo")
        .select(`id, nombre, image_url, direccion, ciudad, pais, estrellas`);
      if (error) {
        console.error("Error al cargar complejos:", error.message);
        setIsLoading(false); // Finaliza el estado de carga incluso si hay error
        return;
      }
      if (data) {
        setData(data);
      }
      setIsLoading(false); // Finaliza el estado de carga
    };
    fetchComplejos();
  }, []);

  const dataSortedByStars = [...data].sort((a, b) => {
    return b.estrellas - a.estrellas; // Ordena de mayor a menor por estrellas
  });

  const dataFilterdByCity = city
    ? [...dataSortedByStars].filter((item) => {
        const normalizedCity = item.ciudad
          .normalize("NFD") // Normaliza los caracteres con diacríticos
          .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos
          .toLowerCase(); // Convierte a minúsculas

        const normalizedTargetCity = city
          ?.normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

        return normalizedCity === normalizedTargetCity; // Compara las ciudades normalizadas
      })
    : dataSortedByStars; // Si no hay city, usa los datos ordenados por estrellas

  return (
    <View style={styles.container}>
      {isLoading
        ? // Renderiza el skeleton mientras se cargan los datos
          Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonText} />
              <View style={styles.skeletonText} />
            </View>
          ))
        : dataFilterdByCity.map((item, index) => (
            <Link
              key={index}
              style={styles.card}
              href={{
                pathname: "/detalles/[id]",
                params: { id: item.id },
              }}
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
                resizeMode="cover"
                onLoad={() => setIsLoading(false)} // Oculta el skeleton cuando la imagen se carga
              />
              <View style={styles.cardContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{item.nombre}</Text>
                  <Text style={styles.cardSub}>
                    {item.direccion}, {item.ciudad}
                  </Text>
                  <Text style={styles.cardSub}>{item.pais}</Text>
                </View>
                <View style={styles.starsContainer}>
                  <IconSymbol
                    style={{ marginTop: 8 }}
                    size={15}
                    name="star.fill"
                    color={"#FFD700"}
                  />
                  <Text style={styles.starsText}>
                    {item.estrellas.toFixed(1)}
                  </Text>
                </View>
              </View>
            </Link>
          ))}
    </View>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
    width: screenWidth, // en vez de hardcodear 100% o 380px
  },
  image: {
    width: screenWidth, // igual que la card
    height: 300,
    borderRadius: 15,
    marginBottom: 8,
  },
  cardContent: {
    flexDirection: "row", // Coloca el texto y las estrellas en una fila
    justifyContent: "space-between", // Distribuye los elementos a los extremos
    width: screenWidth - 40,
  },
  textContainer: { marginTop: 8 }, // Espacio entre la imagen y el texto
  starsContainer: {
    flexDirection: "row", // Coloca el ícono y el número en una fila
  },
  starsText: {
    marginLeft: 4, // Espaciado entre el ícono y el número
    fontSize: 14,
    color: "#666",
    marginTop: 8, // Alinea verticalmente el texto con el ícono
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "left", // Asegura que el texto esté alineado a la izquierda
  },
  cardSub: {
    fontSize: 14,
    color: "#666",
    textAlign: "left", // Asegura que el subtítulo esté alineado a la izquierda
  },
  skeletonCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#e0e0e0",
    width: screenWidth - 50,
    justifyContent: "center",
    alignItems: "center",
  },
  skeletonImage: {
    width: screenWidth - 100,
    height: 300,
    borderRadius: 15,
    marginBottom: 8,
    backgroundColor: "#c0c0c0",
  },
  skeletonText: {
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: "#c0c0c0",
  },
});
