/* ==========================================================================
   iOS APP STUDY ENGINE - JAVASCRIPT
   High-Speed Loading & Student-Friendly Learning Engine
   Zero Emojis - Pure Performance
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollHeader();
  initQuizInteractions();
  initSegmentedNavigation();
  initMobileBottomBar();
  initDiagramModal();
  initCodeCopy();
  initSearch();
  initHighYieldToggle();
  initResetQuizButton();
  restoreQuizProgress();
});

// ==============================================================================
// 1. QUIZ & KNOWLEDGE CHECK ENGINE (STUDENT LEARNING SCORECARD)
// ==============================================================================
function initQuizInteractions() {
  // Option button click handler (Instant correct/wrong feedback)
  document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const parentCard = this.closest('.quiz-card');
      const isCorrect = this.getAttribute('data-correct') === 'true';
      const allOptions = parentCard.querySelectorAll('.quiz-opt-btn');

      // Clear previous states in this quiz card
      allOptions.forEach(opt => {
        opt.classList.remove('correct', 'wrong');
        opt.disabled = true; // disable options after answering
      });

      if (isCorrect) {
        this.classList.add('correct');
        markQuizAnswered(parentCard, true, this);
      } else {
        this.classList.add('wrong');
        // Highlight correct option
        allOptions.forEach(opt => {
          if (opt.getAttribute('data-correct') === 'true') {
            opt.classList.add('correct');
          }
        });
        markQuizAnswered(parentCard, false, this);
      }

      // Automatically reveal answer explanation
      const answerContent = parentCard.querySelector('.quiz-answer-content');
      const revealBtn = parentCard.querySelector('.quiz-reveal-btn');
      if (answerContent) {
        answerContent.classList.add('open');
        if (revealBtn) {
          revealBtn.innerHTML = '<span>Answer Details</span><span>−</span>';
        }
      }
    });
  });

  // Accordion reveal toggle (Click to reveal answer +)
  document.querySelectorAll('.quiz-reveal-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const parentCard = this.closest('.quiz-card');
      const answerContent = parentCard.querySelector('.quiz-answer-content');
      if (!answerContent) return;

      const isOpen = answerContent.classList.contains('open');
      if (isOpen) {
        answerContent.classList.remove('open');
        this.innerHTML = '<span>Click to reveal answer</span><span>+</span>';
      } else {
        answerContent.classList.add('open');
        this.innerHTML = '<span>Hide answer details</span><span>−</span>';
      }
    });
  });
}

function markQuizAnswered(card, isCorrect, clickedBtn) {
  const quizId = card.id || ('quiz_' + Math.random().toString(36).substr(2, 6));
  let saved = JSON.parse(localStorage.getItem('ios_quiz_progress') || '{}');
  
  // Find index of clicked option to restore on reload
  const allBtns = Array.from(card.querySelectorAll('.quiz-opt-btn'));
  const clickedIndex = clickedBtn ? allBtns.indexOf(clickedBtn) : -1;

  saved[quizId] = {
    status: isCorrect ? 'correct' : 'wrong',
    selectedIndex: clickedIndex
  };
  localStorage.setItem('ios_quiz_progress', JSON.stringify(saved));
  updateProgressDisplay();
}

function restoreQuizProgress() {
  const saved = JSON.parse(localStorage.getItem('ios_quiz_progress') || '{}');
  
  Object.keys(saved).forEach(quizId => {
    const card = document.getElementById(quizId);
    if (!card) return;

    const data = saved[quizId];
    const allBtns = card.querySelectorAll('.quiz-opt-btn');
    allBtns.forEach(btn => btn.disabled = true);

    if (data.selectedIndex >= 0 && allBtns[data.selectedIndex]) {
      if (data.status === 'correct') {
        allBtns[data.selectedIndex].classList.add('correct');
      } else {
        allBtns[data.selectedIndex].classList.add('wrong');
        // also highlight correct one
        allBtns.forEach(btn => {
          if (btn.getAttribute('data-correct') === 'true') {
            btn.classList.add('correct');
          }
        });
      }
    }

    // Reveal explanation
    const answerContent = card.querySelector('.quiz-answer-content');
    const revealBtn = card.querySelector('.quiz-reveal-btn');
    if (answerContent) {
      answerContent.classList.add('open');
      if (revealBtn) {
        revealBtn.innerHTML = '<span>Answer Details</span><span>−</span>';
      }
    }
  });

  updateProgressDisplay();
}

function initResetQuizButton() {
  const resetBtn = document.getElementById('resetQuizBtn');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('ios_quiz_progress');
    document.querySelectorAll('.quiz-card').forEach(card => {
      const btns = card.querySelectorAll('.quiz-opt-btn');
      btns.forEach(b => {
        b.disabled = false;
        b.classList.remove('correct', 'wrong');
      });
      const answerContent = card.querySelector('.quiz-answer-content');
      const revealBtn = card.querySelector('.quiz-reveal-btn');
      if (answerContent) answerContent.classList.remove('open');
      if (revealBtn) revealBtn.innerHTML = '<span>Click to reveal answer</span><span>+</span>';
    });
    updateProgressDisplay();
  });
}

function updateProgressDisplay() {
  const progressBar = document.getElementById('progressBarFill');
  const scoreBadge = document.getElementById('studentScoreBadge');
  if (!progressBar || !scoreBadge) return;

  const totalQuizzes = document.querySelectorAll('.quiz-card').length || 8;
  const saved = JSON.parse(localStorage.getItem('ios_quiz_progress') || '{}');
  const answeredKeys = Object.keys(saved);
  const correctCount = answeredKeys.filter(k => saved[k].status === 'correct').length;
  const answeredCount = answeredKeys.length;

  const percent = Math.min(100, Math.round((answeredCount / totalQuizzes) * 100));
  progressBar.style.width = percent + '%';

  if (answeredCount === 0) {
    scoreBadge.textContent = 'Score: 0 / ' + totalQuizzes + ' (Not Started)';
    scoreBadge.classList.remove('mastered');
  } else if (correctCount === totalQuizzes) {
    scoreBadge.textContent = 'Score: ' + correctCount + ' / ' + totalQuizzes + ' (100% Exam Ready!)';
    scoreBadge.classList.add('mastered');
  } else {
    scoreBadge.textContent = 'Score: ' + correctCount + ' / ' + totalQuizzes + ' (' + Math.round((correctCount/totalQuizzes)*100) + '%)';
    scoreBadge.classList.remove('mastered');
  }
}

// ==============================================================================
// 2. SEGMENTED CONTROL & SECTION FILTERING (INCLUDING QUIZ FOCUS MODE)
// ==============================================================================
function initSegmentedNavigation() {
  const segmentBtns = document.querySelectorAll('.ios-segment-btn');
  const unitCards = document.querySelectorAll('.unit-card');
  const qbCards = document.querySelectorAll('.qb-card');

  segmentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      segmentBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      // Reset any active focus modes first
      document.body.classList.remove('quiz-focus-mode');

      const mindmapSection = document.getElementById('mindmapsMaster');
      if (filter === 'all') {
        if (mindmapSection) mindmapSection.style.display = 'block';
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'block');
      } else if (filter === 'units') {
        if (mindmapSection) mindmapSection.style.display = 'none';
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'none');
      } else if (filter === 'mindmaps') {
        if (mindmapSection) {
          mindmapSection.style.display = 'block';
          mindmapSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'none');
      } else if (filter === 'flowcharts') {
        if (mindmapSection) mindmapSection.style.display = 'none';
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'none');
        const firstFlow = document.querySelector('.flowchart-container');
        if (firstFlow) {
          firstFlow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (filter === 'quizzes') {
        // Dedicated Student Quiz Practice Mode!
        document.body.classList.add('quiz-focus-mode');
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'none');
        window.scrollTo({ top: 180, behavior: 'smooth' });
      } else if (filter === 'diagrams') {
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'none');
        const firstDiagram = document.querySelector('.diagram-figure');
        if (firstDiagram) {
          firstDiagram.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (filter === 'questions') {
        unitCards.forEach(c => c.style.display = 'none');
        qbCards.forEach(c => c.style.display = 'block');
        const firstQB = document.querySelector('.qb-card');
        if (firstQB) {
          firstQB.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// ==============================================================================
// 3. MOBILE BOTTOM TAB BAR
// ==============================================================================
function initMobileBottomBar() {
  const tabItems = document.querySelectorAll('.ios-tab-item');
  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      tabItems.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetAction = tab.getAttribute('data-tab');

      if (targetAction === 'units') {
        const segAll = document.querySelector('.ios-segment-btn[data-filter="units"]');
        if (segAll) segAll.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetAction === 'quizzes') {
        const segQuizzes = document.querySelector('.ios-segment-btn[data-filter="quizzes"]');
        if (segQuizzes) segQuizzes.click();
      } else if (targetAction === 'diagrams') {
        const segDiagrams = document.querySelector('.ios-segment-btn[data-filter="diagrams"]');
        if (segDiagrams) segDiagrams.click();
      } else if (targetAction === 'search') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else if (targetAction === 'practice') {
        const segQB = document.querySelector('.ios-segment-btn[data-filter="questions"]');
        if (segQB) segQB.click();
      }
    });
  });
}

// ==============================================================================
// 4. HIGH-SPEED DEBOUNCED SEARCH FILTER
// ==============================================================================
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const countDisplay = document.getElementById('searchResultsCount');
  if (!searchInput) return;

  let debounceTimer = null;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim();
      const unitCards = document.querySelectorAll('.unit-card');
      const qbCards = document.querySelectorAll('.qb-card');

      if (!query) {
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'block');
        if (countDisplay) countDisplay.style.display = 'none';
        return;
      }

      let matches = 0;

      unitCards.forEach(card => {
        const content = card.textContent.toLowerCase();
        if (content.includes(query)) {
          card.style.display = 'block';
          matches++;
        } else {
          card.style.display = 'none';
        }
      });

      qbCards.forEach(card => {
        const content = card.textContent.toLowerCase();
        if (content.includes(query)) {
          card.style.display = 'block';
          matches++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countDisplay) {
        countDisplay.style.display = 'block';
        countDisplay.textContent = matches === 1 ? 'Found 1 matching study section' : 'Found ' + matches + ' matching study sections';
      }
    }, 120); // 120ms debounce prevents CPU stutter on mobile devices
  });
}

// ==============================================================================
// 5. HIGH-YIELD MODE TOGGLE
// ==============================================================================
function initHighYieldToggle() {
  const btn = document.getElementById('highYieldBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const isHighYield = document.body.classList.toggle('high-yield-active');
    if (isHighYield) {
      btn.classList.add('primary');
    } else {
      btn.classList.remove('primary');
    }
  });
}

// ==============================================================================
// 6. DIAGRAM MODAL ZOOM (TAP TO ENLARGE)
// ==============================================================================
function initDiagramModal() {
  const modal = document.getElementById('diagramModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.getElementById('modalClose');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.diagram-img, .diagram-zoom-hint').forEach(el => {
    el.addEventListener('click', () => {
      const figure = el.closest('.diagram-figure');
      const img = figure.querySelector('.diagram-img');
      if (img) {
        modalImg.src = img.src;
        modal.classList.add('active');
      }
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === closeBtn) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==============================================================================
// 7. ONE-CLICK CODE COPY
// ==============================================================================
function initCodeCopy() {
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeWrapper = btn.closest('.code-wrapper');
      const codeText = codeWrapper.querySelector('.code-block').innerText;

      navigator.clipboard.writeText(codeText).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Copied!</span>';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 2000);
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    });
  });
}

// ==============================================================================
// 8. HIGH-PERFORMANCE HEADER VANISH ON SCROLL DOWN (MOBILE OPTIMIZED)
// ==============================================================================
function initScrollHeader() {
  const navbar = document.querySelector('.ios-navbar');
  if (!navbar) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Top of page: always show header
        if (currentScrollY <= 25) {
          navbar.classList.remove('header-hidden');
          document.body.classList.remove('header-is-hidden');
        } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
          // Scrolling down: hide header to maximize reading space
          navbar.classList.add('header-hidden');
          document.body.classList.add('header-is-hidden');
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up: reveal header smoothly
          navbar.classList.remove('header-hidden');
          document.body.classList.remove('header-is-hidden');
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
