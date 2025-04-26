import { StyleSheet, View, Text, ScrollView } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";
import { format, set } from "date-fns";

export default function TabTwoScreen() {
  const { user } = useAuth();
  interface Reserva {
    id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    estado: string;
    cancha_id: {
      numero: number;
      deporte: string;
      complejo_id: {
        nombre: string;
      };
    };
  }

  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const fetchReservas = async () => {
      const { data, error } = await supabase
        .from("reserva")
        .select("*, cancha_id(*, complejo_id(*))")
        .eq("usuario_id", user?.id)
        .order("fecha", { ascending: false });

      if (error) {
        setReservas([]);
      } else {
        setReservas(data || []);
      }
    };

    fetchReservas();
  }, [reservas]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Reservas</Text>
      {reservas.length === 0 ? (
        <Text style={styles.emptyText}>Aún no tienes reservas.</Text>
      ) : (
        reservas.map((reserva) => (
          <View key={reserva.id} style={styles.card}>
            <Text style={styles.complejo}>
              {reserva.cancha_id.complejo_id.nombre}
            </Text>
            <Text style={styles.detalle}>
              Cancha #{reserva.cancha_id.numero} -{" "}
              {reserva.cancha_id.deporte.toUpperCase()}
            </Text>
            <Text style={styles.fecha}>
              {format(new Date(reserva.fecha), "dd/MM/yyyy")} |{" "}
              {reserva.hora_inicio.slice(0, 5)} - {reserva.hora_fin.slice(0, 5)}
            </Text>
            <Text
              style={[
                styles.estado,
                {
                  backgroundColor:
                    reserva.estado === "pendiente"
                      ? "#FF9800"
                      : reserva.estado === "confirmada"
                      ? "#4CAF50"
                      : "#f44336",
                },
              ]}
            >
              {reserva.estado.toUpperCase()}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 50,
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  complejo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
  },
  detalle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginBottom: 4,
  },
  fecha: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  estado: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    overflow: "hidden",
  },
});
