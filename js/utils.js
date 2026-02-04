/**
 * ============================================
 * UTILS.JS - Site Hiromu Arakawa
 * ============================================
 * Fonctions utilitaires, gestion localStorage,
 * helpers pour animations
 * ============================================
 */

const Utils = {
  // ========== LOCAL STORAGE ==========
  
  /**
   * Sauvegarde la progression dans localStorage
   * @param {number} sectionUnlocked - Numéro de la dernière section débloquée (1-5)
   */
  saveProgress(sectionUnlocked) {
    try {
      const data = {
        sectionUnlocked,
        lastVisit: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('hiromu_arakawa_progress', JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage non disponible:', e);
    }
  },

  /**
   * Charge la progression depuis localStorage
   * @returns {Object} Données de progression
   */
  loadProgress() {
    try {
      const data = localStorage.getItem('hiromu_arakawa_progress');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Erreur lors du chargement de la progression:', e);
    }
    return { sectionUnlocked: 1, lastVisit: null };
  },

  /**
   * Réinitialise la progression
   */
  resetProgress() {
    try {
      localStorage.removeItem('hiromu_arakawa_progress');
    } catch (e) {
      console.warn('Erreur lors de la réinitialisation:', e);
    }
  },

  // ========== DOM HELPERS ==========

  /**
   * Sélecteur raccourci
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Sélecteur multiple
   */
  $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  /**
   * Ajoute une classe après un délai
   */
  addClassDelayed(element, className, delay) {
    setTimeout(() => {
      element.classList.add(className);
    }, delay);
  },

  /**
   * Retire une classe après un délai
   */
  removeClassDelayed(element, className, delay) {
    setTimeout(() => {
      element.classList.remove(className);
    }, delay);
  },

  // ========== ANIMATIONS ==========

  /**
   * Génère des particules d'énergie
   * @param {HTMLElement} container - Conteneur pour les particules
   * @param {number} count - Nombre de particules
   */
  createParticles(container, count = 20) {
    container.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Position aléatoire
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = `${Math.random() * 30}%`;
      
      // Délai aléatoire
      particle.style.animationDelay = `${Math.random() * 2}s`;
      
      container.appendChild(particle);
      
      // Déclencher l'animation
      requestAnimationFrame(() => {
        particle.classList.add('is-animating');
      });
    }
  },

  /**
   * Animation de secousse (shake)
   */
  shake(element) {
    element.classList.add('lock-shake');
    element.addEventListener('animationend', () => {
      element.classList.remove('lock-shake');
    }, { once: true });
  },

  /**
   * Animation de révélation
   */
  reveal(element) {
    element.classList.add('unlock-animation');
  },

  // ========== SCROLL ==========

  /**
   * Scroll fluide vers une section
   */
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Observer pour révéler les éléments au scroll
   */
  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });

    return observer;
  },

  // ========== MODALS ==========

  /**
   * Ouvre une modale
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-backdrop');
    
    if (modal && backdrop) {
      backdrop.classList.add('is-open');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      
      // Focus sur la modale
      modal.focus();
    }
  },

  /**
   * Ferme une modale
   */
  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const backdrop = document.getElementById('modal-backdrop');
    
    if (modal && backdrop) {
      modal.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  },

  /**
   * Ferme toutes les modales
   */
  closeAllModals() {
    document.querySelectorAll('.modal.is-open').forEach(modal => {
      modal.classList.remove('is-open');
    });
    document.getElementById('modal-backdrop')?.classList.remove('is-open');
    document.body.style.overflow = '';
  },

  // ========== TOAST NOTIFICATIONS ==========

  /**
   * Affiche une notification toast
   */
  showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('is-visible');
      
      setTimeout(() => {
        toast.classList.remove('is-visible');
      }, duration);
    }
  },

  // ========== CERTIFICAT ==========

  /**
   * Génère le certificat sur canvas
   * @param {string} userName - Nom de l'utilisateur
   * @param {HTMLCanvasElement} canvas - Élément canvas
   */
  generateCertificate(userName, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Fond
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, width, height);
    
    // Bordure dorée
    ctx.strokeStyle = '#DBB448';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Bordure intérieure
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    
    // Titre
    ctx.fillStyle = '#DBB448';
    ctx.font = 'bold 28px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICAT', width / 2, 70);
    
    ctx.font = '18px Cinzel, serif';
    ctx.fillText("D'ALCHIMISTE D'ÉTAT", width / 2, 100);
    
    // Texte principal
    ctx.fillStyle = '#b5b5b4';
    ctx.font = '14px Roboto, sans-serif';
    ctx.fillText('Ce document certifie que la nation d\'Amestris nomme', width / 2, 160);
    
    // Nom de l'utilisateur
    ctx.fillStyle = '#DBB448';
    ctx.font = 'bold 24px Special Elite, monospace';
    ctx.fillText(userName.toUpperCase(), width / 2, 200);
    
    // Suite du texte
    ctx.fillStyle = '#b5b5b4';
    ctx.font = '14px Roboto, sans-serif';
    ctx.fillText('en tant qu\'Alchimiste d\'État', width / 2, 240);
    ctx.fillText('pour services rendus dans la compréhension', width / 2, 265);
    ctx.fillText('de l\'œuvre de Hiromu Arakawa', width / 2, 290);
    
    // Symbole (simple cercle alchimique)
    ctx.strokeStyle = '#70CBFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width / 2, 345, 30, 0, Math.PI * 2);
    ctx.stroke();
    
    // Triangle intérieur
    ctx.beginPath();
    ctx.moveTo(width / 2, 320);
    ctx.lineTo(width / 2 - 20, 360);
    ctx.lineTo(width / 2 + 20, 360);
    ctx.closePath();
    ctx.stroke();
    
    // Date
    ctx.fillStyle = '#8E8E8D';
    ctx.font = '12px Special Elite, monospace';
    const date = new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.fillText(`Délivré le ${date}`, width / 2, 390);
  },

  /**
   * Télécharge le certificat
   */
  downloadCertificate(canvas, userName) {
    const link = document.createElement('a');
    link.download = `certificat-alchimiste-${userName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  // ========== HELPERS DIVERS ==========

  /**
   * Mélange un tableau (Fisher-Yates)
   */
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /**
   * Débounce une fonction
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Attente asynchrone
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// Export pour utilisation dans d'autres fichiers
window.Utils = Utils;
