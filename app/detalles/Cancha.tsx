import { ScrollView, View, Text } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "@/supabase/supabase";

interface CanchaProps {
  complejoId: number;
}

export function Cancha({ complejoId }: CanchaProps) {
  interface HorarioDisponible {
    id: string;
    dia_semana: number;
    hora_inicio: string;
    hora_fin: string;
  }

  interface Cancha {
    id: string;
    numero: number;
    horario_disponible?: HorarioDisponible[];
  }

  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const diaActual = new Date().getDay();

  useEffect(() => {
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
  }, [complejoId]);
  console.log(new Date());
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
    <ScrollView>
      <Text style={{ fontSize: 18, fontWeight: "bold", padding: 10 }}>
        Horarios para hoy: {diasSemana[diaActual]}
      </Text>
      {canchas.map((cancha) => {
        const horariosHoy = cancha.horario_disponible?.filter(
          (horario) => horario.dia_semana === diaActual
        );

        return (
          <View key={cancha.id} style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: "bold" }}>Cancha #{cancha.numero}</Text>
            {horariosHoy && horariosHoy.length > 0 ? (
              horariosHoy.map((horario) => (
                <Text key={horario.id}>
                  {horario.hora_inicio.substring(0, 5)} a{" "}
                  {horario.hora_fin.substring(0, 5)}
                </Text>
              ))
            ) : (
              <Text>No hay horarios para hoy</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
