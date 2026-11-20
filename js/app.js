/* ==========================================================================
   iOS APP STUDY ENGINE - JAVASCRIPT
   Clean, Fast, Responsive Interaction with Zero Emojis
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initQuizInteractions();
  initSegmentedNavigation();
  initMobileBottomBar();
  initDiagramModal();
  initCodeCopy();
  initSearch();
  initProgressTracker();
});

// ==============================================================================
// 1. QUIZ & KNOWLEDGE CHECK ENGINE
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
        opt.disabled = true; // disable after answer
      });

      if (isCorrect) {
        this.classList.add('correct');
        markQuizAnswered(parentCard, true);
      } else {
        this.classList.add('wrong');
        // Highlight correct option
        allOptions.forEach(opt => {
          if (opt.getAttribute('data-correct') === 'true') {
            opt.classList.add('correct');
          }
        });
        markQuizAnswered(parentCard, false);
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

function markQuizAnswered(card, isCorrect) {
  const quizId = card.id || ('quiz_' + Math.random().toString(36).substr(2, 6));
  let saved = JSON.parse(localStorage.getItem('ios_quiz_progress') || '{}');
  saved[quizId] = isCorrect ? 'correct' : 'wrong';
  localStorage.setItem('ios_quiz_progress', JSON.stringify(saved));
  updateProgressDisplay();
}

// ==============================================================================
// 2. SEGMENTED CONTROL & SECTION FILTERING
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

      if (filter === 'all') {
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'block');
      } else if (filter === 'units') {
        unitCards.forEach(c => c.style.display = 'block');
        qbCards.forEach(c => c.style.display = 'none');
      } else if (filter === 'quizzes') {
        // Show unit cards and scroll to quiz or focus quizzes
        unitCards.forEach(c => {
          c.style.display = 'block';
        });
        qbCards.forEach(c => c.style.display = 'none');
        const firstQuiz = document.querySelector('.quiz-card');
        if (firstQuiz) {
          firstQuiz.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
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
// 4. DIAGRAM MODAL ZOOM (TAP TO ENLARGE)
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
// 5. ONE-CLICK CODE COPY
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
// 6. REAL-TIME SEARCH FILTER
// ==============================================================================
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const unitCards = document.querySelectorAll('.unit-card');
    const qbCards = document.querySelectorAll('.qb-card');

    if (!query) {
      unitCards.forEach(c => c.style.display = 'block');
      qbCards.forEach(c => c.style.display = 'block');
      return;
    }

    unitCards.forEach(card => {
      const content = card.textContent.toLowerCase();
      if (content.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });

    qbCards.forEach(card => {
      const content = card.textContent.toLowerCase();
      if (content.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// ==============================================================================
// 7. STUDY PROGRESS TRACKER
// ==============================================================================
function initProgressTracker() {
  updateProgressDisplay();
}

function updateProgressDisplay() {
  const progressBar = document.getElementById('progressBarFill');
  const progressText = document.getElementById('progressPercentText');
  if (!progressBar || !progressText) return;

  const totalQuizzes = document.querySelectorAll('.quiz-card').length || 8;
  const saved = JSON.parse(localStorage.getItem('ios_quiz_progress') || '{}');
  const answeredCount = Object.keys(saved).length;

  const percent = Math.min(100, Math.round((answeredCount / totalQuizzes) * 100));
  progressBar.style.width = percent + '%';
  progressText.textContent = percent + '% Complete';
}
