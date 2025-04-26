import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ComplejosCarousel } from "@/app/(tabs)/(home)/components/ComplejosCarousel";
import LocationExample from "@/components/Location";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { session, user } = useAuth();

  return (
    <View style={styles.container}>
      {/* Cabecera con input */}
      <View style={styles.header}>
        <Pressable
          style={styles.input}
          onPress={() => alert("Aquí se abrirá una sección de búsqueda")}
        >
          <View style={styles.iconTextContainer}>
            <IconSymbol size={20} name="magnifyingglass" color="black" />
            <Text style={styles.text}>Buscar complejo</Text>
          </View>
        </Pressable>

        <View style={styles.headerTextContainer}>
          {/* <Text style={styles.headerText}>Bienvenido a la app</Text> */}
          <LocationExample />
        </View>
      </View>

      {/* Contenido scrollable */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ComplejosCarousel />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    width: "100%",
    paddingTop: 70,
    paddingBottom: 0,
    position: "relative",
  },
  input: {
    width: "90%",
    height: 60,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: "center",
    position: "absolute",
    top: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 1,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "black",
    marginLeft: 8,
  },
  headerTextContainer: {
    marginTop: 60,
    alignItems: "center",
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
    alignItems: "center",
  },
});
