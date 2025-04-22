import { BackButton } from "@/components/BackButton";
import { StyleSheet, Text, View } from "react-native";

export default function RegistroComplejos() {
  return (
    <View style={styles.container}>
      {/* Back Button*/}
      <BackButton />
      {/* Content */}
      <Text style={styles.title}>Registro Complejos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
