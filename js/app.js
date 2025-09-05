// Menu hambúrguer
// Quiz functionality
const quizAnswers = {
    basic: {
        'basic-q1': 'b', // <h1>
        'basic-q2': 'a', // criar um parágrafo
        'basic-q3': 'b', // color: red
        'basic-q4': 'b', // font-size
        'basic-q5': 'b', // var x = 5
        'basic-q6': 'b'  // console.log
    },
    intermediate: {
        'inter-q1': 'b', // pattern
        'inter-q2': 'b', // canvas para desenhos
        'inter-q3': 'b', // media queries
        'inter-q4': 'b', // fixed viewport
        'inter-q5': 'a', // event bubbling
        'inter-q6': 'b'  // closure
    }
};

function showQuiz(level) {
    // Esconde todos os quizzes
    document.getElementById('basic-quiz').style.display = 'none';
    document.getElementById('intermediate-quiz').style.display = 'none';

    // Mostra o quiz selecionado
    document.getElementById(`${level}-quiz`).style.display = 'block';

    // Reseta o quiz
    resetQuiz(level);
}

function checkQuiz(level) {
    let score = 0;
    let feedback = [];

    // Check each question
    Object.keys(quizAnswers[level]).forEach(question => {
        const selected = document.querySelector(`input[name="${question}"]:checked`);
        if (selected) {
            if (selected.value === quizAnswers[level][question]) {
                score++;
                feedback.push(`Questão ${question.replace(`${level}-q`, '')}: Correto! ✅`);
            } else {
                feedback.push(`Questão ${question.replace(`${level}-q`, '')}: Incorreto ❌`);
            }
        } else {
            feedback.push(`Questão ${question.replace(`${level}-q`, '')}: Não respondida ⚠️`);
        }
    });

    // Update results
    const resultsDiv = document.getElementById(`${level}-quiz-results`);
    const scoreSpan = document.getElementById(`${level}-score`);
    const feedbackDiv = document.getElementById(`${level}-feedback`);

    if (resultsDiv && scoreSpan && feedbackDiv) {
        scoreSpan.textContent = score;
        feedbackDiv.innerHTML = feedback.join('<br>');
        resultsDiv.style.display = 'block';
    }
}

function resetQuiz(level) {
    // Clear all selections for the specific level
    document.querySelectorAll(`input[name^="${level}-q"]`).forEach(radio => {
        radio.checked = false;
    });

    // Hide results
    const resultsDiv = document.getElementById(`${level}-quiz-results`);
    if (resultsDiv) {
        resultsDiv.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Quiz level selection
    const basicLevelBtn = document.getElementById('basic-level');
    const intermediateLevelBtn = document.getElementById('intermediate-level');

    if (basicLevelBtn) {
        basicLevelBtn.addEventListener('click', () => showQuiz('basic'));
    }

    if (intermediateLevelBtn) {
        intermediateLevelBtn.addEventListener('click', () => showQuiz('intermediate'));
    }

    // Quiz submission and reset for both levels
    const submitBasicQuiz = document.getElementById('submit-basic-quiz');
    const resetBasicQuiz = document.getElementById('reset-basic-quiz');
    const submitIntermediateQuiz = document.getElementById('submit-intermediate-quiz');
    const resetIntermediateQuiz = document.getElementById('reset-intermediate-quiz');

    if (submitBasicQuiz) {
        submitBasicQuiz.addEventListener('click', () => checkQuiz('basic'));
    }

    if (resetBasicQuiz) {
        resetBasicQuiz.addEventListener('click', () => resetQuiz('basic'));
    }

    if (submitIntermediateQuiz) {
        submitIntermediateQuiz.addEventListener('click', () => checkQuiz('intermediate'));
    }

    if (resetIntermediateQuiz) {
        resetIntermediateQuiz.addEventListener('click', () => resetQuiz('intermediate'));
    }

    // Original code continues...
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Theme: load preference from localStorage or system
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    function applyTheme(theme) {
        if (theme === 'dark') {
            htmlEl.classList.add('theme-dark');
            if (themeToggle) {
                themeToggle.textContent = '☀️';
                themeToggle.setAttribute('aria-pressed', 'true');
            }
        } else {
            htmlEl.classList.remove('theme-dark');
            if (themeToggle) {
                themeToggle.textContent = '🌙';
                themeToggle.setAttribute('aria-pressed', 'false');
            }
        }
        localStorage.setItem('theme', theme);
        currentTheme = theme;
    }

    if (themeToggle) {
        applyTheme(currentTheme);
        themeToggle.addEventListener('click', () => {
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            nav.classList.toggle('active');
            // move focus to first menu link when opening
            if (!expanded) {
                const firstLink = nav.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt+M => focus/menu
        if ((e.key === 'm' || e.key === 'M') && e.altKey) {
            e.preventDefault();
            if (menuToggle) {
                menuToggle.focus();
                menuToggle.click();
            }
        }

        // Home key => scroll to top
        if (e.key === 'Home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // '/' => focus search input if exists (e.g., tecnologias.html)
        if (e.key === '/') {
            const search = document.getElementById('tech-search');
            if (search) {
                e.preventDefault();
                search.focus();
            }
        }
    });

    // --- Tecnologias: filtros, busca e modal (se a página tiver elementos) ---
    const techGrid = document.getElementById('tech-grid');
    const techSearch = document.getElementById('tech-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modal = document.getElementById('tech-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalBullets = document.getElementById('modal-bullets');
    const modalLink = document.getElementById('modal-link');
    const modalClose = document.getElementById('modal-close');

    if (techGrid) {
        const cards = Array.from(techGrid.querySelectorAll('.tech-card'));

        // Apply saved filter
        const savedFilter = localStorage.getItem('tech-last-filter') || 'all';
        function applyFilter(filter, query='') {
            cards.forEach(card => {
                const category = card.dataset.category || '';
                const name = (card.dataset.name || '').toLowerCase();
                const matchesFilter = filter === 'all' || category === filter;
                const matchesQuery = !query || name.includes(query.toLowerCase());
                card.style.display = (matchesFilter && matchesQuery) ? '' : 'none';
            });
        }

        // Initialize
        applyFilter(savedFilter);
        filterBtns.forEach(btn => {
            const f = btn.dataset.filter;
            if (f === savedFilter) btn.setAttribute('aria-expanded', 'true');
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
                btn.setAttribute('aria-expanded', 'true');
                localStorage.setItem('tech-last-filter', f);
                applyFilter(f, techSearch ? techSearch.value : '');
            });
        });

        if (techSearch) {
            techSearch.value = techSearch.value || '';
            techSearch.addEventListener('input', (e) => {
                applyFilter(localStorage.getItem('tech-last-filter') || 'all', e.target.value);
            });
        }

        // Modal open on card click
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const name = card.dataset.name;
                const pros = (card.dataset.pros || '').split(';');
                const cons = (card.dataset.cons || '').split(';');
                const link = card.dataset.link;
                modalTitle.textContent = name;
                modalBody.textContent = card.querySelector('p') ? card.querySelector('p').textContent : '';
                modalBullets.innerHTML = '';
                // When choosing X? three bullets: 2 pros, 1 con as example guidance
                const bullets = [];
                if (pros[0]) bullets.push('Prós: ' + pros.slice(0,2).join(', '));
                bullets.push('Quando evitar: ' + (cons[0] || 'Considere alternativas'));
                bullets.forEach(b => {
                    const li = document.createElement('li');
                    li.textContent = b;
                    modalBullets.appendChild(li);
                });
                modalLink.href = link || '#';
                modal.setAttribute('aria-hidden', 'false');
                // focus
                modalClose.focus();
            });
        });

        // Close modal handlers
        function closeModal() {
            modal.setAttribute('aria-hidden', 'true');
        }
        if (modalClose) modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
+
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });
    }
});
