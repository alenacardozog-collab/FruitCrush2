/**
 * FRUTA ATTACK: ILUSTRACIONES SVG VECTORIALES ESTILO HAND-DRAWN & ART ATTACK
 * Gráficos con trazos de lápiz, textura de crayón y recortes de papel.
 */

const FRUIT_TYPES = ['fresa', 'banana', 'sandia', 'limon', 'uva', 'naranja'];

const FRUIT_NAMES = {
  fresa: 'Frutilla',
  banana: 'Banana',
  sandia: 'Sandía',
  limon: 'Limón',
  uva: 'Uvas',
  naranja: 'Naranja'
};

const FruitGraphics = {
  // 1. Frutilla / Fresa (Crayón rojo con semillas y hojas dibujadas a mano)
  fresa: `
    <svg viewBox="0 0 100 100" class="fruit-svg svg-fresa">
      <defs>
        <filter id="crayon-fresa" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <!-- Sombra de papel cortado -->
      <path d="M50 88 C32 84, 18 64, 20 40 C22 28, 35 24, 50 26 C65 24, 78 28, 80 40 C82 64, 68 84, 50 88 Z" fill="rgba(0,0,0,0.12)" transform="translate(2,4)"/>
      <!-- Cuerpo de la fresa con textura -->
      <path d="M50 88 C32 84, 18 64, 20 40 C22 28, 35 24, 50 26 C65 24, 78 28, 80 40 C82 64, 68 84, 50 88 Z" 
            fill="#e63946" stroke="#2b2d42" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
      <!-- Brillo de lápiz pastel -->
      <path d="M30 42 C30 35, 38 32, 45 32" fill="none" stroke="#ffb4a2" stroke-width="3.5" stroke-linecap="round" />
      <!-- Semillas dibujadas a mano -->
      <ellipse cx="38" cy="48" rx="2.5" ry="4" fill="#fcbf49" stroke="#2b2d42" stroke-width="1.5" transform="rotate(-15 38 48)"/>
      <ellipse cx="62" cy="48" rx="2.5" ry="4" fill="#fcbf49" stroke="#2b2d42" stroke-width="1.5" transform="rotate(15 62 48)"/>
      <ellipse cx="50" cy="58" rx="2.5" ry="4" fill="#fcbf49" stroke="#2b2d42" stroke-width="1.5"/>
      <ellipse cx="36" cy="68" rx="2.5" ry="4" fill="#fcbf49" stroke="#2b2d42" stroke-width="1.5" transform="rotate(-10 36 68)"/>
      <ellipse cx="64" cy="68" rx="2.5" ry="4" fill="#fcbf49" stroke="#2b2d42" stroke-width="1.5" transform="rotate(10 64 68)"/>
      <ellipse cx="50" cy="76" rx="2" ry="3.5" fill="#fcbf49" stroke="#2b2d42" stroke-width="1.5"/>
      <!-- Corona de hojas garabateada -->
      <path d="M50 25 C45 10, 48 8, 50 6 C52 8, 55 10, 50 25" fill="none" stroke="#2b2d42" stroke-width="4" stroke-linecap="round"/>
      <path d="M30 28 C22 20, 20 12, 28 16 C36 20, 42 24, 50 26 C58 24, 64 20, 72 16 C80 12, 78 20, 70 28 C64 34, 36 34, 30 28 Z" 
            fill="#588157" stroke="#2b2d42" stroke-width="4" stroke-linejoin="round"/>
    </svg>
  `,

  // 2. Banana (Curvada con trazos de crayón amarillo y puntas marrones)
  banana: `
    <svg viewBox="0 0 100 100" class="fruit-svg svg-banana">
      <!-- Sombra de papel cortado -->
      <path d="M22 22 C38 18, 78 30, 84 66 C86 78, 76 86, 68 84 C48 80, 26 58, 22 22 Z" fill="rgba(0,0,0,0.12)" transform="translate(2,4)"/>
      <!-- Cuerpo de la banana -->
      <path d="M22 22 C38 18, 78 30, 84 66 C86 78, 76 86, 68 84 C48 80, 26 58, 22 22 Z" 
            fill="#ffd166" stroke="#2b2d42" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
      <!-- Faceta interna dibujada -->
      <path d="M26 26 C42 34, 68 46, 72 76" fill="none" stroke="#e09f3e" stroke-width="3" stroke-linecap="round" stroke-dasharray="4,2"/>
      <!-- Punta y tallo marrón de cartón -->
      <polygon points="18,16 26,20 22,25 15,20" fill="#6f4e37" stroke="#2b2d42" stroke-width="3"/>
      <circle cx="75" cy="80" r="4" fill="#6f4e37" stroke="#2b2d42" stroke-width="2.5"/>
      <!-- Resaltado blanco de tiza -->
      <path d="M38 24 C55 30, 72 45, 78 62" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    </svg>
  `,

  // 3. Sandía (Rodaja jugosa con corteza y semillas negras)
  sandia: `
    <svg viewBox="0 0 100 100" class="fruit-svg svg-sandia">
      <!-- Sombra -->
      <path d="M14 36 Q50 94 86 36 Z" fill="rgba(0,0,0,0.12)" transform="translate(2,4)"/>
      <!-- Corteza verde exterior -->
      <path d="M12 36 Q50 96 88 36 Z" fill="#2a9d8f" stroke="#2b2d42" stroke-width="4.5" stroke-linejoin="round"/>
      <!-- Franja blanca de corteza -->
      <path d="M16 37 Q50 90 84 37 Z" fill="#e9d8a6" stroke="#2b2d42" stroke-width="2.5"/>
      <!-- Pulpa roja de témpera -->
      <path d="M20 38 Q50 84 80 38 Z" fill="#e63946" stroke="#2b2d42" stroke-width="3.5"/>
      <!-- Trazos de semillas -->
      <circle cx="36" cy="50" r="3" fill="#2b2d42"/>
      <circle cx="50" cy="62" r="3" fill="#2b2d42"/>
      <circle cx="64" cy="50" r="3" fill="#2b2d42"/>
      <circle cx="44" cy="44" r="2.5" fill="#2b2d42"/>
      <circle cx="56" cy="44" r="2.5" fill="#2b2d42"/>
      <!-- Brillo de tiza blanca -->
      <path d="M28 40 Q50 64 72 40" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
    </svg>
  `,

  // 4. Limón (Con hojita verde y trazo de crayón amarillo brillante)
  limon: `
    <svg viewBox="0 0 100 100" class="fruit-svg svg-limon">
      <!-- Sombra -->
      <ellipse cx="50" cy="52" rx="38" ry="28" fill="rgba(0,0,0,0.12)" transform="rotate(-25 50 52) translate(2,4)"/>
      <!-- Hoja verde garabateada -->
      <path d="M50 24 C55 12, 70 14, 76 22 C68 30, 58 28, 50 24 Z" fill="#588157" stroke="#2b2d42" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M52 23 L70 20" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
      <!-- Cuerpo ovalado con extremos puntiagudos -->
      <path d="M20 38 C14 46, 16 58, 26 66 C42 80, 68 76, 80 62 C86 54, 84 42, 74 34 C58 20, 32 24, 20 38 Z" 
            fill="#ffea00" stroke="#2b2d42" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>
      <!-- Textura de puntitos de cáscara -->
      <circle cx="40" cy="45" r="1.5" fill="#d4a373"/>
      <circle cx="52" cy="42" r="1.5" fill="#d4a373"/>
      <circle cx="62" cy="52" r="1.5" fill="#d4a373"/>
      <circle cx="48" cy="58" r="1.5" fill="#d4a373"/>
      <circle cx="34" cy="55" r="1.5" fill="#d4a373"/>
      <!-- Brillo de lápiz -->
      <path d="M30 40 C36 32, 54 30, 66 38" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>
    </svg>
  `,

  // 5. Uvas (Racimo de burbujas moradas con hojita y zarcillo)
  uva: `
    <svg viewBox="0 0 100 100" class="fruit-svg svg-uva">
      <!-- Sombra -->
      <path d="M32 44 Q50 90 68 44 Z" fill="rgba(0,0,0,0.12)" transform="translate(2,4)"/>
      <!-- Tallo y zarcillo de alambre/lápiz -->
      <path d="M50 24 C48 14, 52 10, 50 6" fill="none" stroke="#6f4e37" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M50 16 C58 12, 62 18, 66 14" fill="none" stroke="#588157" stroke-width="2.5" stroke-linecap="round"/>
      <!-- Granos individuales con trazo de tinta -->
      <circle cx="40" cy="38" r="13" fill="#7209b7" stroke="#2b2d42" stroke-width="3.5"/>
      <circle cx="60" cy="38" r="13" fill="#7209b7" stroke="#2b2d42" stroke-width="3.5"/>
      <circle cx="32" cy="56" r="12" fill="#560bad" stroke="#2b2d42" stroke-width="3.5"/>
      <circle cx="50" cy="54" r="13" fill="#7209b7" stroke="#2b2d42" stroke-width="3.5"/>
      <circle cx="68" cy="56" r="12" fill="#560bad" stroke="#2b2d42" stroke-width="3.5"/>
      <circle cx="42" cy="72" r="11" fill="#7209b7" stroke="#2b2d42" stroke-width="3.5"/>
      <circle cx="58" cy="72" r="11" fill="#560bad" stroke="#2b2d42" stroke-width="3.5"/>
      <circle cx="50" cy="85" r="9" fill="#7209b7" stroke="#2b2d42" stroke-width="3.5"/>
      <!-- Destellos de luz -->
      <circle cx="37" cy="35" r="3" fill="#b5179e" opacity="0.8"/>
      <circle cx="47" cy="51" r="3" fill="#b5179e" opacity="0.8"/>
      <circle cx="47" cy="82" r="2" fill="#b5179e" opacity="0.8"/>
    </svg>
  `,

  // 6. Naranja (Rodaja o fruta entera con trazos de sol y hoja)
  naranja: `
    <svg viewBox="0 0 100 100" class="fruit-svg svg-naranja">
      <!-- Sombra -->
      <circle cx="50" cy="50" r="36" fill="rgba(0,0,0,0.12)" transform="translate(2,4)"/>
      <!-- Hoja verde -->
      <path d="M50 20 C60 10, 72 12, 70 24 C62 26, 56 22, 50 20 Z" fill="#588157" stroke="#2b2d42" stroke-width="3" stroke-linejoin="round"/>
      <path d="M50 20 L48 14" stroke="#6f4e37" stroke-width="3.5" stroke-linecap="round"/>
      <!-- Cuerpo circular de la naranja -->
      <circle cx="50" cy="54" r="35" fill="#f77f00" stroke="#2b2d42" stroke-width="4.5"/>
      <!-- Detalle de gajo interno de papel cortado -->
      <circle cx="50" cy="54" r="28" fill="#fcbf49" stroke="#2b2d42" stroke-width="2.5" stroke-dasharray="6,4"/>
      <!-- Radios de gajos dibujados a mano -->
      <line x1="50" y1="54" x2="50" y2="28" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="54" x2="72" y2="40" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="54" x2="72" y2="68" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="54" x2="50" y2="80" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="54" x2="28" y2="68" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="54" x2="28" y2="40" stroke="#2b2d42" stroke-width="2" stroke-linecap="round"/>
      <circle cx="50" cy="54" r="5" fill="#fff" stroke="#2b2d42" stroke-width="2"/>
    </svg>
  `,

  // 7. Fruta Especial: Paleta de Pintura Arcoíris (5 en línea)
  rainbowPalette: `
    <svg viewBox="0 0 100 100" class="fruit-svg svg-rainbow-palette">
      <!-- Sombra de la paleta -->
      <path d="M48 16 C76 16, 90 34, 90 56 C90 76, 76 90, 52 90 C34 90, 14 78, 14 54 C14 32, 28 16, 48 16 Z" fill="rgba(0,0,0,0.18)" transform="translate(3,4)"/>
      <!-- Paleta de madera con orificio para el dedo -->
      <path d="M48 16 C76 16, 90 34, 90 56 C90 76, 76 90, 52 90 C34 90, 14 78, 14 54 C14 32, 28 16, 48 16 Z" 
            fill="#d4a373" stroke="#2b2d42" stroke-width="4.5" stroke-linejoin="round"/>
      <!-- Orificio para el dedo -->
      <circle cx="70" cy="68" r="9" fill="#f7ede2" stroke="#2b2d42" stroke-width="3"/>
      <!-- Manchas de témpera de colores vibrantes -->
      <circle cx="32" cy="34" r="8" fill="#e63946" stroke="#2b2d42" stroke-width="2.5"/>
      <circle cx="52" cy="26" r="8" fill="#f77f00" stroke="#2b2d42" stroke-width="2.5"/>
      <circle cx="72" cy="34" r="8" fill="#ffea00" stroke="#2b2d42" stroke-width="2.5"/>
      <circle cx="28" cy="54" r="8" fill="#2a9d8f" stroke="#2b2d42" stroke-width="2.5"/>
      <circle cx="38" cy="74" r="8" fill="#0077b6" stroke="#2b2d42" stroke-width="2.5"/>
      <circle cx="56" cy="78" r="7" fill="#7209b7" stroke="#2b2d42" stroke-width="2.5"/>
      <!-- Pincel atravesado con cerdas mágicas -->
      <path d="M20 86 L80 18" stroke="#6f4e37" stroke-width="5" stroke-linecap="round"/>
      <path d="M80 18 L86 12" stroke="#e63946" stroke-width="6" stroke-linecap="round"/>
    </svg>
  `
};

// Función auxiliar para obtener el HTML SVG de cualquier fruta o especial
function getFruitSVG(type, specialType = null) {
  if (specialType === 'rainbow') {
    return FruitGraphics.rainbowPalette;
  }
  return FruitGraphics[type] || FruitGraphics.fresa;
}
