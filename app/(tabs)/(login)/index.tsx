import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect } from "react";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "@/supabase/supabase";
import { red } from "react-native-reanimated/lib/typescript/Colors";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const { session } = useAuth(); // Asegúrate de importar el hook de autenticación

  // URI personalizada basada en tu scheme configurado en app.json
  const redirectTo = makeRedirectUri({ scheme: "exp" });

  const handleLogin = async () => {
    if (!email) {
      Alert.alert("Correo requerido", "Por favor ingresa un correo válido.");
      return;
    }

    console.log("📧 Enviando Magic Link a:", email);
    console.log("🔗 Redirect URI:", redirectTo);

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectTo, // Asegúrate de que esta ruta esté configurada en tu app
      },
    });

    if (error) {
      console.error("❌ Error al enviar Magic Link:", error.message);
      Alert.alert("Error", "Ocurrió un error al intentar enviar el enlace.");
      return;
    }

    Alert.alert(
      "Correo enviado",
      "Se ha enviado un enlace de acceso a tu email. Revisa tu bandeja de entrada."
    );
    setEmail("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {!session ? (
        <View style={styles.container}>
          <Text style={styles.title}>Inicia sesión</Text>
          <TextInput
            style={styles.input}
            textContentType="emailAddress"
            autoCapitalize="none"
            placeholder="Ingresa tu correo"
            keyboardType="email-address"
            onChangeText={setEmail}
            value={email}
          />
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Enviar Magic Link</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Bienvenido de nuevo!</Text>
          <Text style={styles.title}>Ya estás logueado</Text>
          <Pressable>
            <Text
              style={styles.buttonText}
              onPress={() => supabase.auth.signOut()}
            >
              Cerrar sesión
            </Text>
          </Pressable>
        </View>
      )}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  input: {
    width: 300,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});
