/**
 * FRUTA ATTACK: CONFIGURACIÓN DE MUNDOS, PLATAFORMAS Y 20 NIVELES
 */

const WORLDS_CONFIG = [
  {
    id: 1,
    name: "Taller de Cartón",
    subtitle: "Plataforma 1 · Dificultad Fácil",
    badgeClass: "tag-easy",
    icon: "📦",
    description: "Aprende los trazos básicos, haz combinaciones y suma puntos.",
    color: "#2a9d8f",
    levelRange: [1, 5]
  },
  {
    id: 2,
    name: "Isla de Papel Maché",
    subtitle: "Plataforma 2 · Dificultad Media",
    badgeClass: "tag-medium",
    icon: "🏝️",
    description: "Recolecta cuotas de frutas y desata poderes especiales.",
    color: "#0077b6",
    levelRange: [6, 10]
  },
  {
    id: 3,
    name: "Torre de Plastilina",
    subtitle: "Plataforma 3 · Dificultad Difícil",
    badgeClass: "tag-hard",
    icon: "🏔️",
    description: "Limpia las manchas pegajosas de pegamento en el tablero.",
    color: "#f77f00",
    levelRange: [11, 15]
  },
  {
    id: 4,
    name: "Gran Castillo Art Attack",
    subtitle: "Plataforma 4 · Dificultad Experto",
    badgeClass: "tag-expert",
    icon: "🏰",
    description: "El reto final de los maestros del arte: objetivos múltiples y alta precisión.",
    color: "#e63946",
    levelRange: [16, 20]
  }
];

const GAME_LEVELS = [
  // ==========================================
  // MUNDO 1: TALLER DE CARTÓN (FÁCIL)
  // ==========================================
  {
    id: 1,
    worldId: 1,
    name: "Primeros Trazos",
    description: "¡Consigue 800 puntos uniendo frutas!",
    type: "score",
    rows: 7,
    cols: 7,
    fruits: ['fresa', 'banana', 'sandia', 'limon'],
    moves: 20,
    targetScore: 800,
    starThresholds: [800, 1500, 2400],
    gluePattern: []
  },
  {
    id: 2,
    worldId: 1,
    name: "Corta y Pega",
    description: "¡Suma 1200 puntos con una fruta extra!",
    type: "score",
    rows: 7,
    cols: 7,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva'],
    moves: 20,
    targetScore: 1200,
    starThresholds: [1200, 2200, 3500],
    gluePattern: []
  },
  {
    id: 3,
    worldId: 1,
    name: "Festival de Fresas",
    description: "Recolecta 12 ricas frutillas",
    type: "collect",
    rows: 7,
    cols: 7,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva'],
    moves: 18,
    collectTargets: { fresa: 12 },
    starThresholds: [1000, 2000, 3200],
    gluePattern: []
  },
  {
    id: 4,
    worldId: 1,
    name: "Boceto Frutal",
    description: "Junta 15 bananas y 10 limones",
    type: "collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva'],
    moves: 22,
    collectTargets: { banana: 15, limon: 10 },
    starThresholds: [1500, 2800, 4200],
    gluePattern: []
  },
  {
    id: 5,
    worldId: 1,
    name: "Graduación de Cartón",
    description: "Junta 12 sandías y logra 2500 puntos",
    type: "multi",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 22,
    collectTargets: { sandia: 12 },
    targetScore: 2500,
    starThresholds: [2500, 4000, 5800],
    gluePattern: []
  },

  // ==========================================
  // MUNDO 2: ISLA DE PAPEL MACHÉ (MEDIO)
  // ==========================================
  {
    id: 6,
    worldId: 2,
    name: "Capas de Papel",
    description: "Recolecta 16 uvas y 16 fresas",
    type: "collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'limon', 'uva', 'naranja'],
    moves: 22,
    collectTargets: { uva: 16, fresa: 16 },
    starThresholds: [2000, 3500, 5000],
    gluePattern: []
  },
  {
    id: 7,
    worldId: 2,
    name: "Pinceladas Jugosas",
    description: "Junta 18 limones y 14 bananas",
    type: "collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'naranja'],
    moves: 20,
    collectTargets: { limon: 18, banana: 14 },
    starThresholds: [2200, 3800, 5500],
    gluePattern: []
  },
  {
    id: 8,
    worldId: 2,
    name: "Explosión de Témpera",
    description: "Consigue 4000 puntos usando combos",
    type: "score",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 22,
    targetScore: 4000,
    starThresholds: [4000, 6000, 8500],
    gluePattern: []
  },
  {
    id: 9,
    worldId: 2,
    name: "Cesta Tropical",
    description: "Recolecta 15 sandías, 15 naranjas y 15 uvas",
    type: "collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'uva', 'naranja'],
    moves: 25,
    collectTargets: { sandia: 15, naranja: 15, uva: 15 },
    starThresholds: [2800, 4800, 7000],
    gluePattern: []
  },
  {
    id: 10,
    worldId: 2,
    name: "Marea de Acuarela",
    description: "¡Desafío! Junta 22 fresas y alcanza 4500 puntos",
    type: "multi",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 22,
    collectTargets: { fresa: 22 },
    targetScore: 4500,
    starThresholds: [4500, 7000, 9500],
    gluePattern: []
  },

  // ==========================================
  // MUNDO 3: TORRE DE PLASTILINA (DIFÍCIL)
  // ==========================================
  {
    id: 11,
    worldId: 3,
    name: "Manchas Pegajosas",
    description: "Limpia las 8 casillas con pegamento",
    type: "glue",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva'],
    moves: 22,
    starThresholds: [2000, 3800, 5600],
    gluePattern: [
      [2,2], [2,5], [3,3], [3,4],
      [4,3], [4,4], [5,2], [5,5]
    ]
  },
  {
    id: 12,
    worldId: 3,
    name: "Pegamento Doble",
    description: "Limpia 12 casillas de pegamento",
    type: "glue",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 22,
    starThresholds: [2500, 4500, 6500],
    gluePattern: [
      [1,3], [1,4], [2,2], [2,5],
      [3,1], [3,6], [4,1], [4,6],
      [5,2], [5,5], [6,3], [6,4]
    ]
  },
  {
    id: 13,
    worldId: 3,
    name: "Laberinto de Goma",
    description: "Limpia 14 manchas de pegamento y junta 15 uvas",
    type: "glue_and_collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 23,
    collectTargets: { uva: 15 },
    starThresholds: [3000, 5200, 7500],
    gluePattern: [
      [2,1], [2,2], [2,5], [2,6],
      [3,3], [3,4], [4,3], [4,4],
      [5,1], [5,2], [5,5], [5,6],
      [6,3], [6,4]
    ]
  },
  {
    id: 14,
    worldId: 3,
    name: "Plastilina Firme",
    description: "Limpia 16 casillas de pegamento y junta 18 sandías",
    type: "glue_and_collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 24,
    collectTargets: { sandia: 18 },
    starThresholds: [3500, 5800, 8200],
    gluePattern: [
      [1,1], [1,6], [2,2], [2,5],
      [3,3], [3,4], [4,3], [4,4],
      [5,2], [5,5], [6,1], [6,6],
      [0,3], [0,4], [7,3], [7,4]
    ]
  },
  {
    id: 15,
    worldId: 3,
    name: "Torre Conquistada",
    description: "Limpia 18 casillas de pegamento y logra 5000 puntos",
    type: "glue_and_score",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 24,
    targetScore: 5000,
    starThresholds: [5000, 7500, 10500],
    gluePattern: [
      [2,2], [2,3], [2,4], [2,5],
      [3,2], [3,5], [4,2], [4,5],
      [5,2], [5,3], [5,4], [5,5],
      [1,3], [1,4], [6,3], [6,4],
      [3,3], [4,4]
    ]
  },

  // ==========================================
  // MUNDO 4: EL GRAN CASTILLO ART ATTACK (EXPERTO)
  // ==========================================
  {
    id: 16,
    worldId: 4,
    name: "Muros del Castillo",
    description: "Limpia 16 casillas y junta 20 ricas fresas",
    type: "glue_and_collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 22,
    collectTargets: { fresa: 20 },
    starThresholds: [4000, 6800, 9500],
    gluePattern: [
      [0,0], [0,7], [1,1], [1,6],
      [2,2], [2,5], [3,3], [3,4],
      [4,3], [4,4], [5,2], [5,5],
      [6,1], [6,6], [7,0], [7,7]
    ]
  },
  {
    id: 17,
    worldId: 4,
    name: "Torbellino de Colores",
    description: "Recolecta 22 limones, 22 bananas y logra 5500 pts",
    type: "multi",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 22,
    collectTargets: { limon: 22, banana: 22 },
    targetScore: 5500,
    starThresholds: [5500, 8500, 12000],
    gluePattern: []
  },
  {
    id: 18,
    worldId: 4,
    name: "Salón de Esculturas",
    description: "Limpia 20 casillas de pegamento con movimientos reducidos",
    type: "glue",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 20,
    starThresholds: [4500, 7500, 11000],
    gluePattern: [
      [1,2], [1,3], [1,4], [1,5],
      [2,1], [2,6], [3,1], [3,6],
      [4,1], [4,6], [5,1], [5,6],
      [6,2], [6,3], [6,4], [6,5],
      [3,3], [3,4], [4,3], [4,4]
    ]
  },
  {
    id: 19,
    worldId: 4,
    name: "Desafío del Maestro",
    description: "Limpia 22 manchas de pegamento y junta 25 uvas",
    type: "glue_and_collect",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 24,
    collectTargets: { uva: 25 },
    starThresholds: [6000, 9500, 13500],
    gluePattern: [
      [1,1], [1,2], [1,5], [1,6],
      [2,2], [2,3], [2,4], [2,5],
      [3,1], [3,3], [3,4], [3,6],
      [4,1], [4,3], [4,4], [4,6],
      [5,2], [5,3], [5,4], [5,5],
      [6,1], [6,6]
    ]
  },
  {
    id: 20,
    worldId: 4,
    name: "La Gran Obra Maestra",
    description: "Limpia 24 casillas, junta 25 fresas, 25 sandías y 8000 pts",
    type: "master",
    rows: 8,
    cols: 8,
    fruits: ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'],
    moves: 25,
    collectTargets: { fresa: 25, sandia: 25 },
    targetScore: 8000,
    starThresholds: [8000, 12000, 17000],
    gluePattern: [
      [0,2], [0,5], [1,1], [1,6],
      [2,0], [2,7], [3,2], [3,3], [3,4], [3,5],
      [4,2], [4,3], [4,4], [4,5],
      [5,0], [5,7], [6,1], [6,6],
      [7,2], [7,5], [2,2], [2,5], [5,2], [5,5]
    ]
  }
];
