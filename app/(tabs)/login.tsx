import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 300,
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 7,
    position: "absolute",
    top: 50,
    display: "flex",
    alignItems: "center",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "black",
    marginLeft: 8, // Espaciado entre el ícono y el texto
  },
});
