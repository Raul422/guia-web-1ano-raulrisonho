// Menu hambúrguer
document.addEventListener('DOMContentLoaded', () => {
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
