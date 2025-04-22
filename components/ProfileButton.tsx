import { View, Text, StyleSheet } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { iconNames, IconName } from "@/types/iconNames"; // Ajusta la ruta

interface ProfileButtonProps {
  nombre: string;
  icon: IconName;
}

export function ProfileButton({ nombre, icon }: ProfileButtonProps) {
  return (
    <View style={styles.section}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <IconSymbol size={30} name={iconNames[icon]} color={"black"} />
        <Text style={styles.buttonText}>{nombre}</Text>
      </View>
      <IconSymbol size={20} name="chevron.forward" color={"black"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  containerSection: {
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  section: {
    borderBottomColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
    paddingVertical: 10, // Cambié `paddingBlock` por `paddingVertical` para React Native
    flexDirection: "row", // Coloca los elementos en una fila
    justifyContent: "space-between", // Distribuye los elementos a los extremos
    alignItems: "center", // Alinea los elementos verticalmente
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "semibold",
    paddingLeft: 10,
  },
  signOut: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBlock: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "red",
    color: "white",
  },
});
