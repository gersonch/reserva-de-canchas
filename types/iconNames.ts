export const iconNames = {
  user: "person.circle.fill",
  settings: "gearshape.fill",
  logout: "arrow.right.square",
  complejo: "building.2.crop.circle",
  favoritos: "star.circle.fill",
  reservas: "calendar",
  ayuda: "questionmark.circle",
  cancha: "sportscourt.fill",
  pagos: "creditcard.fill",
  calendar: "calendar",
  // Agrega más íconos válidos aquí
} as const;

export type IconName = keyof typeof iconNames;
