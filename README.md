# 🍓 Fruta Attack: El Taller Mágico 🎨✂️

Un adictivo juego de **Match-3** inspirado en **Candy Crush**, ambientado en el entrañable y creativo universo de **Art Attack** con una estética **Hand-Drawn** artesanal (cartón corrugado, recortes de papel, cinta adhesiva, crayones y témperas).

![Fruta Attack](https://img.shields.io/badge/Estilo-Art%20Attack-f77f00?style=for-the-badge)
![Tecnología](https://img.shields.io/badge/Tecnología-HTML5%20%7C%20CSS3%20%7C%20JavaScript-2a9d8f?style=for-the-badge)
![Niveles](https://img.shields.io/badge/Niveles-20%20en%204%20Mundos-e63946?style=for-the-badge)

---

## ✨ Características Principales

- **🎨 Estética Hecha a Mano (Art Attack)**:
  - Textura de cartón corrugado realista en CSS.
  - Frutas vectoriales SVG con trazos imperfectos de crayón, lápiz y acuarela:
    - 🍓 **Frutilla / Fresa**: Semillas doradas y corona de hojas garabateadas.
    - 🍌 **Banana**: Curvada con trazo de fibra y manchas marrones.
    - 🍉 **Sandía**: Rodaja jugosa con corteza y semillas negras.
    - 🍋 **Limón**: Trazos amarillos con destellos de tiza y hoja verde.
    - 🍇 **Uvas**: Racimo de burbujas moradas con zarcillo de lápiz.
    - 🍊 **Naranja**: Con gajos interiores visibles.
  - Efectos físicos de confeti de papel picado, salpicaduras de témpera y pinceladas.

- **🗺️ 4 Plataformas de Mundos y 20 Niveles**:
  - **📦 Plataforma 1: Taller de Cartón (Fácil - Niveles 1 al 5)**: Trazos básicos, puntuaciones y movimientos holgados.
  - **🏝️ Plataforma 2: Isla de Papel Maché (Medio - Niveles 6 al 10)**: Cuotas específicas de recolección de frutas.
  - **🏔️ Plataforma 3: Torre de Plastilina (Difícil - Niveles 11 al 15)**: Casillas con manchas de pegamento que se deben despejar.
  - **🏰 Plataforma 4: Gran Castillo de Art Attack (Experto - Niveles 16 al 20)**: Multiobjetivos simultáneos con movimientos estrictos.

- **🖌️ Frutas Especiales**:
  - **Fruta Rayada / Pincelada Mágica** (4 en línea): Despeja filas o columnas con un trazo de témpera.
  - **Bomba de Pintura** (Forma T / L): Explota en un área de 3x3 salpicando colores.
  - **Paleta Arcoíris** (5 en línea): Pinta y elimina todas las frutas del color elegido.
  - **Doble Paleta Arcoíris**: ¡Limpieza total del tablero con lluvia de confeti!

- **✂️ Caja de Herramientas del Artista**:
  - ✂️ **Tijeras**: Corta y elimina cualquier fruta u obstáculo del tablero.
  - 🖌️ **Pincel**: Intercambia dos frutas cualesquiera sin match requerido.
  - 🎨 **Mezcla**: Reordena y baraja todo el tablero.

- **🔊 Audio Procedural (Web Audio API)**:
  - Sonidos sintetizados en tiempo real (pops, deslizamientos, acordes por combo, explosiones de témpera y fanfarria triunfal). ¡Cero descargas de archivos de audio externos!

- **💾 Guardado Automático**:
  - Progreso, niveles desbloqueados y récord de estrellas (1 a 3 ⭐) persistidos en `localStorage`.

---

## 🚀 Cómo Jugar

1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/alenacardozog-collab/FruitCrush.git
   ```
2. Abre `index.html` en cualquier navegador web moderno (Chrome, Edge, Firefox, Safari).
3. ¡No requiere Node.js, servidores ni dependencias externas!

---

## 🛠️ Estructura del Proyecto

```
├── index.html              # Estructura principal y pantallas del juego
├── css/
│   ├── main.css            # Estilos generales, texturas de cartón y modales
│   ├── map.css             # Mapa de mundos y selección de niveles
│   └── game.css            # Tablero Match-3, fichas y herramientas
├── js/
│   ├── audio.js            # Motor de audio procedural Web Audio API
│   ├── fruitSVGs.js        # Ilustraciones vectoriales de frutas hechas a mano
│   ├── levels.js           # Configuración de los 4 mundos y 20 niveles
│   ├── engine.js           # Lógica Match-3, cascadas y frutas especiales
│   └── app.js              # Controlador del juego, HUD y partículas
└── README.md
```

---

Hecho con tijeras, témpera, papel y mucha imaginación ✨
