import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";
import { format, addDays } from "date-fns";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface CanchaProps {
  complejoId: string;
}

export function Cancha({ complejoId }: CanchaProps) {
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
  const [expandedCanchaIds, setExpandedCanchaIds] = useState<number[]>([]); // 🆕
  const [loading, setLoading] = useState(true);

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
      };

      fetchData();
      setLoading(false);
    }
  }, [complejoId]);

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

  //ordenar las canchas por número [...canchas] crea una copia del array original
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
    <View style={{}}>
      {/* Selector de días */}
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
                  width: 80,
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
                        {horarios.map((horario) => (
                          <TouchableOpacity
                            key={horario.id}
                            style={{
                              backgroundColor: "#4CAF50",
                              borderRadius: 8,
                              paddingVertical: 14,
                              paddingHorizontal: 12,
                            }}
                          >
                            <Text style={{ color: "white", fontWeight: "500" }}>
                              {horario.hora_inicio.substring(0, 5)} -{" "}
                              {horario.hora_fin.substring(0, 5)}
                            </Text>
                          </TouchableOpacity>
                        ))}
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
