/**
 * FRUTA ATTACK: MOTOR DE MATCH-3
 * Lógica de tablero, detección de patrones (3, 4, 5, T/L), combos en cascada,
 * frutas especiales (Pincel, Bomba, Paleta Arcoíris) y obstáculos de pegamento.
 */

class Match3Engine {
  constructor(options = {}) {
    this.rows = options.rows || 8;
    this.cols = options.cols || 8;
    this.allowedFruits = options.fruits || ['fresa', 'banana', 'sandia', 'limon'];
    this.gluePattern = options.gluePattern || [];
    
    // Callbacks
    this.onScore = options.onScore || (() => {});
    this.onCollect = options.onCollect || (() => {});
    this.onGlueCleaned = options.onGlueCleaned || (() => {});
    this.onSpecialTriggered = options.onSpecialTriggered || (() => {});
    this.onCombo = options.onCombo || (() => {});
    this.onBoardUpdate = options.onBoardUpdate || (() => {});
    
    this.grid = [];
    this.glueGrid = [];
    this.isProcessing = false;
    this.comboCount = 0;
    this.tileIdCounter = 1;
    
    this.initBoard();
  }

  // Inicializa el tablero asegurando que no haya 3-en-línea iniciales
  initBoard() {
    this.grid = [];
    this.glueGrid = [];

    // Matriz de pegamento
    for (let r = 0; r < this.rows; r++) {
      this.glueGrid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.glueGrid[r][c] = false;
      }
    }
    this.gluePattern.forEach(([r, c]) => {
      if (r < this.rows && c < this.cols) {
        this.glueGrid[r][c] = true;
      }
    });

    // Llenar tablero sin matches iniciales
    for (let r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.cols; c++) {
        let validFruit;
        let attempts = 0;
        do {
          validFruit = this.getRandomFruit();
          attempts++;
        } while (attempts < 50 && this.causesInitialMatch(r, c, validFruit));

        this.grid[r][c] = {
          id: this.tileIdCounter++,
          type: validFruit,
          special: null // 'striped_h', 'striped_v', 'bomb', 'rainbow'
        };
      }
    }

    // Verificar si hay movimientos disponibles desde el inicio
    if (!this.hasPossibleMoves()) {
      this.shuffleBoard(false);
    }
  }

  getRandomFruit() {
    return this.allowedFruits[Math.floor(Math.random() * this.allowedFruits.length)];
  }

  causesInitialMatch(r, c, fruit) {
    // Horizontal
    if (c >= 2 && this.grid[r][c - 1]?.type === fruit && this.grid[r][c - 2]?.type === fruit) {
      return true;
    }
    // Vertical
    if (r >= 2 && this.grid[r - 1][c]?.type === fruit && this.grid[r - 2][c]?.type === fruit) {
      return true;
    }
    return false;
  }

  // Comprueba si dos celdas son adyacentes ortogonalmente
  isAdjacent(r1, c1, r2, c2) {
    const dr = Math.abs(r1 - r2);
    const dc = Math.abs(c1 - c2);
    return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
  }

  // Intento de intercambio
  async trySwap(r1, c1, r2, c2) {
    if (this.isProcessing) return { success: false, reason: 'busy' };
    if (!this.isAdjacent(r1, c1, r2, c2)) return { success: false, reason: 'not_adjacent' };

    const tile1 = this.grid[r1][c1];
    const tile2 = this.grid[r2][c2];
    if (!tile1 || !tile2) return { success: false, reason: 'invalid_tile' };

    this.isProcessing = true;
    this.comboCount = 0;

    try {
      // Caso especial 1: Intercambio con Paleta Arcoíris
      if (tile1.special === 'rainbow' || tile2.special === 'rainbow') {
        // Si ambos son arcoíris -> ¡Limpieza completa del tablero!
        if (tile1.special === 'rainbow' && tile2.special === 'rainbow') {
          await this.triggerDoubleRainbow(r1, c1, r2, c2);
          return { success: true, isSpecial: true };
        }

        // Un arcoíris y una fruta normal/especial
        const rainbowPos = tile1.special === 'rainbow' ? { r: r1, c: c1 } : { r: r2, c: c2 };
        const targetPos = tile1.special === 'rainbow' ? { r: r2, c: c2 } : { r: r1, c: c1 };
        const targetTile = this.grid[targetPos.r][targetPos.c];
        const targetType = targetTile ? targetTile.type : this.getRandomFruit();

        await this.triggerRainbowSwap(rainbowPos.r, rainbowPos.c, targetType);
        return { success: true, isSpecial: true };
      }

      // Caso especial 2: Intercambio entre dos frutas especiales (Rayada + Rayada, Rayada + Bomba, Bomba + Bomba)
      if (tile1.special && tile2.special) {
        await this.triggerSpecialCombo(r1, c1, r2, c2);
        return { success: true, isSpecial: true };
      }

      // Intercambio simulado
      this.swapTiles(r1, c1, r2, c2);
      const matches = this.findMatches();

      if (matches.length === 0) {
        // No hay coincidencia -> revertir
        this.swapTiles(r1, c1, r2, c2);
        return { success: false, reason: 'no_match' };
      }

      // Movimiento exitoso: resolver matches y cascada
      await this.processMatchesAndCascades(matches, { r1, c1, r2, c2 });
      return { success: true };
    } catch (err) {
      console.error("Error en trySwap:", err);
      return { success: false, reason: 'error' };
    } finally {
      this.isProcessing = false;
    }
  }

  swapTiles(r1, c1, r2, c2) {
    const temp = this.grid[r1][c1];
    this.grid[r1][c1] = this.grid[r2][c2];
    this.grid[r2][c2] = temp;
  }

  // Búsqueda exhaustiva de combinaciones de 3 o más en filas y columnas
  findMatches() {
    const matchedSets = [];

    // Horizontales
    for (let r = 0; r < this.rows; r++) {
      let matchLength = 1;
      for (let c = 0; c < this.cols; c++) {
        const checkNext = c < this.cols - 1 &&
          this.grid[r][c] &&
          this.grid[r][c + 1] &&
          this.grid[r][c].type === this.grid[r][c + 1].type &&
          this.grid[r][c].special !== 'rainbow' &&
          this.grid[r][c + 1].special !== 'rainbow';

        if (checkNext) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            const set = [];
            for (let i = 0; i < matchLength; i++) {
              set.push({ r, c: c - i, type: this.grid[r][c - i].type });
            }
            matchedSets.push(set);
          }
          matchLength = 1;
        }
      }
    }

    // Verticales
    for (let c = 0; c < this.cols; c++) {
      let matchLength = 1;
      for (let r = 0; r < this.rows; r++) {
        const checkNext = r < this.rows - 1 &&
          this.grid[r][c] &&
          this.grid[r + 1][c] &&
          this.grid[r][c].type === this.grid[r + 1][c].type &&
          this.grid[r][c].special !== 'rainbow' &&
          this.grid[r + 1][c].special !== 'rainbow';

        if (checkNext) {
          matchLength++;
        } else {
          if (matchLength >= 3) {
            const set = [];
            for (let i = 0; i < matchLength; i++) {
              set.push({ r: r - i, c, type: this.grid[r - i][c].type });
            }
            matchedSets.push(set);
          }
          matchLength = 1;
        }
      }
    }

    return matchedSets;
  }

  // Proceso iterativo de eliminación de matches, creación de especiales y cascadas
  async processMatchesAndCascades(initialMatches, swapInfo = null) {
    let currentMatches = initialMatches;

    while (currentMatches.length > 0) {
      this.comboCount++;
      this.onCombo(this.comboCount);

      // Agrupar todas las celdas afectadas y determinar creación de especiales
      const cellsToDestroy = new Map(); // key "r,c" -> { r, c, tile }
      const newSpecials = []; // { r, c, type, special }

      // Analizar cada conjunto coincidente para crear frutas especiales
      for (const set of currentMatches) {
        const len = set.length;
        const fruitType = set[0].type;

        // Determinar celda pivote para el especial
        let pivot = set[0];
        if (swapInfo) {
          const matchWithSwap = set.find(p => 
            (p.r === swapInfo.r1 && p.c === swapInfo.c1) || 
            (p.r === swapInfo.r2 && p.c === swapInfo.c2)
          );
          if (matchWithSwap) pivot = matchWithSwap;
        }

        if (len >= 5) {
          // 5 en línea -> Paleta Arcoíris
          newSpecials.push({ r: pivot.r, c: pivot.c, type: fruitType, special: 'rainbow' });
        } else if (len === 4) {
          // 4 en línea -> Fruta Rayada (Pincelada Horizontal o Vertical)
          const isHorizontal = set[0].r === set[1].r;
          const specialType = isHorizontal ? 'striped_v' : 'striped_h';
          newSpecials.push({ r: pivot.r, c: pivot.c, type: fruitType, special: specialType });
        }

        for (const item of set) {
          const key = `${item.r},${item.c}`;
          if (!cellsToDestroy.has(key)) {
            cellsToDestroy.set(key, { r: item.r, c: item.c, tile: this.grid[item.r][item.c] });
          }
        }
      }

      // Detectar intersecciones (Formas de T o L) para Bomba de Pintura
      if (currentMatches.length > 1) {
        const intersection = this.findIntersection(currentMatches);
        if (intersection && !newSpecials.some(s => s.special === 'rainbow')) {
          newSpecials.push({
            r: intersection.r,
            c: intersection.c,
            type: intersection.type,
            special: 'bomb'
          });
        }
      }

      // Activar efectos de cualquier especial que esté siendo destruido
      const expandedDestruction = new Map(cellsToDestroy);
      for (const [key, val] of cellsToDestroy) {
        if (val.tile && val.tile.special) {
          this.expandSpecialEffect(val.r, val.c, val.tile.special, expandedDestruction);
        }
      }

      // Contabilizar frutas recolectadas, pegamento limpiado y puntos
      const collectedCounts = {};
      let glueCleanedCount = 0;
      let pointsGained = 0;

      for (const [key, item] of expandedDestruction) {
        const { r, c, tile } = item;
        if (!tile) continue;

        // Recolección
        collectedCounts[tile.type] = (collectedCounts[tile.type] || 0) + 1;

        // Pegamento
        if (this.glueGrid[r][c]) {
          this.glueGrid[r][c] = false;
          glueCleanedCount++;
        }

        // Puntos base con multiplicador de combo
        pointsGained += 50 * this.comboCount;

        // Limpiar celda
        this.grid[r][c] = null;
      }

      if (glueCleanedCount > 0) {
        this.onGlueCleaned(glueCleanedCount);
      }

      this.onCollect(collectedCounts);
      this.onScore(pointsGained);

      // Crear las nuevas frutas especiales acordadas
      for (const sp of newSpecials) {
        this.grid[sp.r][sp.c] = {
          id: this.tileIdCounter++,
          type: sp.type,
          special: sp.special
        };
        this.onSpecialTriggered(sp.special, sp.r, sp.c);
      }

      // Notificar animación de destrucción / match
      this.onBoardUpdate({ type: 'match', cells: Array.from(expandedDestruction.values()) });

      // Pausa visual para animación de destrucción y sonido
      await this.sleep(260);

      // Aplicar gravedad (caída) y relleno desde arriba
      await this.applyGravity();

      // Notificar tablero tras caída
      this.onBoardUpdate({ type: 'drop' });

      // Pausa visual para la caída
      await this.sleep(200);

      // Reset de swapInfo para las cascadas subsiguientes
      swapInfo = null;

      // Buscar nuevos matches por la caída
      currentMatches = this.findMatches();
    }

    // Al terminar la cascada, comprobar si quedaron movimientos válidos
    if (!this.hasPossibleMoves()) {
      this.shuffleBoard(true);
    }
  }

  // Expande el área de destrucción si se activó una fruta especial
  expandSpecialEffect(r, c, special, targetMap) {
    if (special === 'striped_h') {
      // Toda la fila
      for (let col = 0; col < this.cols; col++) {
        const key = `${r},${col}`;
        if (!targetMap.has(key) && this.grid[r][col]) {
          targetMap.set(key, { r, c: col, tile: this.grid[r][col] });
          if (this.grid[r][col].special && this.grid[r][col].special !== 'striped_h') {
            this.expandSpecialEffect(r, col, this.grid[r][col].special, targetMap);
          }
        }
      }
    } else if (special === 'striped_v') {
      // Toda la columna
      for (let row = 0; row < this.rows; row++) {
        const key = `${row},${c}`;
        if (!targetMap.has(key) && this.grid[row][c]) {
          targetMap.set(key, { r: row, c, tile: this.grid[row][c] });
          if (this.grid[row][c].special && this.grid[row][c].special !== 'striped_v') {
            this.expandSpecialEffect(row, c, this.grid[row][c].special, targetMap);
          }
        }
      }
    } else if (special === 'bomb') {
      // Área de 3x3
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            const key = `${nr},${nc}`;
            if (!targetMap.has(key) && this.grid[nr][nc]) {
              targetMap.set(key, { r: nr, c: nc, tile: this.grid[nr][nc] });
              if (this.grid[nr][nc].special && this.grid[nr][nc].special !== 'bomb') {
                this.expandSpecialEffect(nr, nc, this.grid[nr][nc].special, targetMap);
              }
            }
          }
        }
      }
    }
  }

  // Encuentra la intersección entre un match horizontal y uno vertical (Forma T o L)
  findIntersection(matches) {
    for (let i = 0; i < matches.length; i++) {
      for (let j = i + 1; j < matches.length; j++) {
        const setA = matches[i];
        const setB = matches[j];
        if (setA[0].type === setB[0].type) {
          for (const posA of setA) {
            const inter = setB.find(posB => posB.r === posA.r && posB.c === posA.c);
            if (inter) {
              return { r: inter.r, c: inter.c, type: setA[0].type };
            }
          }
        }
      }
    }
    return null;
  }

  // Combinación directa entre dos frutas especiales intercambiadas
  async triggerSpecialCombo(r1, c1, r2, c2) {
    const t1 = this.grid[r1][c1];
    const t2 = this.grid[r2][c2];
    if (!t1 || !t2) return;

    this.comboCount = Math.max(2, this.comboCount + 1);
    this.onCombo(this.comboCount);

    const s1 = t1.special;
    const s2 = t2.special;
    const cellsToDestroy = new Map();
    const isStriped = (s) => s === 'striped_h' || s === 'striped_v';

    if (isStriped(s1) && isStriped(s2)) {
      // Cruz Gigante: Toda la fila y columna de r1/c1 y r2/c2
      for (let c = 0; c < this.cols; c++) {
        cellsToDestroy.set(`${r1},${c}`, { r: r1, c, tile: this.grid[r1][c] });
        cellsToDestroy.set(`${r2},${c}`, { r: r2, c, tile: this.grid[r2][c] });
      }
      for (let r = 0; r < this.rows; r++) {
        cellsToDestroy.set(`${r},${c1}`, { r, c: c1, tile: this.grid[r][c1] });
        cellsToDestroy.set(`${r},${c2}`, { r, c: c2, tile: this.grid[r][c2] });
      }
      this.onSpecialTriggered('striped_h', r1, c1);
      this.onSpecialTriggered('striped_v', r2, c2);
    } else if (s1 === 'bomb' && s2 === 'bomb') {
      // Mega Bomba 5x5
      const midR = Math.round((r1 + r2) / 2);
      const midC = Math.round((c1 + c2) / 2);
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = midR + dr;
          const nc = midC + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            cellsToDestroy.set(`${nr},${nc}`, { r: nr, c: nc, tile: this.grid[nr][nc] });
          }
        }
      }
      this.onSpecialTriggered('bomb', midR, midC);
    } else if ((isStriped(s1) && s2 === 'bomb') || (s1 === 'bomb' && isStriped(s2))) {
      // Rayada + Bomba: Limpia 3 filas y 3 columnas
      const midR = Math.round((r1 + r2) / 2);
      const midC = Math.round((c1 + c2) / 2);
      for (let dr = -1; dr <= 1; dr++) {
        const row = midR + dr;
        if (row >= 0 && row < this.rows) {
          for (let c = 0; c < this.cols; c++) {
            cellsToDestroy.set(`${row},${c}`, { r: row, c, tile: this.grid[row][c] });
          }
        }
      }
      for (let dc = -1; dc <= 1; dc++) {
        const col = midC + dc;
        if (col >= 0 && col < this.cols) {
          for (let r = 0; r < this.rows; r++) {
            cellsToDestroy.set(`${r},${col}`, { r, c: col, tile: this.grid[r][col] });
          }
        }
      }
      this.onSpecialTriggered('bomb', midR, midC);
      this.onSpecialTriggered('striped_h', midR, midC);
    } else {
      // Cualquier otra combinación de especiales
      cellsToDestroy.set(`${r1},${c1}`, { r: r1, c: c1, tile: t1 });
      cellsToDestroy.set(`${r2},${c2}`, { r: r2, c: c2, tile: t2 });
      this.expandSpecialEffect(r1, c1, s1, cellsToDestroy);
      this.expandSpecialEffect(r2, c2, s2, cellsToDestroy);
    }

    const collectedCounts = {};
    let glueCleanedCount = 0;
    let pointsGained = 600;

    for (const [key, item] of cellsToDestroy) {
      const { r, c, tile } = item;
      if (!tile) continue;
      collectedCounts[tile.type] = (collectedCounts[tile.type] || 0) + 1;
      if (this.glueGrid[r][c]) {
        this.glueGrid[r][c] = false;
        glueCleanedCount++;
      }
      pointsGained += 50 * this.comboCount;
      this.grid[r][c] = null;
    }

    if (glueCleanedCount > 0) this.onGlueCleaned(glueCleanedCount);
    this.onCollect(collectedCounts);
    this.onScore(pointsGained);

    this.onBoardUpdate({ type: 'match', cells: Array.from(cellsToDestroy.values()) });
    await this.sleep(300);
    await this.applyGravity();
    this.onBoardUpdate({ type: 'drop' });
    await this.sleep(200);

    const newMatches = this.findMatches();
    if (newMatches.length > 0) {
      await this.processMatchesAndCascades(newMatches);
    }
  }

  // Intercambio con Paleta Arcoíris (elimina todas las frutas del color elegido)
  async triggerRainbowSwap(rainbowR, rainbowC, targetType) {
    this.comboCount++;
    this.onCombo(this.comboCount);

    const collectedCounts = {};
    let glueCleanedCount = 0;
    let points = 500;

    // Destruir la propia paleta
    this.grid[rainbowR][rainbowC] = null;
    if (this.glueGrid[rainbowR][rainbowC]) {
      this.glueGrid[rainbowR][rainbowC] = false;
      glueCleanedCount++;
    }

    // Buscar y destruir todas las frutas del tipo objetivo
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c] && this.grid[r][c].type === targetType) {
          collectedCounts[targetType] = (collectedCounts[targetType] || 0) + 1;
          points += 100 * this.comboCount;

          if (this.glueGrid[r][c]) {
            this.glueGrid[r][c] = false;
            glueCleanedCount++;
          }
          this.grid[r][c] = null;
        }
      }
    }

    if (glueCleanedCount > 0) this.onGlueCleaned(glueCleanedCount);
    this.onCollect(collectedCounts);
    this.onScore(points);
    this.onSpecialTriggered('rainbow', rainbowR, rainbowC);
    this.onBoardUpdate({ type: 'match' });

    await this.sleep(300);
    await this.applyGravity();
    this.onBoardUpdate({ type: 'drop' });
    await this.sleep(200);

    const newMatches = this.findMatches();
    if (newMatches.length > 0) {
      await this.processMatchesAndCascades(newMatches);
    }
    this.isProcessing = false;
  }

  // Doble Paleta Arcoíris (Limpia TODO el tablero)
  async triggerDoubleRainbow(r1, c1, r2, c2) {
    this.comboCount = 5;
    this.onCombo(this.comboCount);

    const collectedCounts = {};
    let glueCleanedCount = 0;
    let points = 2500;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          const type = this.grid[r][c].type;
          collectedCounts[type] = (collectedCounts[type] || 0) + 1;
          points += 80;
          this.grid[r][c] = null;
        }
        if (this.glueGrid[r][c]) {
          this.glueGrid[r][c] = false;
          glueCleanedCount++;
        }
      }
    }

    if (glueCleanedCount > 0) this.onGlueCleaned(glueCleanedCount);
    this.onCollect(collectedCounts);
    this.onScore(points);
    this.onSpecialTriggered('rainbow_double', r1, c1);
    this.onBoardUpdate({ type: 'match' });

    await this.sleep(400);
    await this.applyGravity();
    this.onBoardUpdate({ type: 'drop' });
    await this.sleep(200);

    const newMatches = this.findMatches();
    if (newMatches.length > 0) {
      await this.processMatchesAndCascades(newMatches);
    }
    this.isProcessing = false;
  }

  // Aplica gravedad a las columnas y genera nuevas frutas arriba
  async applyGravity() {
    for (let c = 0; c < this.cols; c++) {
      let emptyRow = this.rows - 1;

      // Bajar frutas existentes
      for (let r = this.rows - 1; r >= 0; r--) {
        if (this.grid[r][c] !== null) {
          if (r !== emptyRow) {
            this.grid[emptyRow][c] = this.grid[r][c];
            this.grid[r][c] = null;
          }
          emptyRow--;
        }
      }

      // Rellenar los huecos superiores con frutas frescas
      for (let r = emptyRow; r >= 0; r--) {
        this.grid[r][c] = {
          id: this.tileIdCounter++,
          type: this.getRandomFruit(),
          special: null,
          isNew: true
        };
      }
    }
  }

  // Verifica si hay al menos un movimiento posible en todo el tablero
  hasPossibleMoves() {
    // Si hay alguna paleta arcoíris en el tablero, siempre hay jugada
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]?.special === 'rainbow') return true;
      }
    }

    // Si dos celdas adyacentes tienen especiales, se pueden combinar
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]?.special) {
          if (c < this.cols - 1 && this.grid[r][c + 1]?.special) return true;
          if (r < this.rows - 1 && this.grid[r + 1][c]?.special) return true;
        }
      }
    }

    // Probar intercambios horizontales
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols - 1; c++) {
        this.swapTiles(r, c, r, c + 1);
        const matches = this.findMatches();
        this.swapTiles(r, c, r, c + 1); // revertir
        if (matches.length > 0) return true;
      }
    }

    // Probar intercambios verticales
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows - 1; r++) {
        this.swapTiles(r, c, r + 1, c);
        const matches = this.findMatches();
        this.swapTiles(r, c, r + 1, c); // revertir
        if (matches.length > 0) return true;
      }
    }

    return false;
  }

  // Remezcla de Témperas (Shuffle) con notificación visual y de tablero
  shuffleBoard(notify = true) {
    const allFruits = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.grid[r][c]) {
          allFruits.push(this.grid[r][c]);
        }
      }
    }

    let attempts = 0;
    let foundValid = false;

    while (attempts < 50 && !foundValid) {
      attempts++;
      // Mezcla Fisher-Yates
      for (let i = allFruits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allFruits[i], allFruits[j]] = [allFruits[j], allFruits[i]];
      }

      let idx = 0;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          this.grid[r][c] = allFruits[idx++];
        }
      }

      // No queremos que al mezclar haya matches inmediatos sin que el jugador mueva
      if (this.findMatches().length === 0 && this.hasPossibleMoves()) {
        foundValid = true;
      }
    }

    // Si no se encontró un tablero perfecto sin matches inmediatos pero con jugadas,
    // garantizar que al menos haya jugadas válidas
    if (!this.hasPossibleMoves()) {
      // Forzar una paleta arcoíris o intercambio válido en el centro
      const midR = Math.floor(this.rows / 2);
      const midC = Math.floor(this.cols / 2);
      if (this.grid[midR][midC]) {
        this.grid[midR][midC].special = 'rainbow';
      }
    }

    if (notify) {
      this.onBoardUpdate({ type: 'shuffle' });
    }
  }

  // Uso de Herramienta: Tijeras (Corta una casilla directamente)
  async useScissors(r, c) {
    if (this.isProcessing) return false;
    if (!this.grid[r][c]) return false;
    this.isProcessing = true;

    try {
      const tile = this.grid[r][c];
      const collected = {};
      collected[tile.type] = 1;
      this.onCollect(collected);

      let glueCleaned = 0;
      if (this.glueGrid[r][c]) {
        this.glueGrid[r][c] = false;
        glueCleaned++;
        this.onGlueCleaned(glueCleaned);
      }

      this.grid[r][c] = null;
      this.onScore(150);
      this.onBoardUpdate({ type: 'match', cells: [{ r, c, tile }] });

      await this.sleep(250);
      await this.applyGravity();
      this.onBoardUpdate({ type: 'drop' });
      await this.sleep(200);

      const matches = this.findMatches();
      if (matches.length > 0) {
        await this.processMatchesAndCascades(matches);
      }
      return true;
    } finally {
      this.isProcessing = false;
    }
  }

  // Uso de Herramienta: Pincel Pegamento (Intercambio libre sin match obligatorio)
  async useGlueSwap(r1, c1, r2, c2) {
    if (this.isProcessing) return false;
    if (!this.isAdjacent(r1, c1, r2, c2)) return false;
    this.isProcessing = true;

    try {
      this.swapTiles(r1, c1, r2, c2);
      this.onBoardUpdate({ type: 'drop' });
      await this.sleep(200);

      const matches = this.findMatches();
      if (matches.length > 0) {
        await this.processMatchesAndCascades(matches);
      }
      return true;
    } finally {
      this.isProcessing = false;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
