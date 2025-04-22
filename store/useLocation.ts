import { create } from "zustand";

interface LocationState {
  city: string | null;
  setCity: (city: string | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  city: null, // Estado inicial
  setCity: (city) => set({ city }), // Función para actualizar la ciudad
}));
