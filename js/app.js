/* ==========================================================================
   EXIM Bank IT Officer Exam Portal - Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSearch();
  initHighYieldToggle();
  initProgressTracker();
  initCodeCopy();
  initModalViewer();
  initSubjectSwitcher();
});

// Navigation & ScrollSpy
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.unit-section, .qb-section');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('appSidebar');

  // Toggle mobile sidebar
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Smooth scroll and active state
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
          }
        }
      }
    });
  });

  // ScrollSpy
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = '#' + sec.id;
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}

// Search & Filter
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const sections = document.querySelectorAll('.unit-section, .question-box');

    if (!term) {
      sections.forEach(sec => {
        sec.style.display = 'block';
        removeHighlights(sec);
      });
      return;
    }

    sections.forEach(sec => {
      const text = sec.textContent.toLowerCase();
      if (text.includes(term)) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
  });
}

function removeHighlights(element) {
  // Simple reset
}

// High-Yield Exam Mode (Formulas + Key Banking Points only)
function initHighYieldToggle() {
  const hyBtn = document.getElementById('highYieldToggle');
  if (!hyBtn) return;

  hyBtn.addEventListener('click', () => {
    document.body.classList.toggle('high-yield-active');
    const isActive = document.body.classList.contains('high-yield-active');
    hyBtn.classList.toggle('active', isActive);
    hyBtn.innerHTML = isActive 
      ? `<span>⚡</span> Exam High-Yield Active` 
      : `<span>⚡</span> High-Yield Mode`;
  });
}

// Progress Tracking with localStorage
function initProgressTracker() {
  const storageKey = 'exim_bank_os_progress';
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (e) {
    saved = {};
  }

  const markButtons = document.querySelectorAll('.btn-mark-complete');
  markButtons.forEach(btn => {
    const unitId = btn.getAttribute('data-unit');
    if (saved[unitId]) {
      markCompleted(btn, unitId, false);
    }

    btn.addEventListener('click', () => {
      const isDone = btn.classList.toggle('done');
      saved[unitId] = isDone;
      localStorage.setItem(storageKey, JSON.stringify(saved));
      updateProgressDisplay();
    });
  });

  updateProgressDisplay();

  function markCompleted(button, id, animate) {
    button.classList.add('done');
    button.textContent = '✓ Completed';
  }

  function updateProgressDisplay() {
    const total = document.querySelectorAll('.unit-section').length;
    let completed = 0;
    Object.keys(saved).forEach(k => {
      if (saved[k]) completed++;
    });
    const progressEl = document.getElementById('examProgressBar');
    const progressText = document.getElementById('progressText');
    if (progressEl && progressText) {
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      progressEl.style.width = pct + '%';
      progressText.textContent = `${completed} of ${total} Units Mastered (${pct}%)`;
    }
  }
}

// Copy CLI / Code snippet
function initCodeCopy() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const codeBlock = btn.closest('.code-container').querySelector('pre');
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent).then(() => {
          const original = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.color = '#34D399';
          setTimeout(() => {
            btn.textContent = original;
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });
}

// Image Zoom Modal
function initModalViewer() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const closeBtn = document.getElementById('modalClose');

  if (!modal || !modalImg) return;

  document.querySelectorAll('.diagram-img').forEach(img => {
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalCaption.textContent = img.alt || 'System Architecture Diagram';
      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

// Subject Switcher Handling
function initSubjectSwitcher() {
  const select = document.getElementById('subjectSelector');
  if (!select) return;

  select.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val !== 'os') {
      alert(`Subject "${e.target.options[e.target.selectedIndex].text}" will be added as requested! Currently viewing Operating Systems.`);
      select.value = 'os';
    }
  });
}
