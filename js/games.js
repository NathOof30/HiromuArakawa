/**
 * ============================================
 * GAMES.JS - Site Hiromu Arakawa
 * ============================================
 * Mini-jeux : Puzzle, Quiz, Transmutation,
 * Matching Game
 * ============================================
 */

const Games = {
    // ========== PUZZLE - SECTION 1 ==========

    puzzle: {
        pieces: [],
        correctOrder: [0, 1, 2, 3, 4, 5],
        currentOrder: [],
        isComplete: false,

        /**
         * Initialise le puzzle
         */
        init() {
            const gameArea = document.getElementById('puzzle-game-area');
            if (!gameArea) return;

            // Créer les pièces
            this.pieces = [];
            this.currentOrder = Utils.shuffle([0, 1, 2, 3, 4, 5]);
            this.isComplete = false;

            gameArea.innerHTML = `
        <div class="puzzle-container">
          <div class="puzzle-grid" id="puzzle-grid">
            ${this.currentOrder.map((pieceIndex, gridPos) => `
              <div class="puzzle-piece" 
                   data-piece="${pieceIndex}" 
                   data-pos="${gridPos}"
                   draggable="true"
                   style="--piece-color: ${this.getPieceColor(pieceIndex)}">
                <span class="puzzle-piece__number">${pieceIndex + 1}</span>
                <!-- 
                  ASSET: Remplacer par des fragments d'image de l'avatar
                  background-image: url('assets/images/puzzle-piece-${pieceIndex}.png');
                -->
              </div>
            `).join('')}
          </div>
          <p class="puzzle-hint accent-text">Glissez les pièces pour les réorganiser de 1 à 6</p>
        </div>
      `;

            this.addStyles();
            this.bindEvents();
        },

        getPieceColor(index) {
            const colors = ['#B80000', '#DBB448', '#70CBFF', '#8EBE8D', '#8E8E8D', '#201919'];
            return colors[index];
        },

        addStyles() {
            if (document.getElementById('puzzle-styles')) return;

            const style = document.createElement('style');
            style.id = 'puzzle-styles';
            style.textContent = `
        .puzzle-container {
          text-align: center;
        }
        .puzzle-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          max-width: 300px;
          margin: 0 auto;
        }
        .puzzle-piece {
          aspect-ratio: 1;
          background-color: var(--piece-color);
          border: 2px solid #8E8E8D;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          transition: all 0.2s ease;
          position: relative;
        }
        .puzzle-piece:hover {
          transform: scale(1.05);
          z-index: 10;
        }
        .puzzle-piece.is-dragging {
          opacity: 0.5;
          cursor: grabbing;
        }
        .puzzle-piece.drag-over {
          border-color: #70CBFF;
          box-shadow: 0 0 15px rgba(112, 203, 255, 0.5);
        }
        .puzzle-piece.is-correct {
          border-color: #4a9f4a;
          box-shadow: 0 0 10px rgba(74, 159, 74, 0.5);
        }
        .puzzle-piece__number {
          font-family: var(--font-title);
          font-size: 1.5rem;
          color: white;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        .puzzle-hint {
          margin-top: 1rem;
        }
      `;
            document.head.appendChild(style);
        },

        bindEvents() {
            const pieces = document.querySelectorAll('.puzzle-piece');
            let draggedPiece = null;

            pieces.forEach(piece => {
                piece.addEventListener('dragstart', (e) => {
                    draggedPiece = piece;
                    piece.classList.add('is-dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                piece.addEventListener('dragend', () => {
                    piece.classList.remove('is-dragging');
                    draggedPiece = null;
                });

                piece.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    piece.classList.add('drag-over');
                });

                piece.addEventListener('dragleave', () => {
                    piece.classList.remove('drag-over');
                });

                piece.addEventListener('drop', (e) => {
                    e.preventDefault();
                    piece.classList.remove('drag-over');

                    if (draggedPiece && draggedPiece !== piece) {
                        this.swapPieces(draggedPiece, piece);
                    }
                });

                // Support tactile
                piece.addEventListener('touchstart', (e) => {
                    draggedPiece = piece;
                    piece.classList.add('is-dragging');
                });

                piece.addEventListener('touchend', (e) => {
                    piece.classList.remove('is-dragging');

                    const touch = e.changedTouches[0];
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);

                    if (target?.classList.contains('puzzle-piece') && target !== draggedPiece) {
                        this.swapPieces(draggedPiece, target);
                    }
                    draggedPiece = null;
                });
            });
        },

        swapPieces(piece1, piece2) {
            const parent = piece1.parentNode;
            const next1 = piece1.nextSibling === piece2 ? piece1 : piece1.nextSibling;

            piece2.before(piece1);
            if (next1) {
                parent.insertBefore(piece2, next1);
            } else {
                parent.appendChild(piece2);
            }

            this.checkCompletion();
        },

        checkCompletion() {
            const pieces = document.querySelectorAll('.puzzle-piece');
            let isCorrect = true;

            pieces.forEach((piece, index) => {
                const pieceNum = parseInt(piece.dataset.piece);
                if (pieceNum === index) {
                    piece.classList.add('is-correct');
                } else {
                    piece.classList.remove('is-correct');
                    isCorrect = false;
                }
            });

            const status = document.getElementById('puzzle-status');

            if (isCorrect && !this.isComplete) {
                this.isComplete = true;
                status.textContent = '✅ Puzzle complété ! Portrait révélé.';
                status.style.color = '#4a9f4a';

                // Déclencher déverrouillage après délai
                setTimeout(() => {
                    Utils.closeModal('modal-puzzle');
                    window.App?.unlockSection(2);
                }, 1500);
            }
        }
    },

    // ========== QUIZ TERRE - SECTION 2 ==========

    quizTerre: {
        questions: [
            {
                question: "Les enfants Arakawa conduisaient des tracteurs dès leur plus jeune âge.",
                answer: true,
                explanation: "Par nécessité pratique, les enfants de la ferme aidaient aux travaux dès qu'ils le pouvaient."
            },
            {
                question: "Hiromu Arakawa a travaillé 5 ans à la ferme avant de partir pour Tokyo.",
                answer: false,
                explanation: "Elle a travaillé 7 ans à la ferme, comme promis à ses parents."
            },
            {
                question: "Les agriculteurs de Hokkaido jettent parfois des tonnes de lait à cause des quotas.",
                answer: true,
                explanation: "Une réalité amère qu'Arakawa traite avec humour dans Nobles Paysans."
            },
            {
                question: "Le manga 'Silver Spoon' se déroule dans un lycée classique de Tokyo.",
                answer: false,
                explanation: "Silver Spoon se déroule dans un lycée agricole de Hokkaido."
            },
            {
                question: "La philosophie de l'Échange Équivalent vient de l'expérience agricole d'Arakawa.",
                answer: true,
                explanation: "Le principe 'si tu ne travailles pas, tu ne manges pas' est devenu la base de cette loi alchimique."
            }
        ],
        currentQuestion: 0,
        score: 0,
        isComplete: false,

        init() {
            const gameArea = document.getElementById('quiz-terre-area');
            if (!gameArea) return;

            this.currentQuestion = 0;
            this.score = 0;
            this.isComplete = false;

            this.addStyles();
            this.showQuestion();
        },

        addStyles() {
            if (document.getElementById('quiz-styles')) return;

            const style = document.createElement('style');
            style.id = 'quiz-styles';
            style.textContent = `
        .quiz-question {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }
        .quiz-answers {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .quiz-answer {
          padding: 0.75rem 2rem;
          font-family: var(--font-title);
          font-size: 1rem;
          background: transparent;
          border: 2px solid #8E8E8D;
          color: #b5b5b4;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .quiz-answer:hover {
          border-color: #DBB448;
          color: #DBB448;
        }
        .quiz-answer.is-correct {
          border-color: #4a9f4a !important;
          background-color: rgba(74, 159, 74, 0.2);
          color: #4a9f4a;
        }
        .quiz-answer.is-wrong {
          border-color: #B80000 !important;
          background-color: rgba(184, 0, 0, 0.2);
          color: #B80000;
        }
        .quiz-explanation {
          padding: 1rem;
          background: rgba(0,0,0,0.3);
          border-left: 3px solid #70CBFF;
          margin-top: 1rem;
        }
        .quiz-progress {
          text-align: center;
          margin-top: 1rem;
          color: #8E8E8D;
        }
      `;
            document.head.appendChild(style);
        },

        showQuestion() {
            const gameArea = document.getElementById('quiz-terre-area');
            const q = this.questions[this.currentQuestion];

            gameArea.innerHTML = `
        <p class="quiz-question">${q.question}</p>
        <div class="quiz-answers">
          <button class="quiz-answer" data-answer="true">VRAI</button>
          <button class="quiz-answer" data-answer="false">FAUX</button>
        </div>
        <div id="quiz-explanation"></div>
        <p class="quiz-progress">Question ${this.currentQuestion + 1} / ${this.questions.length}</p>
      `;

            gameArea.querySelectorAll('.quiz-answer').forEach(btn => {
                btn.addEventListener('click', () => this.checkAnswer(btn));
            });

            this.updateScore();
        },

        checkAnswer(btn) {
            const userAnswer = btn.dataset.answer === 'true';
            const q = this.questions[this.currentQuestion];
            const isCorrect = userAnswer === q.answer;

            // Désactiver les boutons
            document.querySelectorAll('.quiz-answer').forEach(b => {
                b.style.pointerEvents = 'none';
                if ((b.dataset.answer === 'true') === q.answer) {
                    b.classList.add('is-correct');
                }
            });

            if (isCorrect) {
                this.score++;
                btn.classList.add('is-correct');
            } else {
                btn.classList.add('is-wrong');
            }

            // Afficher explication
            document.getElementById('quiz-explanation').innerHTML = `
        <div class="quiz-explanation">
          <strong>${isCorrect ? '✅ Correct !' : '❌ Faux !'}</strong><br>
          ${q.explanation}
        </div>
      `;

            this.updateScore();

            // Question suivante après délai
            setTimeout(() => {
                this.currentQuestion++;
                if (this.currentQuestion < this.questions.length) {
                    this.showQuestion();
                } else {
                    this.showResult();
                }
            }, 2500);
        },

        updateScore() {
            const scoreEl = document.getElementById('quiz-terre-score');
            if (scoreEl) {
                scoreEl.textContent = `Score : ${this.score} / ${this.questions.length}`;
            }
        },

        showResult() {
            const gameArea = document.getElementById('quiz-terre-area');
            const passed = this.score >= 3;

            gameArea.innerHTML = `
        <div style="text-align: center;">
          <h3 style="color: ${passed ? '#4a9f4a' : '#B80000'}; margin-bottom: 1rem;">
            ${passed ? '🎉 Félicitations !' : '😢 Pas encore...'}
          </h3>
          <p>Votre score : <strong>${this.score} / ${this.questions.length}</strong></p>
          <p style="margin-top: 1rem; color: #8E8E8D;">
            ${passed
                    ? 'Vous avez prouvé votre connaissance de la vie rurale !'
                    : 'Il faut au moins 3 bonnes réponses pour débloquer la suite.'}
          </p>
          ${!passed ? '<button class="btn btn-secondary" id="retry-quiz-terre" style="margin-top: 1rem;">Réessayer</button>' : ''}
        </div>
      `;

            if (passed) {
                this.isComplete = true;
                setTimeout(() => {
                    Utils.closeModal('modal-quiz-terre');
                    window.App?.unlockSection(3);
                }, 2000);
            } else {
                document.getElementById('retry-quiz-terre')?.addEventListener('click', () => {
                    this.init();
                });
            }
        }
    },

    // ========== TRANSMUTATION - SECTION 3 ==========

    transmutation: {
        symbols: [
            { id: 'ouroboros', name: 'Ouroboros', emoji: '🐍', order: 0 },
            { id: 'sun', name: 'Soleil', emoji: '☀️', order: 1 },
            { id: 'moon', name: 'Lune', emoji: '🌙', order: 2 },
            { id: 'flame', name: 'Flamme', emoji: '🔥', order: 3 },
            { id: 'cross', name: 'Croix de Flamel', emoji: '✚', order: 4 }
        ],
        clickedOrder: [],
        isComplete: false,

        init() {
            const gameArea = document.getElementById('transmutation-game-area');
            if (!gameArea) return;

            this.clickedOrder = [];
            this.isComplete = false;

            // Mélanger l'affichage
            const shuffled = Utils.shuffle([...this.symbols]);

            this.addStyles();

            gameArea.innerHTML = `
        <div class="transmutation-circle">
          <div class="transmutation-inner"></div>
          ${shuffled.map((s, i) => `
            <button class="transmutation-symbol" 
                    data-symbol="${s.id}" 
                    data-order="${s.order}"
                    style="--angle: ${(i * 72) - 90}deg;">
              <span class="transmutation-symbol__emoji">${s.emoji}</span>
              <span class="transmutation-symbol__name">${s.name}</span>
            </button>
          `).join('')}
        </div>
        <p class="transmutation-hint accent-text">
          Cliquez les symboles dans l'ordre : Ouroboros → Soleil → Lune → Flamme → Croix
        </p>
      `;

            this.bindEvents();
        },

        addStyles() {
            if (document.getElementById('transmutation-styles')) return;

            const style = document.createElement('style');
            style.id = 'transmutation-styles';
            style.textContent = `
        .transmutation-circle {
          width: 280px;
          height: 280px;
          margin: 0 auto;
          position: relative;
          border: 3px solid #70CBFF;
          border-radius: 50%;
        }
        .transmutation-inner {
          position: absolute;
          top: 15%;
          left: 15%;
          width: 70%;
          height: 70%;
          border: 2px solid rgba(112, 203, 255, 0.5);
          border-radius: 50%;
        }
        .transmutation-symbol {
          position: absolute;
          width: 60px;
          height: 60px;
          background: #201919;
          border: 2px solid #8E8E8D;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-120px) rotate(calc(-1 * var(--angle)));
        }
        .transmutation-symbol:hover {
          border-color: #70CBFF;
          box-shadow: 0 0 15px rgba(112, 203, 255, 0.5);
        }
        .transmutation-symbol.is-active {
          border-color: #4a9f4a;
          background: rgba(74, 159, 74, 0.2);
          box-shadow: 0 0 20px rgba(74, 159, 74, 0.6);
        }
        .transmutation-symbol.is-wrong {
          border-color: #B80000;
          animation: shake 0.5s ease;
        }
        .transmutation-symbol__emoji {
          font-size: 1.5rem;
        }
        .transmutation-symbol__name {
          font-size: 0.6rem;
          color: #8E8E8D;
        }
        .transmutation-hint {
          text-align: center;
          margin-top: 1.5rem;
        }
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-120px) rotate(calc(-1 * var(--angle))); }
          25% { transform: translate(calc(-50% - 5px), -50%) rotate(var(--angle)) translateY(-120px) rotate(calc(-1 * var(--angle))); }
          75% { transform: translate(calc(-50% + 5px), -50%) rotate(var(--angle)) translateY(-120px) rotate(calc(-1 * var(--angle))); }
        }
      `;
            document.head.appendChild(style);
        },

        bindEvents() {
            document.querySelectorAll('.transmutation-symbol').forEach(btn => {
                btn.addEventListener('click', () => this.clickSymbol(btn));
            });
        },

        clickSymbol(btn) {
            const order = parseInt(btn.dataset.order);
            const expectedOrder = this.clickedOrder.length;

            if (order === expectedOrder) {
                // Correct
                btn.classList.add('is-active');
                btn.style.pointerEvents = 'none';
                this.clickedOrder.push(order);

                this.updateStatus(`${this.clickedOrder.length}/5 symboles activés`);

                if (this.clickedOrder.length === 5) {
                    this.complete();
                }
            } else {
                // Mauvais ordre
                btn.classList.add('is-wrong');
                setTimeout(() => btn.classList.remove('is-wrong'), 500);
                this.updateStatus('Mauvais ordre ! Réessayez depuis le début.');

                // Reset
                this.clickedOrder = [];
                document.querySelectorAll('.transmutation-symbol').forEach(b => {
                    b.classList.remove('is-active');
                    b.style.pointerEvents = 'auto';
                });
            }
        },

        updateStatus(message) {
            const status = document.getElementById('transmutation-status');
            if (status) status.textContent = message;
        },

        complete() {
            this.isComplete = true;
            this.updateStatus('✨ Transmutation réussie !');

            // Animation de transmutation
            const circle = document.querySelector('.transmutation-circle');
            circle.classList.add('transmutation-effect', 'is-active');

            setTimeout(() => {
                Utils.closeModal('modal-transmutation');
                window.App?.unlockSection(4);
            }, 2000);
        }
    },

    // ========== MATCHING GAME - SECTION 4 ==========

    matching: {
        pairs: [
            { id: 'fma', symbol: '⚙️', name: 'Bras d\'acier', work: 'Fullmetal Alchemist' },
            { id: 'spoon', symbol: '🥄', name: 'Cuillère', work: 'Silver Spoon' },
            { id: 'arslan', symbol: '⚔️', name: 'Épée', work: 'Arslan Senki' },
            { id: 'tsugai', symbol: '👥', name: 'Jumeaux', work: 'Tsugai' }
        ],
        selected: { symbol: null, work: null },
        matched: [],
        isComplete: false,

        init() {
            const gameArea = document.getElementById('matching-game-area');
            if (!gameArea) return;

            this.selected = { symbol: null, work: null };
            this.matched = [];
            this.isComplete = false;

            const shuffledSymbols = Utils.shuffle([...this.pairs]);
            const shuffledWorks = Utils.shuffle([...this.pairs]);

            this.addStyles();

            gameArea.innerHTML = `
        <div class="matching-container">
          <div class="matching-column matching-symbols">
            <h4>Symboles</h4>
            ${shuffledSymbols.map(p => `
              <button class="matching-card matching-card--symbol" data-id="${p.id}" data-type="symbol">
                <span class="matching-card__icon">${p.symbol}</span>
                <span class="matching-card__label">${p.name}</span>
              </button>
            `).join('')}
          </div>
          <div class="matching-column matching-works">
            <h4>Œuvres</h4>
            ${shuffledWorks.map(p => `
              <button class="matching-card matching-card--work" data-id="${p.id}" data-type="work">
                ${p.work}
              </button>
            `).join('')}
          </div>
        </div>
      `;

            this.bindEvents();
        },

        addStyles() {
            if (document.getElementById('matching-styles')) return;

            const style = document.createElement('style');
            style.id = 'matching-styles';
            style.textContent = `
        .matching-container {
          display: flex;
          gap: 2rem;
          justify-content: center;
        }
        .matching-column {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .matching-column h4 {
          text-align: center;
          color: #DBB448;
          margin-bottom: 0.5rem;
        }
        .matching-card {
          padding: 0.75rem 1rem;
          background: transparent;
          border: 2px solid #8E8E8D;
          color: #b5b5b4;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-body);
          font-size: 0.9rem;
        }
        .matching-card:hover {
          border-color: #70CBFF;
        }
        .matching-card.is-selected {
          border-color: #DBB448;
          background: rgba(219, 180, 72, 0.1);
        }
        .matching-card.is-matched {
          border-color: #4a9f4a;
          background: rgba(74, 159, 74, 0.2);
          opacity: 0.7;
          pointer-events: none;
        }
        .matching-card.is-wrong {
          border-color: #B80000;
          animation: shake 0.5s ease;
        }
        .matching-card--symbol {
          text-align: left;
        }
        .matching-card__icon {
          font-size: 1.3rem;
          margin-right: 0.5rem;
        }
        .matching-card__label {
          color: #8E8E8D;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `;
            document.head.appendChild(style);
        },

        bindEvents() {
            document.querySelectorAll('.matching-card').forEach(card => {
                card.addEventListener('click', () => this.selectCard(card));
            });
        },

        selectCard(card) {
            const id = card.dataset.id;
            const type = card.dataset.type;

            // Déselectionner si déjà sélectionné
            if (card.classList.contains('is-selected')) {
                card.classList.remove('is-selected');
                this.selected[type] = null;
                return;
            }

            // Déselectionner l'autre carte du même type
            document.querySelectorAll(`.matching-card[data-type="${type}"]`).forEach(c => {
                c.classList.remove('is-selected');
            });

            // Sélectionner cette carte
            card.classList.add('is-selected');
            this.selected[type] = id;

            // Vérifier si on a une paire
            if (this.selected.symbol && this.selected.work) {
                this.checkMatch();
            }

            this.updateStatus();
        },

        checkMatch() {
            if (this.selected.symbol === this.selected.work) {
                // Match correct
                const symbolCard = document.querySelector(`.matching-card--symbol[data-id="${this.selected.symbol}"]`);
                const workCard = document.querySelector(`.matching-card--work[data-id="${this.selected.work}"]`);

                symbolCard.classList.remove('is-selected');
                workCard.classList.remove('is-selected');
                symbolCard.classList.add('is-matched');
                workCard.classList.add('is-matched');

                this.matched.push(this.selected.symbol);
                this.selected = { symbol: null, work: null };

                if (this.matched.length === this.pairs.length) {
                    this.complete();
                }
            } else {
                // Mauvais match
                const symbolCard = document.querySelector(`.matching-card--symbol[data-id="${this.selected.symbol}"]`);
                const workCard = document.querySelector(`.matching-card--work[data-id="${this.selected.work}"]`);

                symbolCard.classList.add('is-wrong');
                workCard.classList.add('is-wrong');

                setTimeout(() => {
                    symbolCard.classList.remove('is-selected', 'is-wrong');
                    workCard.classList.remove('is-selected', 'is-wrong');
                }, 600);

                this.selected = { symbol: null, work: null };
            }
        },

        updateStatus() {
            const status = document.getElementById('matching-status');
            if (status) {
                status.textContent = `${this.matched.length}/${this.pairs.length} paires trouvées`;
            }
        },

        complete() {
            this.isComplete = true;
            const status = document.getElementById('matching-status');
            if (status) status.textContent = '🎉 Toutes les paires trouvées !';

            setTimeout(() => {
                Utils.closeModal('modal-matching');
                window.App?.unlockSection(5);
            }, 1500);
        }
    },

    // ========== QUIZ FINAL - SECTION 5 ==========

    finalQuiz: {
        questions: [
            {
                question: "Quel est le vrai prénom d'Hiromu Arakawa ?",
                options: ['Hiromi', 'Hiroko', 'Hitomi', 'Haruka'],
                answer: 0
            },
            {
                question: "Combien d'années Arakawa a travaillé à la ferme avant Tokyo ?",
                options: ['3 ans', '5 ans', '7 ans', '10 ans'],
                answer: 2
            },
            {
                question: "Quel manga se déroule dans un lycée agricole ?",
                options: ['Fullmetal Alchemist', 'Silver Spoon', 'Arslan Senki', 'Tsugai'],
                answer: 1
            },
            {
                question: "Combien de copies de FMA ont été vendues dans le monde ?",
                options: ['30 millions', '50 millions', '80 millions', '100 millions'],
                answer: 2
            },
            {
                question: "Sous quelle forme Arakawa se représente-t-elle ?",
                options: ['Un chat', 'Une vache', 'Un ours', 'Un lapin'],
                answer: 1
            }
        ],
        currentQuestion: 0,
        score: 0,
        isComplete: false,

        init() {
            const gameArea = document.getElementById('final-quiz-area');
            if (!gameArea) return;

            this.currentQuestion = 0;
            this.score = 0;
            this.isComplete = false;

            this.addStyles();
            this.showQuestion();
        },

        addStyles() {
            if (document.getElementById('final-quiz-styles')) return;

            const style = document.createElement('style');
            style.id = 'final-quiz-styles';
            style.textContent = `
        .final-quiz-question {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        .final-quiz-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .final-quiz-option {
          padding: 0.75rem 1rem;
          background: transparent;
          border: 2px solid #8E8E8D;
          color: #b5b5b4;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          font-family: var(--font-body);
        }
        .final-quiz-option:hover {
          border-color: #DBB448;
        }
        .final-quiz-option.is-correct {
          border-color: #4a9f4a !important;
          background: rgba(74, 159, 74, 0.2);
        }
        .final-quiz-option.is-wrong {
          border-color: #B80000 !important;
          background: rgba(184, 0, 0, 0.2);
        }
        .final-quiz-progress {
          margin-top: 1.5rem;
          text-align: center;
          color: #8E8E8D;
        }
      `;
            document.head.appendChild(style);
        },

        showQuestion() {
            const gameArea = document.getElementById('final-quiz-area');
            const q = this.questions[this.currentQuestion];

            gameArea.innerHTML = `
        <p class="final-quiz-question">${q.question}</p>
        <div class="final-quiz-options">
          ${q.options.map((opt, i) => `
            <button class="final-quiz-option" data-index="${i}">${opt}</button>
          `).join('')}
        </div>
        <p class="final-quiz-progress">Question ${this.currentQuestion + 1} / ${this.questions.length}</p>
      `;

            gameArea.querySelectorAll('.final-quiz-option').forEach(btn => {
                btn.addEventListener('click', () => this.checkAnswer(btn));
            });

            this.updateScore();
        },

        checkAnswer(btn) {
            const userAnswer = parseInt(btn.dataset.index);
            const q = this.questions[this.currentQuestion];
            const isCorrect = userAnswer === q.answer;

            // Désactiver les options
            document.querySelectorAll('.final-quiz-option').forEach((b, i) => {
                b.style.pointerEvents = 'none';
                if (i === q.answer) {
                    b.classList.add('is-correct');
                }
            });

            if (isCorrect) {
                this.score++;
            } else {
                btn.classList.add('is-wrong');
            }

            this.updateScore();

            setTimeout(() => {
                this.currentQuestion++;
                if (this.currentQuestion < this.questions.length) {
                    this.showQuestion();
                } else {
                    this.showResult();
                }
            }, 1500);
        },

        updateScore() {
            const scoreEl = document.getElementById('final-quiz-score');
            if (scoreEl) {
                scoreEl.textContent = `Score : ${this.score} / ${this.questions.length}`;
            }
        },

        showResult() {
            const gameArea = document.getElementById('final-quiz-area');
            const passed = this.score >= 3;

            gameArea.innerHTML = `
        <div style="text-align: center;">
          <h3 style="color: ${passed ? '#DBB448' : '#B80000'}; margin-bottom: 1rem;">
            ${passed ? '🏆 Félicitations, Alchimiste !' : '📚 Continuez à étudier !'}
          </h3>
          <p>Votre score : <strong>${this.score} / ${this.questions.length}</strong></p>
          <p style="margin-top: 1rem; color: #8E8E8D;">
            ${passed
                    ? 'Vous êtes digne du titre d\'Alchimiste d\'État !'
                    : 'Il vous faut au moins 3 bonnes réponses pour obtenir le certificat.'}
          </p>
          ${passed
                    ? '<button class="btn btn-primary" id="get-certificate" style="margin-top: 1.5rem;">Obtenir mon Certificat</button>'
                    : '<button class="btn btn-secondary" id="retry-final-quiz" style="margin-top: 1rem;">Réessayer</button>'
                }
        </div>
      `;

            if (passed) {
                this.isComplete = true;
                document.getElementById('get-certificate')?.addEventListener('click', () => {
                    Utils.closeModal('modal-final-quiz');
                    Utils.openModal('modal-certificate');
                });
            } else {
                document.getElementById('retry-final-quiz')?.addEventListener('click', () => {
                    this.init();
                });
            }
        }
    }
};

// Export pour utilisation globale
window.Games = Games;
