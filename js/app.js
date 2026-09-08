/**
 * FRUTA ATTACK: CONTROLADOR PRINCIPAL DEL JUEGO
 * Gestión de pantallas, mapa de mundos/plataformas, tablero interactivo,
 * sistema de partículas de papel y témpera, y persistencia local.
 */

class FrutaAttackApp {
  constructor() {
    this.currentScreen = 'screen-menu';
    this.currentWorldId = 1;
    this.currentLevelId = 1;
    this.currentLevelConfig = null;
    this.engine = null;
    
    // Estado del nivel activo
    this.score = 0;
    this.movesLeft = 0;
    this.collected = {};
    this.glueLeft = 0;
    this.selectedTile = null; // { r, c }
    this.activeTool = null; // 'scissors' | 'glue' | null
    this.glueToolFirstTile = null;
    
    // Inventario y progreso guardado
    this.saveData = this.loadSaveData();

    // Sistema de partículas Canvas
    this.fxCanvas = document.getElementById('fx-canvas');
    this.fxCtx = this.fxCanvas ? this.fxCanvas.getContext('2d') : null;
    this.particles = [];
    this.lastAnimFrame = null;

    this.init();
  }

  // Carga o inicializa el progreso en localStorage
  loadSaveData() {
    const defaultData = {
      unlockedLevel: 1,
      levelStars: {},
      levelHighScores: {},
      tools: {
        scissors: 3,
        glue: 2,
        shuffle: 2
      }
    };

    try {
      const stored = localStorage.getItem('fruta_attack_save');
      if (stored) {
        return Object.assign(defaultData, JSON.parse(stored));
      }
    } catch (e) {
      console.warn("No se pudo acceder a localStorage:", e);
    }
    return defaultData;
  }

  saveGameProgress() {
    try {
      localStorage.setItem('fruta_attack_save', JSON.stringify(this.saveData));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  init() {
    this.bindEvents();
    this.renderHeroFruits();
    this.updateSoundIcons();
    this.startFXLoop();
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  // Vincula todos los botones y eventos de navegación
  bindEvents() {
    // Menú Principal
    document.getElementById('btn-play').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.openWorldMap(this.getWorldForLevel(this.saveData.unlockedLevel));
    });

    document.getElementById('btn-how-to').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.showModal('modal-how-to');
    });

    document.getElementById('btn-close-howto').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.hideModal('modal-how-to');
    });

    document.getElementById('btn-howto-gotit').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.hideModal('modal-how-to');
    });

    // Botones de sonido
    const toggleSoundHandler = () => {
      const isMuted = window.gameAudio.toggleMute();
      this.updateSoundIcons();
      if (!isMuted) window.gameAudio.playClick();
    };
    document.getElementById('btn-toggle-sound').addEventListener('click', toggleSoundHandler);
    document.getElementById('btn-game-sound').addEventListener('click', toggleSoundHandler);

    // Mapa de Plataformas
    document.getElementById('btn-map-back').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.showScreen('screen-menu');
    });

    // Pestañas de mundos en el mapa
    document.querySelectorAll('.world-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.gameAudio.playClick();
        const worldId = parseInt(btn.dataset.world, 10);
        this.selectWorld(worldId);
      });
    });

    // Botones de Juego (HUD)
    document.getElementById('btn-game-map').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.openWorldMap(this.currentWorldId);
    });

    // Herramientas Art Attack
    document.getElementById('tool-scissors').addEventListener('click', () => this.activateTool('scissors'));
    document.getElementById('tool-glue').addEventListener('click', () => this.activateTool('glue'));
    document.getElementById('tool-shuffle').addEventListener('click', () => this.useShuffleTool());

    // Modales de Victoria y Derrota
    document.getElementById('btn-victory-map').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.hideModal('modal-victory');
      this.openWorldMap(this.currentWorldId);
    });

    document.getElementById('btn-victory-replay').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.hideModal('modal-victory');
      this.startLevel(this.currentLevelId);
    });

    document.getElementById('btn-victory-next').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.hideModal('modal-victory');
      const nextLevel = this.currentLevelId + 1;
      if (nextLevel <= GAME_LEVELS.length) {
        this.startLevel(nextLevel);
      } else {
        this.openWorldMap(4);
      }
    });

    document.getElementById('btn-defeat-map').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.hideModal('modal-game-over');
      this.openWorldMap(this.currentWorldId);
    });

    document.getElementById('btn-defeat-retry').addEventListener('click', () => {
      window.gameAudio.playClick();
      this.hideModal('modal-game-over');
      this.startLevel(this.currentLevelId);
    });
  }

  updateSoundIcons() {
    const isMuted = window.gameAudio.isMuted();
    const icon = isMuted ? '🔇' : '🔊';
    document.getElementById('sound-icon').textContent = icon;
    document.getElementById('game-sound-icon').textContent = icon;
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }
  }

  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('hidden');
  }

  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  }

  // Renderiza las frutas animadas en el menú principal
  renderHeroFruits() {
    const el1 = document.getElementById('hero-strawberry');
    const el2 = document.getElementById('hero-banana');
    const el3 = document.getElementById('hero-watermelon');
    if (el1) el1.innerHTML = FruitGraphics.fresa;
    if (el2) el2.innerHTML = FruitGraphics.banana;
    if (el3) el3.innerHTML = FruitGraphics.sandia;
  }

  getWorldForLevel(levelId) {
    const lvl = GAME_LEVELS.find(l => l.id === levelId);
    return lvl ? lvl.worldId : 1;
  }

  // ==========================================
  // MAPA DE MUNDOS Y NIVELES (PLATAFORMAS)
  // ==========================================
  openWorldMap(worldId = 1) {
    this.currentWorldId = worldId;
    this.showScreen('screen-map');
    this.updateTotalStarsHeader();
    this.selectWorld(this.currentWorldId);
  }

  updateTotalStarsHeader() {
    let total = 0;
    Object.values(this.saveData.levelStars).forEach(st => total += st);
    const el = document.getElementById('header-total-stars');
    if (el) el.textContent = `${total} / 60`;
  }

  selectWorld(worldId) {
    this.currentWorldId = worldId;

    // Actualizar tabs
    document.querySelectorAll('.world-tab-btn').forEach(btn => {
      const bId = parseInt(btn.dataset.world, 10);
      btn.classList.toggle('active', bId === worldId);

      // Verificar si el mundo está desbloqueado
      const worldConfig = WORLDS_CONFIG.find(w => w.id === bId);
      const isLocked = worldConfig.levelRange[0] > this.saveData.unlockedLevel;
      btn.classList.toggle('locked', isLocked);
    });

    this.renderWorldPlatform(worldId);
  }

  renderWorldPlatform(worldId) {
    const container = document.getElementById('world-container');
    if (!container) return;

    const world = WORLDS_CONFIG.find(w => w.id === worldId);
    const levelsInWorld = GAME_LEVELS.filter(l => l.worldId === worldId);

    // Contenido del banner del mundo
    let html = `
      <div class="world-banner">
        <div class="tape-strip"></div>
        <span class="world-banner-tag ${world.badgeClass}">${world.subtitle}</span>
        <h3 class="world-banner-title">${world.icon} ${world.name}</h3>
        <p class="world-banner-desc">${world.description}</p>
      </div>

      <div class="platform-path-container">
        <!-- SVG para la línea curva de lápiz / puntadas -->
        <svg class="path-doodle-svg" id="platform-path-svg"></svg>
    `;

    // Renderizado de los 5 niveles del mundo en zigzag artesanal
    const alignments = ['align-center', 'align-left', 'align-right', 'align-left', 'align-center'];

    levelsInWorld.forEach((lvl, idx) => {
      const isUnlocked = lvl.id <= this.saveData.unlockedLevel;
      const isCompleted = lvl.id < this.saveData.unlockedLevel || this.saveData.levelStars[lvl.id] > 0;
      const isCurrent = lvl.id === this.saveData.unlockedLevel;
      const starsEarned = this.saveData.levelStars[lvl.id] || 0;

      const alignClass = alignments[idx % alignments.length];
      const stateClass = isCompleted ? 'completed' : (isCurrent ? 'current' : 'locked');

      html += `
        <div class="level-node-wrap ${alignClass} ${stateClass}" id="level-node-${lvl.id}">
          <button class="level-pin-btn" data-level="${lvl.id}" ${!isUnlocked ? 'disabled' : ''}>
            <span class="level-pin-number">${lvl.id}</span>
            <span class="level-lock-icon">🔒</span>
            <div class="level-pin-stars">
              <span class="pin-star ${starsEarned >= 1 ? 'earned' : ''}">⭐</span>
              <span class="pin-star ${starsEarned >= 2 ? 'earned' : ''}">⭐</span>
              <span class="pin-star ${starsEarned >= 3 ? 'earned' : ''}">⭐</span>
            </div>
          </button>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Asignar clics a los botones de nivel
    container.querySelectorAll('.level-pin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvlId = parseInt(btn.dataset.level, 10);
        if (lvlId <= this.saveData.unlockedLevel) {
          window.gameAudio.playClick();
          this.startLevel(lvlId);
        }
      });
    });

    // Dibujar trazo decorativo entre niveles
    setTimeout(() => this.drawPlatformPath(levelsInWorld), 60);
  }

  drawPlatformPath(levels) {
    const svg = document.getElementById('platform-path-svg');
    if (!svg) return;

    const points = [];
    levels.forEach(lvl => {
      const node = document.getElementById(`level-node-${lvl.id}`);
      if (node) {
        const rect = node.getBoundingClientRect();
        const parentRect = svg.getBoundingClientRect();
        points.push({
          x: rect.left + rect.width / 2 - parentRect.left,
          y: rect.top + rect.height / 2 - parentRect.top
        });
      }
    });

    if (points.length < 2) return;

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.x + curr.x) / 2;
      const cy = (prev.y + curr.y) / 2;
      pathD += ` Q ${prev.x} ${cy}, ${curr.x} ${curr.y}`;
    }

    svg.innerHTML = `<path d="${pathD}" class="path-stroke" />`;
  }

  // ==========================================
  // INICIO Y CONTROL DEL JUEGO (MATCH-3)
  // ==========================================
  startLevel(levelId) {
    const config = GAME_LEVELS.find(l => l.id === levelId);
    if (!config) return;

    this.currentLevelId = levelId;
    this.currentLevelConfig = config;
    this.currentWorldId = config.worldId;

    // Reset de estado
    this.score = 0;
    this.movesLeft = config.moves;
    this.collected = {};
    if (config.collectTargets) {
      Object.keys(config.collectTargets).forEach(k => {
        this.collected[k] = 0;
      });
    }
    this.glueLeft = config.gluePattern ? config.gluePattern.length : 0;
    this.selectedTile = null;
    this.activeTool = null;
    this.glueToolFirstTile = null;

    // Crear motor Match-3
    this.engine = new Match3Engine({
      rows: config.rows,
      cols: config.cols,
      fruits: config.fruits,
      gluePattern: config.gluePattern,
      onScore: (pts) => this.handleScoreGained(pts),
      onCollect: (counts) => this.handleCollect(counts),
      onGlueCleaned: (count) => this.handleGlueCleaned(count),
      onSpecialTriggered: (special, r, c) => this.handleSpecialTriggered(special, r, c),
      onCombo: (combo) => this.handleCombo(combo),
      onBoardUpdate: (ev) => this.handleBoardUpdate(ev)
    });

    this.showScreen('screen-game');
    this.updateHUD();
    this.renderBoard();
    this.updateToolButtons();
  }

  updateHUD() {
    document.getElementById('hud-level-num').textContent = this.currentLevelId;
    
    const movesEl = document.getElementById('hud-moves-left');
    movesEl.textContent = this.movesLeft;
    movesEl.classList.toggle('moves-low', this.movesLeft <= 5);

    document.getElementById('hud-score').textContent = this.score;

    // Misión y objetivos
    document.getElementById('objective-desc').textContent = this.currentLevelConfig.description;

    const targetsContainer = document.getElementById('objective-targets');
    let targetsHTML = '';

    if (this.currentLevelConfig.collectTargets) {
      for (const [fruit, targetCount] of Object.entries(this.currentLevelConfig.collectTargets)) {
        const cur = this.collected[fruit] || 0;
        const isDone = cur >= targetCount;
        targetsHTML += `
          <div class="target-item">
            <span class="target-icon">${FruitGraphics[fruit] || ''}</span>
            <span class="target-count ${isDone ? 'completed' : ''}">${cur}/${targetCount}</span>
          </div>
        `;
      }
    }

    if (this.currentLevelConfig.gluePattern && this.currentLevelConfig.gluePattern.length > 0) {
      const isDone = this.glueLeft <= 0;
      targetsHTML += `
        <div class="target-item">
          <span class="target-icon">🧴</span>
          <span class="target-count ${isDone ? 'completed' : ''}">${this.glueLeft} manchas</span>
        </div>
      `;
    }

    if (this.currentLevelConfig.targetScore) {
      const isDone = this.score >= this.currentLevelConfig.targetScore;
      targetsHTML += `
        <div class="target-item">
          <span class="target-icon">🎯</span>
          <span class="target-count ${isDone ? 'completed' : ''}">${this.score}/${this.currentLevelConfig.targetScore}</span>
        </div>
      `;
    }

    targetsContainer.innerHTML = targetsHTML;

    // Medidor de estrellas
    const thresholds = this.currentLevelConfig.starThresholds;
    const maxThresh = thresholds[2];
    const pct = Math.min(100, Math.floor((this.score / maxThresh) * 100));
    document.getElementById('star-meter-fill').style.width = `${pct}%`;

    document.querySelector('.star-milestone.star-1').classList.toggle('reached', this.score >= thresholds[0]);
    document.querySelector('.star-milestone.star-2').classList.toggle('reached', this.score >= thresholds[1]);
    document.querySelector('.star-milestone.star-3').classList.toggle('reached', this.score >= thresholds[2]);
  }

  updateToolButtons() {
    document.getElementById('count-scissors').textContent = this.saveData.tools.scissors;
    document.getElementById('count-glue').textContent = this.saveData.tools.glue;
    document.getElementById('count-shuffle').textContent = this.saveData.tools.shuffle;

    document.getElementById('tool-scissors').classList.toggle('active', this.activeTool === 'scissors');
    document.getElementById('tool-glue').classList.toggle('active', this.activeTool === 'glue');
  }

  // Renderizado del tablero y celdas
  renderBoard() {
    const gridEl = document.getElementById('board-grid');
    if (!gridEl || !this.engine) return;

    gridEl.innerHTML = '';
    gridEl.style.gridTemplateRows = `repeat(${this.engine.rows}, 1fr)`;
    gridEl.style.gridTemplateColumns = `repeat(${this.engine.cols}, 1fr)`;

    for (let r = 0; r < this.engine.rows; r++) {
      for (let c = 0; c < this.engine.cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        if (this.engine.glueGrid[r][c]) {
          cell.classList.add('has-glue');
        }

        const tileData = this.engine.grid[r][c];
        if (tileData) {
          const tile = document.createElement('div');
          tile.className = 'tile-fruit';
          tile.dataset.id = tileData.id;

          if (tileData.special) {
            tile.classList.add(`tile-special-${tileData.special}`);
          }

          if (this.selectedTile && this.selectedTile.r === r && this.selectedTile.c === c) {
            tile.classList.add('selected');
          }

          tile.innerHTML = getFruitSVG(tileData.type, tileData.special);
          cell.appendChild(tile);
        }

        this.bindCellInteraction(cell, r, c);
        gridEl.appendChild(cell);
      }
    }
  }

  // Manejador de actualizaciones del tablero desde el motor (animación fluida de cascada)
  handleBoardUpdate(ev) {
    if (ev.type === 'match') {
      if (ev.cells && ev.cells.length > 0) {
        const gridEl = document.getElementById('board-grid');
        if (gridEl) {
          ev.cells.forEach(item => {
            const cell = gridEl.querySelector(`.board-cell[data-row="${item.r}"][data-col="${item.c}"]`);
            if (cell) {
              const tileEl = cell.querySelector('.tile-fruit');
              if (tileEl) tileEl.classList.add('matching');
            }
          });
        }
      }
    } else if (ev.type === 'drop') {
      this.renderBoard();
      // Aplicar animación de caída a las frutas nuevas
      const gridEl = document.getElementById('board-grid');
      if (gridEl && this.engine) {
        for (let r = 0; r < this.engine.rows; r++) {
          for (let c = 0; c < this.engine.cols; c++) {
            if (this.engine.grid[r][c]?.isNew) {
              delete this.engine.grid[r][c].isNew;
              const cell = gridEl.querySelector(`.board-cell[data-row="${r}"][data-col="${c}"]`);
              if (cell) {
                const tileEl = cell.querySelector('.tile-fruit');
                if (tileEl) tileEl.classList.add('dropping');
              }
            }
          }
        }
      }
    }
  }

  // Interacción táctil y con mouse (clic, arrastre y swipe)
  bindCellInteraction(cell, r, c) {
    let touchStartX = 0;
    let touchStartY = 0;
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseStartY = 0;

    // Mouse Arrastre & Clic
    cell.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isMouseDown = true;
      mouseStartX = e.clientX;
      mouseStartY = e.clientY;
    });

    cell.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const dx = e.clientX - mouseStartX;
      const dy = e.clientY - mouseStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Si fue un clic simple sin arrastre
      if (absDx < 18 && absDy < 18) {
        this.handleCellClick(r, c);
        return;
      }

      // Arrastre con mouse detectado
      if (this.engine.isProcessing) return;

      let targetR = r;
      let targetC = c;

      if (absDx > absDy) {
        targetC += dx > 0 ? 1 : -1;
      } else {
        targetR += dy > 0 ? 1 : -1;
      }

      if (targetR >= 0 && targetR < this.engine.rows && targetC >= 0 && targetC < this.engine.cols) {
        this.executeMove(r, c, targetR, targetC);
      }
    });

    // Touch Swipe y Tap en móviles
    cell.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    cell.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Si el desplazamiento fue mínimo, se toma como toque/click
      if (absDx < 20 && absDy < 20) {
        this.handleCellClick(r, c);
        return;
      }

      // Swipe detectable (horizontal o vertical)
      if (this.engine.isProcessing) return;

      let targetR = r;
      let targetC = c;

      if (absDx > absDy) {
        // Horizontal
        targetC += dx > 0 ? 1 : -1;
      } else {
        // Vertical
        targetR += dy > 0 ? 1 : -1;
      }

      if (targetR >= 0 && targetR < this.engine.rows && targetC >= 0 && targetC < this.engine.cols) {
        this.executeMove(r, c, targetR, targetC);
      }
    }, { passive: true });
  }

  // Clic en celda (para selección o uso de herramientas)
  handleCellClick(r, c) {
    if (this.engine.isProcessing) return;

    // Modo Herramienta: Tijera
    if (this.activeTool === 'scissors') {
      if (this.saveData.tools.scissors > 0) {
        window.gameAudio.playScissors();
        this.saveData.tools.scissors--;
        this.saveGameProgress();
        this.activeTool = null;
        this.updateToolButtons();
        this.spawnScissorsEffect(r, c);
        this.engine.useScissors(r, c);
        setTimeout(() => this.renderBoard(), 250);
      }
      return;
    }

    // Modo Herramienta: Pincel Pegamento (Swap libre)
    if (this.activeTool === 'glue') {
      if (!this.glueToolFirstTile) {
        this.glueToolFirstTile = { r, c };
        this.selectedTile = { r, c };
        this.renderBoard();
        window.gameAudio.playClick();
      } else {
        const first = this.glueToolFirstTile;
        if (this.engine.isAdjacent(first.r, first.c, r, c)) {
          if (this.saveData.tools.glue > 0) {
            window.gameAudio.playSwap();
            this.saveData.tools.glue--;
            this.saveGameProgress();
            this.engine.useGlueSwap(first.r, first.c, r, c);
          }
        }
        this.activeTool = null;
        this.glueToolFirstTile = null;
        this.selectedTile = null;
        this.updateToolButtons();
        setTimeout(() => this.renderBoard(), 250);
      }
      return;
    }

    // Comportamiento Match-3 normal (Selección o Swap)
    if (!this.selectedTile) {
      // Primera selección
      this.selectedTile = { r, c };
      window.gameAudio.playClick();
      this.renderBoard();
    } else {
      const prev = this.selectedTile;
      if (prev.r === r && prev.c === c) {
        // Deseleccionar
        this.selectedTile = null;
        this.renderBoard();
      } else if (this.engine.isAdjacent(prev.r, prev.c, r, c)) {
        // Intentar Swap
        this.selectedTile = null;
        this.executeMove(prev.r, prev.c, r, c);
      } else {
        // Seleccionar otra casilla
        this.selectedTile = { r, c };
        window.gameAudio.playClick();
        this.renderBoard();
      }
    }
  }

  // Ejecución de movimiento
  async executeMove(r1, c1, r2, c2) {
    window.gameAudio.playSwap();
    this.selectedTile = null;

    const result = await this.engine.trySwap(r1, c1, r2, c2);
    if (result.success) {
      this.movesLeft--;
      this.updateHUD();
      this.renderBoard();

      // Comprobar condición de victoria o derrota
      this.checkLevelOutcome();
    } else {
      // Movimiento inválido
      this.renderBoard();
    }
  }

  // ==========================================
  // EVENTOS DEL MOTOR MATCH-3
  // ==========================================
  handleScoreGained(pts) {
    this.score += pts;
    this.updateHUD();
  }

  handleCollect(counts) {
    for (const [fruit, amount] of Object.entries(counts)) {
      if (this.collected[fruit] !== undefined) {
        this.collected[fruit] += amount;
      }
    }
    this.updateHUD();
  }

  handleGlueCleaned(count) {
    this.glueLeft = Math.max(0, this.glueLeft - count);
    this.updateHUD();
  }

  handleCombo(combo) {
    window.gameAudio.playMatch(combo);

    if (combo >= 2) {
      const messages = [
        "¡BIEN HECHO!",
        "¡PINCELADA GENIAL! 🎨",
        "¡SUPER COMBO! ✨",
        "¡OBRA DE ARTE! 🏆",
        "¡¡ART ATTACK MAGNÍFICO!! 🔥"
      ];
      const msg = messages[Math.min(combo - 2, messages.length - 1)];
      this.showToast(msg);
      this.spawnPaperConfetti(15);
    }
  }

  handleSpecialTriggered(special, r, c) {
    if (special === 'striped_h' || special === 'striped_v') {
      window.gameAudio.playLineClear();
      this.spawnPaintStreak(special, r, c);
    } else if (special === 'bomb') {
      window.gameAudio.playBomb();
      this.spawnPaintExplosion(r, c);
    } else if (special === 'rainbow' || special === 'rainbow_double') {
      window.gameAudio.playRainbow();
      this.spawnRainbowSparks();
      this.showToast("¡MAGIA ARCOÍRIS! 🌈");
    }
  }

  showToast(text) {
    const toast = document.getElementById('toast-banner');
    const toastText = document.getElementById('toast-text');
    if (!toast || !toastText) return;

    toastText.textContent = text;
    toast.classList.remove('hidden');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 1200);
  }

  // ==========================================
  // COMPROBACIÓN DE VICTORIA / DERROTA
  // ==========================================
  checkLevelOutcome() {
    const cfg = this.currentLevelConfig;

    // Si es un nivel puramente de puntaje (ej. Nivel 1 o 2):
    // El jugador juega hasta agotar sus movimientos para intentar lograr la mayor cantidad de estrellas.
    if (cfg.type === 'score') {
      if (this.movesLeft <= 0) {
        if (this.score >= cfg.targetScore) {
          setTimeout(() => this.triggerVictory(), 350);
        } else {
          setTimeout(() => this.triggerGameOver(), 350);
        }
      }
      return;
    }

    // Para niveles con objetivos de recolección de frutas o pegamento:
    const isVictorious = this.isObjectivesMet();
    if (isVictorious) {
      setTimeout(() => this.triggerVictory(), 350);
    } else if (this.movesLeft <= 0) {
      setTimeout(() => this.triggerGameOver(), 350);
    }
  }

  isObjectivesMet() {
    const cfg = this.currentLevelConfig;

    // 1. Objetivo de puntaje
    if (cfg.targetScore && this.score < cfg.targetScore) {
      return false;
    }

    // 2. Objetivo de frutas recolectadas
    if (cfg.collectTargets) {
      for (const [fruit, required] of Object.entries(cfg.collectTargets)) {
        if ((this.collected[fruit] || 0) < required) return false;
      }
    }

    // 3. Objetivo de pegamento
    if (cfg.gluePattern && cfg.gluePattern.length > 0 && this.glueLeft > 0) {
      return false;
    }

    return true;
  }

  // Victoria del Nivel
  triggerVictory() {
    window.gameAudio.playVictory();
    this.spawnPaperConfetti(60);

    // Calcular bonus por movimientos sobrantes
    const bonus = this.movesLeft * 120;
    this.score += bonus;

    // Calcular estrellas obtenidas
    const thresh = this.currentLevelConfig.starThresholds;
    let stars = 1;
    if (this.score >= thresh[2]) stars = 3;
    else if (this.score >= thresh[1]) stars = 2;

    // Guardar récords
    const prevStars = this.saveData.levelStars[this.currentLevelId] || 0;
    if (stars > prevStars) {
      this.saveData.levelStars[this.currentLevelId] = stars;
    }

    const prevHigh = this.saveData.levelHighScores[this.currentLevelId] || 0;
    const finalHigh = Math.max(prevHigh, this.score);
    this.saveData.levelHighScores[this.currentLevelId] = finalHigh;

    // Desbloquear siguiente nivel
    if (this.currentLevelId === this.saveData.unlockedLevel && this.currentLevelId < GAME_LEVELS.length) {
      this.saveData.unlockedLevel = this.currentLevelId + 1;
    }

    this.saveGameProgress();

    // Actualizar modal de victoria
    document.getElementById('victory-score').textContent = this.score;
    document.getElementById('victory-bonus-moves').textContent = `${this.movesLeft} (+${bonus} pts)`;
    document.getElementById('victory-highscore').textContent = finalHigh;

    for (let s = 1; s <= 3; s++) {
      const starEl = document.getElementById(`v-star-${s}`);
      if (starEl) {
        starEl.classList.toggle('earned', s <= stars);
      }
    }

    this.showModal('modal-victory');
  }

  // Derrota (Sin movimientos)
  triggerGameOver() {
    window.gameAudio.playGameOver();

    document.getElementById('defeat-score').textContent = this.score;

    // Calcular qué faltó
    const cfg = this.currentLevelConfig;
    const missing = [];

    if (cfg.collectTargets) {
      for (const [fruit, req] of Object.entries(cfg.collectTargets)) {
        const cur = this.collected[fruit] || 0;
        if (cur < req) {
          missing.push(`${req - cur} ${FRUIT_NAMES[fruit]}`);
        }
      }
    }
    if (this.glueLeft > 0) {
      missing.push(`${this.glueLeft} manchas de pegamento`);
    }
    if (cfg.targetScore && this.score < cfg.targetScore) {
      missing.push(`${cfg.targetScore - this.score} puntos`);
    }

    document.getElementById('defeat-target-left').textContent = missing.join(', ') || 'Metas no completadas';
    this.showModal('modal-game-over');
  }

  // ==========================================
  // USO DE HERRAMIENTAS ARTESANALES
  // ==========================================
  activateTool(toolType) {
    if (this.engine.isProcessing) return;

    if (this.saveData.tools[toolType] <= 0) {
      this.showToast("¡Te has quedado sin esta herramienta!");
      return;
    }

    if (this.activeTool === toolType) {
      this.activeTool = null; // desactivar
    } else {
      this.activeTool = toolType;
      this.glueToolFirstTile = null;
      this.selectedTile = null;
    }

    this.updateToolButtons();
    this.renderBoard();
  }

  useShuffleTool() {
    if (this.engine.isProcessing) return;

    if (this.saveData.tools.shuffle <= 0) {
      this.showToast("¡Sin mezclas de témpera!");
      return;
    }

    window.gameAudio.playLineClear();
    this.saveData.tools.shuffle--;
    this.saveGameProgress();
    this.updateToolButtons();

    this.spawnPaintExplosion(Math.floor(this.engine.rows / 2), Math.floor(this.engine.cols / 2));
    this.engine.shuffleBoard(false);
    this.showToast("¡TABLERO REMEZCLADO! 🎨");
    this.renderBoard();
  }

  // ==========================================
  // SISTEMA DE PARTÍCULAS CANVAS (ARTE Y CONFETI)
  // ==========================================
  resizeCanvas() {
    if (!this.fxCanvas) return;
    const frame = document.getElementById('board-frame');
    if (frame) {
      this.fxCanvas.width = frame.clientWidth;
      this.fxCanvas.height = frame.clientHeight;
    }
  }

  startFXLoop() {
    const loop = () => {
      this.updateAndDrawParticles();
      this.lastAnimFrame = requestAnimationFrame(loop);
    };
    this.lastAnimFrame = requestAnimationFrame(loop);
  }

  updateAndDrawParticles() {
    if (!this.fxCtx || !this.fxCanvas) return;
    this.fxCtx.clearRect(0, 0, this.fxCanvas.width, this.fxCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0;
      p.rot += p.vRot || 0;
      p.life -= p.decay || 0.02;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.fxCtx.save();
      this.fxCtx.translate(p.x, p.y);
      this.fxCtx.rotate(p.rot);
      this.fxCtx.globalAlpha = Math.max(0, p.life);

      if (p.type === 'confetti') {
        // Trocito rectangular de papel recortado con tijeras
        this.fxCtx.fillStyle = p.color;
        this.fxCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.type === 'splash') {
        // Salpicadura de témpera
        this.fxCtx.fillStyle = p.color;
        this.fxCtx.beginPath();
        this.fxCtx.arc(0, 0, p.size * (1 - p.life * 0.3), 0, Math.PI * 2);
        this.fxCtx.fill();
      } else if (p.type === 'streak') {
        // Pincelada
        this.fxCtx.fillStyle = p.color;
        this.fxCtx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      }

      this.fxCtx.restore();
    }
  }

  // Genera confeti de papel picado
  spawnPaperConfetti(count = 30) {
    if (!this.fxCanvas) return;
    const colors = ['#e63946', '#f77f00', '#fcbf49', '#2a9d8f', '#0077b6', '#7209b7', '#fff'];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'confetti',
        x: Math.random() * this.fxCanvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 2,
        gravity: 0.12,
        size: Math.random() * 10 + 6,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: Math.random() * 0.015 + 0.008
      });
    }
  }

  // Salpicadura de pintura (Bomba)
  spawnPaintExplosion(r, c) {
    if (!this.fxCanvas) return;
    const cellW = this.fxCanvas.width / this.engine.cols;
    const cellH = this.fxCanvas.height / this.engine.rows;
    const cx = (c + 0.5) * cellW;
    const cy = (r + 0.5) * cellH;
    const colors = ['#e63946', '#fcbf49', '#2a9d8f', '#7209b7'];

    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.particles.push({
        type: 'splash',
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 14 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: 0,
        life: 1.0,
        decay: 0.03
      });
    }
  }

  // Pincelada recta (Fruta rayada)
  spawnPaintStreak(special, r, c) {
    if (!this.fxCanvas) return;
    const isH = special === 'striped_h';
    const cellW = this.fxCanvas.width / this.engine.cols;
    const cellH = this.fxCanvas.height / this.engine.rows;

    this.particles.push({
      type: 'streak',
      x: isH ? this.fxCanvas.width / 2 : (c + 0.5) * cellW,
      y: isH ? (r + 0.5) * cellH : this.fxCanvas.height / 2,
      vx: 0,
      vy: 0,
      width: isH ? this.fxCanvas.width : cellW * 0.8,
      height: isH ? cellH * 0.8 : this.fxCanvas.height,
      rot: 0,
      color: '#fcbf49',
      life: 0.8,
      decay: 0.05
    });
  }

  spawnScissorsEffect(r, c) {
    if (!this.fxCanvas) return;
    const cellW = this.fxCanvas.width / this.engine.cols;
    const cellH = this.fxCanvas.height / this.engine.rows;
    const cx = (c + 0.5) * cellW;
    const cy = (r + 0.5) * cellH;

    for (let i = 0; i < 12; i++) {
      this.particles.push({
        type: 'confetti',
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        gravity: 0.15,
        size: 8,
        rot: Math.random() * Math.PI,
        vRot: 0.1,
        color: '#fff',
        life: 0.9,
        decay: 0.04
      });
    }
  }

  spawnRainbowSparks() {
    if (!this.fxCanvas) return;
    const colors = ['#ff0055', '#ffaa00', '#00eeff', '#aa00ff', '#55ff00'];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        type: 'splash',
        x: Math.random() * this.fxCanvas.width,
        y: Math.random() * this.fxCanvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: Math.random() * 10 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.0,
        decay: 0.02
      });
    }
  }
}

// Inicialización de la aplicación al cargar el DOM
window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new FrutaAttackApp();
});
