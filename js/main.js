/**
 * ============================================
 * MAIN.JS - Site Hiromu Arakawa
 * ============================================
 * Logique principale, navigation, progression,
 * initialisation des composants
 * ============================================
 */

const App = {
    // État de l'application
    state: {
        currentSection: 1,
        unlockedSections: 1,
        isInitialized: false
    },

    // ========== INITIALISATION ==========

    /**
     * Initialise l'application
     */
    init() {
        if (this.state.isInitialized) return;

        console.log('🔮 Initialisation du site Hiromu Arakawa...');

        // Charger la progression sauvegardée
        this.loadSavedProgress();

        // Initialiser les composants
        this.initNavigation();
        this.initModals();
        this.initGameButtons();
        this.initCertificate();
        this.initProgressBar();

        // Initialiser le scroll reveal
        Utils.initScrollReveal();

        // Observer le scroll pour la section active
        this.initScrollObserver();

        // Appliquer l'état des sections
        this.applyUnlockedState();

        this.state.isInitialized = true;
        console.log('✅ Site initialisé. Sections débloquées:', this.state.unlockedSections);
    },

    /**
     * Charge la progression depuis localStorage
     */
    loadSavedProgress() {
        const progress = Utils.loadProgress();
        if (progress.sectionUnlocked) {
            this.state.unlockedSections = progress.sectionUnlocked;
        }
    },

    // ========== NAVIGATION ==========

    /**
     * Initialise la navigation
     */
    initNavigation() {
        // Liens de navigation
        document.querySelectorAll('.site-nav__link').forEach(link => {
            link.addEventListener('click', (e) => {
                const sectionNum = parseInt(link.dataset.section);

                if (sectionNum > this.state.unlockedSections) {
                    e.preventDefault();
                    Utils.shake(link);
                    Utils.showToast('Complétez les sections précédentes pour débloquer celle-ci.');
                }
            });
        });

        // Marqueurs de progression
        document.querySelectorAll('.progress-marker').forEach(marker => {
            marker.addEventListener('click', () => {
                const sectionNum = parseInt(marker.dataset.section);

                if (sectionNum <= this.state.unlockedSections) {
                    const sectionIds = ['atelier', 'terre', 'metal', 'multivers', 'heritage'];
                    Utils.scrollToSection(sectionIds[sectionNum - 1]);
                } else {
                    Utils.shake(marker);
                }
            });
        });
    },

    /**
     * Observer pour détecter la section visible
     */
    initScrollObserver() {
        const sections = document.querySelectorAll('.section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionNum = parseInt(entry.target.dataset.section);
                    this.setActiveSection(sectionNum);
                }
            });
        }, {
            threshold: 0.5
        });

        sections.forEach(section => observer.observe(section));
    },

    /**
     * Met à jour la section active
     */
    setActiveSection(sectionNum) {
        this.state.currentSection = sectionNum;

        // Mettre à jour la navigation
        document.querySelectorAll('.site-nav__link').forEach(link => {
            const linkSection = parseInt(link.dataset.section);
            link.classList.toggle('is-active', linkSection === sectionNum);
        });

        // Mettre à jour les marqueurs
        document.querySelectorAll('.progress-marker').forEach(marker => {
            const markerSection = parseInt(marker.dataset.section);
            marker.classList.toggle('is-active', markerSection === sectionNum);
        });

        // Mettre à jour la barre de progression
        this.updateProgressBar();
    },

    // ========== BARRE DE PROGRESSION ==========

    initProgressBar() {
        this.updateProgressBar();
    },

    updateProgressBar() {
        const liquid = document.getElementById('progress-liquid');
        if (liquid) {
            // Calculer le pourcentage basé sur les sections débloquées
            const percentage = ((this.state.unlockedSections - 1) / 4) * 100;
            liquid.style.height = `${percentage}%`;
        }

        // Mettre à jour les marqueurs
        document.querySelectorAll('.progress-marker').forEach(marker => {
            const markerSection = parseInt(marker.dataset.section);
            marker.classList.toggle('is-completed', markerSection < this.state.unlockedSections);
        });
    },

    // ========== SYSTÈME DE DÉVERROUILLAGE ==========

    /**
     * Applique l'état déverrouillé aux sections
     */
    applyUnlockedState() {
        for (let i = 2; i <= 5; i++) {
            const section = document.querySelector(`section[data-section="${i}"]`);
            const navLink = document.querySelector(`.site-nav__link[data-section="${i}"]`);
            const lockOverlay = section?.querySelector('.lock-overlay');

            if (i <= this.state.unlockedSections) {
                // Déverrouiller
                section?.classList.remove('section-locked');
                section?.classList.add('section-unlocked');
                // Supprimer complètement l'overlay pour les sections déjà débloquées
                if (lockOverlay) {
                    lockOverlay.remove();
                }
                navLink?.classList.remove('is-locked');
            } else {
                // Verrouiller
                section?.classList.add('section-locked');
                section?.classList.remove('section-unlocked');
                navLink?.classList.add('is-locked');
            }
        }

        this.updateProgressBar();
    },

    /**
     * Déverrouille une section
     */
    unlockSection(sectionNum) {
        if (sectionNum <= this.state.unlockedSections) return;

        console.log(`🔓 DÉBUT Déverrouillage section ${sectionNum}...`);

        this.state.unlockedSections = sectionNum;

        // Sauvegarder la progression
        Utils.saveProgress(sectionNum);
        console.log(`✅ Progression sauvegardée: section ${sectionNum}`);

        // Récupérer la section (élément <section>, pas le lien de navigation)
        const section = document.querySelector(`section[data-section="${sectionNum}"]`);
        console.log(`🔍 Section trouvée:`, section);

        if (section) {
            console.log(`📋 Classes AVANT:`, section.className);
            console.log(`🔒 section-locked présente AVANT:`, section.classList.contains('section-locked'));

            // IMPORTANT: Retirer immédiatement la classe section-locked
            // Cette classe crée le pseudo-élément ::before qui cache le contenu
            section.classList.remove('section-locked');
            section.classList.add('section-unlocked', 'unlock-animation');

            console.log(`📋 Classes APRÈS:`, section.className);
            console.log(`🔓 section-locked présente APRÈS:`, section.classList.contains('section-locked'));
            console.log(`✨ section-unlocked présente:`, section.classList.contains('section-unlocked'));

            // Récupérer et supprimer le lock overlay (cadenas)
            const lockOverlay = section.querySelector('.lock-overlay');
            console.log(`🔍 Lock overlay trouvé:`, lockOverlay);

            if (lockOverlay) {
                console.log(`🎯 Suppression du lock overlay...`);

                // Animation de l'icône cadenas
                const lockIcon = lockOverlay.querySelector('.lock-icon');
                lockIcon?.classList.add('lock-break');

                // Créer des particules pour l'effet visuel
                const particlesContainer = document.createElement('div');
                particlesContainer.className = 'particles-container';
                lockOverlay.appendChild(particlesContainer);
                Utils.createParticles(particlesContainer, 30);

                // Supprimer l'overlay après l'animation
                setTimeout(() => {
                    console.log(`🗑️ Suppression du lock overlay maintenant`);
                    lockOverlay.remove();
                    console.log(`✅ Lock overlay supprimé`);
                }, 900);
            } else {
                console.log(`⚠️ Aucun lock overlay trouvé dans la section`);
            }
        } else {
            console.error(`❌ Section ${sectionNum} non trouvée!`);
        }

        // Mettre à jour la navigation
        const navLink = document.querySelector(`.site-nav__link[data-section="${sectionNum}"]`);
        navLink?.classList.remove('is-locked');

        // Mettre à jour la barre de progression
        this.updateProgressBar();

        // Afficher notification
        const sectionNames = ['', 'L\'Atelier', 'La Terre', 'Le Métal', 'Le Multivers', 'L\'Héritage'];
        Utils.showToast(`🔓 Section "${sectionNames[sectionNum]}" déverrouillée !`);

        // Scroller vers la nouvelle section après un délai
        setTimeout(() => {
            const sectionIds = ['', 'atelier', 'terre', 'metal', 'multivers', 'heritage'];
            Utils.scrollToSection(sectionIds[sectionNum]);
        }, 1500);
    },

    // ========== MODALES ==========

    /**
     * Initialise les modales
     */
    initModals() {
        // Fermer avec le backdrop
        document.getElementById('modal-backdrop')?.addEventListener('click', () => {
            Utils.closeAllModals();
        });

        // Fermer avec les boutons de fermeture
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.closeAllModals();
            });
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Utils.closeAllModals();
            }
        });
    },

    // ========== BOUTONS DE JEUX ==========

    /**
     * Initialise les boutons pour lancer les jeux
     */
    initGameButtons() {
        // Section 1: Puzzle
        document.getElementById('btn-start-puzzle')?.addEventListener('click', () => {
            Utils.openModal('modal-puzzle');
            Games.puzzle.init();
        });

        // Section 2: Quiz Terre
        document.getElementById('btn-start-quiz-terre')?.addEventListener('click', () => {
            Utils.openModal('modal-quiz-terre');
            Games.quizTerre.init();
        });

        // Section 3: Transmutation
        document.getElementById('btn-start-transmutation')?.addEventListener('click', () => {
            Utils.openModal('modal-transmutation');
            Games.transmutation.init();
        });

        // Section 4: Matching Game
        document.getElementById('btn-start-matching')?.addEventListener('click', () => {
            Utils.openModal('modal-matching');
            Games.matching.init();
        });

        // Section 5: Quiz Final
        document.getElementById('btn-start-final-quiz')?.addEventListener('click', () => {
            Utils.openModal('modal-final-quiz');
            Games.finalQuiz.init();
        });
    },

    // ========== CERTIFICAT ==========

    /**
     * Initialise la génération du certificat
     */
    initCertificate() {
        const generateBtn = document.getElementById('btn-generate-certificate');
        const downloadBtn = document.getElementById('btn-download-certificate');
        const nameInput = document.getElementById('certificate-name-input');
        const canvas = document.getElementById('certificate-canvas');
        const display = document.getElementById('certificate-display');

        generateBtn?.addEventListener('click', () => {
            const name = nameInput?.value.trim();

            if (!name) {
                Utils.shake(nameInput);
                return;
            }

            // Générer le certificat
            Utils.generateCertificate(name, canvas);

            // Afficher le certificat
            display.style.display = 'block';
            generateBtn.style.display = 'none';
            nameInput.style.display = 'none';

            // Animation
            canvas.classList.add('certificate');
        });

        downloadBtn?.addEventListener('click', () => {
            const name = nameInput?.value.trim() || 'alchimiste';
            Utils.downloadCertificate(canvas, name);
        });

        // Permettre de valider avec Enter
        nameInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                generateBtn?.click();
            }
        });
    },

    // ========== MÉTHODES UTILITAIRES ==========

    /**
     * Réinitialise la progression (pour debug)
     */
    resetProgress() {
        Utils.resetProgress();
        this.state.unlockedSections = 1;
        location.reload();
    }
};

// Exposer l'App globalement
window.App = App;

// Initialiser quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Debug: permettre de reset depuis la console
console.log('💡 Pour réinitialiser la progression, utilisez: App.resetProgress()');
