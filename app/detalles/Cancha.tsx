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
            {canchas.map((cancha) => {
              const horarios = cancha.horario_disponible?.filter(
                (h) => h.dia_semana === diaSeleccionado
              );

              const isExpanded = expandedCanchaIds.includes(cancha.id);

              return (
                <View
                  key={cancha.id}
                  style={{
                    padding: 10,
                    width: "100%",
                  }}
                >
                  <TouchableOpacity onPress={() => toggleExpand(cancha.id)}>
                    <Text
                      style={{
                        marginBottom: 8,
                        paddingVertical: 10,
                        fontSize: 16,
                        width: "90%",
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(0, 0, 0, 0.2)",
                        alignSelf: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingVertical: 10,
                          width: "100%",
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>
                          Cancha #{cancha.numero}
                        </Text>
                        <IconSymbol
                          size={20}
                          name={isExpanded ? "chevron.down" : "chevron.forward"}
                          color="black"
                        />
                      </View>
                    </Text>
                  </TouchableOpacity>

                  {isExpanded &&
                    (horarios && horarios.length > 0 ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 8,
                          alignSelf: "center",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {horarios.map((horario) => (
                          <TouchableOpacity
                            key={horario.id}
                            style={{
                              backgroundColor: "#ccc",
                              borderRadius: 8,
                              paddingVertical: 6,
                              paddingHorizontal: 12,
                              marginRight: 6,
                              marginBottom: 6,
                            }}
                          >
                            <Text>
                              {horario.hora_inicio.substring(0, 5)} -{" "}
                              {horario.hora_fin.substring(0, 5)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : (
                      <Text style={{ marginTop: 4 }}>
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
