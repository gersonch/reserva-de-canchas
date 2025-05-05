import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";
import { format, addDays } from "date-fns";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/hooks/useAuth";

interface CanchaProps {
  complejoId: string;
}

export function Cancha({ complejoId }: CanchaProps) {
  const { user } = useAuth();

  interface HorarioDisponible {
    id: number;
    dia_semana: number;
    hora_inicio: string;
    hora_fin: string;
  }

  interface Cancha {
    id: number;
    numero: number;
    deporte: string;
    horario_disponible?: HorarioDisponible[];
  }

  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedCanchaIds, setExpandedCanchaIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservas, setReservas] = useState<
    {
      cancha_id: number;
      fecha: string;
      hora_inicio: string;
      hora_fin: string;
    }[]
  >([]);

  useEffect(() => {
    if (complejoId) {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from("cancha")
          .select(`*, horario_disponible(*)`)
          .eq("complejo_id", complejoId);

        if (error) {
          console.error("Error fetching canchas:", error);
        } else {
          setCanchas(data || []);
        }
        setLoading(false);
      };

      fetchData();
    }
  }, [complejoId]);

  useEffect(() => {
    const fetchReservas = async () => {
      const fechaISO = format(selectedDate, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("reserva")
        .select("cancha_id, fecha, hora_inicio, hora_fin")
        .eq("fecha", fechaISO);

      if (error) {
        console.error("Error al obtener reservas:", error);
      } else {
        setReservas(data || []);
      }
    };

    fetchReservas();
  }, [selectedDate]);

  function estaReservado(
    canchaId: number,
    horaInicio: string,
    horaFin: string
  ): boolean {
    const fechaISO = format(selectedDate, "yyyy-MM-dd");
    return reservas.some(
      (reserva) =>
        reserva.cancha_id === canchaId &&
        reserva.fecha === fechaISO &&
        reserva.hora_inicio === horaInicio &&
        reserva.hora_fin === horaFin
    );
  }

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const diaSeleccionado = selectedDate.getDay();
  const sortedCanchas = [...canchas].sort((a, b) => a.numero - b.numero);
  const diasFuturos = Array.from({ length: 5 }, (_, i) =>
    addDays(new Date(), i)
  );

  const toggleExpand = (id: number) => {
    setExpandedCanchaIds((prev) =>
      prev.includes(id)
        ? prev.filter((canchaId) => canchaId !== id)
        : [...prev, id]
    );
  };

  return (
    <View>
      {loading ? (
        <Text>Cargando...</Text>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ padding: 10 }}
          >
            {diasFuturos.map((date, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDate(date)}
                style={{
                  backgroundColor:
                    selectedDate.toDateString() === date.toDateString()
                      ? "#4CAF50"
                      : "#e0e0e0",
                  borderRadius: 10,
                  padding: 10,
                  width: 90,
                  height: 60,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color:
                      selectedDate.toDateString() === date.toDateString()
                        ? "white"
                        : "black",
                  }}
                >
                  {diasSemana[date.getDay()]}
                  {"\n"}
                  {format(date, "dd/MM")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView>
            {sortedCanchas.map((cancha) => {
              const horarios = cancha.horario_disponible?.filter(
                (h) => h.dia_semana === diaSeleccionado
              );

              const isExpanded = expandedCanchaIds.includes(cancha.id);

              return (
                <View
                  key={cancha.id}
                  style={{
                    padding: 12,
                    marginVertical: 6,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 12,
                    marginHorizontal: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <TouchableOpacity onPress={() => toggleExpand(cancha.id)}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <IconSymbol
                          size={22}
                          color={"#4CAF50"}
                          name={
                            cancha.deporte === "fútbol"
                              ? "sportscourt.fill"
                              : cancha.deporte === "tenis"
                              ? "tennis.racket"
                              : "figure.tennis"
                          }
                        />
                        <Text style={{ fontSize: 16, fontWeight: "600" }}>
                          Cancha #{cancha.numero} -{" "}
                          {cancha.deporte.charAt(0).toUpperCase() +
                            cancha.deporte.substring(1)}
                        </Text>
                      </View>
                      <IconSymbol
                        size={20}
                        name={isExpanded ? "chevron.down" : "chevron.forward"}
                        color="#4CAF50"
                      />
                    </View>
                  </TouchableOpacity>

                  {isExpanded &&
                    (horarios && horarios.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 12,
                          justifyContent: "flex-start",
                        }}
                      >
                        {horarios.map((horario) => {
                          const isDisabled = estaReservado(
                            cancha.id,
                            horario.hora_inicio,
                            horario.hora_fin
                          );

                          return (
                            <TouchableOpacity
                              key={horario.id}
                              disabled={isDisabled}
                              style={{
                                backgroundColor: isDisabled
                                  ? "#e0e0e0"
                                  : "#4CAF50",
                                borderColor: isDisabled ? "#aaa" : "#388e3c",
                                borderWidth: 1,
                                borderRadius: 8,
                                paddingVertical: 14,
                                paddingHorizontal: 12,
                                opacity: isDisabled ? 1 : 1, // mantenemos 1 para que se vea bien
                              }}
                            >
                              <Pressable>
                                <Text
                                  style={{
                                    color: isDisabled ? "#888" : "#fff",
                                    fontWeight: "500",
                                    textDecorationLine: isDisabled
                                      ? "line-through"
                                      : "none",
                                  }}
                                >
                                  {horario.hora_inicio.substring(0, 5)} -{" "}
                                  {horario.hora_fin.substring(0, 5)}
                                </Text>
                              </Pressable>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : (
                      <Text
                        style={{
                          marginTop: 8,
                          fontStyle: "italic",
                          color: "#888",
                          textAlign: "center",
                        }}
                      >
                        No hay horarios disponibles
                      </Text>
                    ))}
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
}
