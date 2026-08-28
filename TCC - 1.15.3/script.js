// trocarAba fora do DOMContentLoaded para ficar acessível globalmente via onclick=""
function trocarAba(aba) {
    const painelAtivo = document.querySelector('.aba-conteudo.visivel');

    function mostrarNovo() {
        document.querySelectorAll('.aba-conteudo').forEach(el => {
            el.classList.remove('visivel');
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
        });

        document.querySelectorAll('.genre-pill').forEach(btn => btn.classList.remove('active'));

        const novo = document.getElementById('aba-' + aba);
        if (novo) {
            novo.style.display = 'block';
            // Aguarda 1 frame para o display:block ter efeito antes de animar
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    novo.style.opacity = '1';
                    novo.style.transform = 'translateY(0)';
                    novo.classList.add('visivel');
                });
            });
        }

        document.querySelectorAll('.genre-pill').forEach(btn => {
            if ((btn.getAttribute('onclick') || '').includes(aba)) {
                btn.classList.add('active');
            }
        });

        lucide.createIcons();
    }

    // Se há um painel visível, faz fade-out dele antes
    if (painelAtivo) {
        painelAtivo.style.opacity = '0';
        painelAtivo.style.transform = 'translateY(10px)';
        setTimeout(mostrarNovo, 300); // aguarda o fade-out terminar
    } else {
        mostrarNovo();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const grid = document.getElementById('media-grid');
    const searchInput = document.getElementById('search-input');
    const modal = document.getElementById('modal');
    const genreTitle = document.getElementById('section-header');
    const genreBar = document.getElementById('genre-bar');
    const navSearchToggle = document.getElementById('nav-search-toggle');
    const navbar = document.querySelector('.navbar');

    // --- RENDERIZAÇÃO ---
    function renderCards(data) {
        if (!grid) return;
        grid.innerHTML = '';

        if (data.length === 0) {
            grid.innerHTML = '<p style="color: #aaa; font-size: 1.2rem;">Nenhuma oferta encontrada para esta categoria.</p>';
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.addEventListener('click', () => openModal(item));

            card.innerHTML = `
                <img src="${item.imagem}" alt="Capa de ${item.titulo}" class="card-thumb">
                <div class="card-overlay">
                    <button class="btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;">
                        <i data-lucide="play"></i> Ver Detalhes
                    </button>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${item.titulo}</h3>
                    <div class="card-meta">
                        <span class="card-tag">${item.genero}</span>
                        <span class="card-rating rating-${item.classificacao.sigla}">${item.classificacao.sigla}</span>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
        lucide.createIcons();
    }
 
    function closeModal() {
        const videoContainer = document.getElementById('modal-video');
        modal.classList.remove('show');
        modal.querySelector('.modal-content').style.transform = 'scale(0.95)';
        setTimeout(() => {
            videoContainer.innerHTML = '';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    function scrollToGrid() {
        document.getElementById('content-area').scrollIntoView({ behavior: 'smooth' });
    }

    function loadInitialGames() {
        const header = document.getElementById('section-header');
        if (header) header.innerText = 'Catálogo Completo';
        if (typeof localGameDatabase !== 'undefined') renderCards(localGameDatabase);
    }

    // Event Listeners — apenas para elementos que existem no HTML
    if (searchInput) searchInput.addEventListener('input', handleSearch);

    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    const exploreBtn = document.getElementById('explore-now-btn');
    if (exploreBtn) exploreBtn.addEventListener('click', scrollToGrid);

    // 'view-catalog-btn' removido — não existe no HTML atual

    const logoHome = document.getElementById('logo-home');
    if (logoHome) logoHome.addEventListener('click', (e) => {
        e.preventDefault();
        trocarAba('informacoes');
    });

    if (navSearchToggle) {
        navSearchToggle.addEventListener('click', () => {
            const searchContainer = document.querySelector('.nav-search');
            if (searchContainer) searchContainer.classList.toggle('active');
        });
    }

    // --- BUSCA ---
    function handleSearch(e) {
        const term = e.target.value.trim().toLowerCase();
        if (typeof localGameDatabase === 'undefined') return;

        if (!term) {
            renderCards(localGameDatabase);
            if (genreTitle) genreTitle.innerText = 'Catálogo Completo';
            return;
        }

        const filteredData = localGameDatabase.filter(item =>
            item.titulo.toLowerCase().includes(term) ||
            item.genero.toLowerCase().includes(term)
        );
        renderCards(filteredData);
        if (genreTitle) genreTitle.innerText = `Resultados da busca por "${term}"`;
    }

    // --- LÓGICA DO TEMA ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const THEME_KEY = 'movie-site-theme';

    function applyTheme(isLight) {
        if (isLight) {
            body.classList.add('light-mode');
            localStorage.setItem(THEME_KEY, 'light');
        } else {
            body.classList.remove('light-mode');
            localStorage.setItem(THEME_KEY, 'dark');
        }
    }

    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme === 'light');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            applyTheme(!body.classList.contains('light-mode'));
        });
    }

    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- INICIALIZAÇÃO ---
    loadInitialGames();
});