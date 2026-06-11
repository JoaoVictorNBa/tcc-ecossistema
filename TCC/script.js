document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const grid = document.getElementById('media-grid');
    const searchInput = document.getElementById('search-input');
    const modal = document.getElementById('modal');
    const genreTitle = document.getElementById('section-header');
    const genreBar = document.getElementById('genre-bar');
    const themeToggle = document.getElementById('theme-toggle');
    const navSearchToggle = document.getElementById('nav-search-toggle');
    const navbar = document.querySelector('.navbar');

    let database = [];

 const localGameDatabase = [
    {     
        id: 1,
        titulo: "O que é Reciclagem?",
        descricao: "A reciclagem é o processo de conversão de resíduos em novos materiais e objetos. É uma alternativa à eliminação de resíduos 'convencional' que pode salvar materiais e ajudar a reduzir as emissões de gases de efeito estufa.",
        imagem: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800",
        genero: "Reciclagem",
        plataformas: ["Educação Ambiental", "Sustentabilidade"],
        classificacao: { sigla: "L", descricao: "Livre para todos os públicos" },
        trailer: "https://www.youtube.com/embed/6_6vXInN-Z0",
        linkLoja: "https://pt.wikipedia.org/wiki/Reciclagem"
    },
    {
        id: 2,
        titulo: "Entendendo o Chorume",
        descricao: "O chorume é um líquido escuro proveniente da decomposição de matéria orgânica. Aprenda como ele afeta o solo e como o tratamento adequado pode gerar biogás e energia.",
        imagem: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=800",
        genero: "Chorume",
        plataformas: ["Química Ambiental", "Resíduos Orgânicos"],
        classificacao: { sigla: "12", descricao: "Recomendado para maiores de 12 anos" },
        trailer: "https://www.youtube.com/embed/3q8Y_oF8-9w",
        linkLoja: "https://brasilescola.uol.com.br/o-que-e/biologia/o-que-e-chorume.htm"
    },
    {
        id: 3,
        titulo: "Tipos de Lixo",
        descricao: "Você sabia que nem todo lixo é igual? Conheça as diferenças entre lixo doméstico, industrial, hospitalar e eletrônico para fazer o descarte correto.",
        imagem: "https://images.unsplash.com/photo-1591193520257-c030ea85780c?q=80&w=800",
        genero: "Lixos",
        plataformas: ["Cidadania", "Meio Ambiente"],
        classificacao: { sigla: "L", descricao: "Livre" },
        trailer: "https://www.youtube.com/embed/v9S5X_K2fIk",
        linkLoja: "https://www.todamateria.com.br/tipos-de-lixo/"
    },
    {
        id: 4,
        titulo: "Terra Orgânica e Compostagem",
        descricao: "Transforme restos de comida em adubo rico para suas plantas. A terra orgânica melhora a estrutura do solo e retém mais umidade.",
        imagem: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=800",
        genero: "Terra orgânica",
        plataformas: ["Jardinagem", "Orgânicos"],
        classificacao: { sigla: "L", descricao: "Livre" },
        trailer: "https://www.youtube.com/embed/mG3uO83jTVE",
        linkLoja: "https://blog.ciclovivo.com.br/como-fazer-compostagem-caseira/"
    },
    {
        id: 5,
        titulo: "Guia do Descarte Correto",
        descricao: "Aprenda a separar seu lixo de forma eficiente. Onde jogar pilhas, baterias e óleos usados sem prejudicar o ecossistema.",
        imagem: "https://images.unsplash.com/photo-1605600611284-195205ef91b6?q=80&w=800",
        genero: "Descarte correto",
        plataformas: ["Prática Sustentável"],
        classificacao: { sigla: "L", descricao: "Livre" },
        trailer: "https://www.youtube.com/embed/jZzM_NIsjZc",
        linkLoja: "https://www.ecycle.com.br/descarte-correto/"
    },
    {
        id: 6,
        titulo: "Sobre os Criadores",
        descricao: "Este projeto foi desenvolvido para o TCC com o objetivo de conscientizar a população sobre práticas sustentáveis.",
        imagem: "img/PICAPAL.jpg",
        genero: "Informações do criador",
        plataformas: ["TCC 2024", "Educação"],
        classificacao: { sigla: "L", descricao: "Livre" },
        trailer: "",
        linkLoja: "https://github.com/JoaoVictorNBa"
    }
 ];
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

    function populateGenreFilter() {
        if (!genreBar) return;

        // Pega todos os gêneros únicos do banco de dados
        const allGenres = [...new Set(localGameDatabase.map(game => game.genero))];
        // Coloca 'Todos' no início
        const filterGenres = ['Todos', ...allGenres];

        genreBar.innerHTML = '';
        filterGenres.forEach(genre => {
            const btn = document.createElement('button');
            btn.className = 'genre-pill';
            btn.textContent = genre;
            
            if (genre === 'Todos') {
                btn.classList.add('active');
            }

            btn.addEventListener('click', () => filterByGenre(genre));
            genreBar.appendChild(btn);
        });
    }

    // --- FILTRAGEM E BUSCA ---
    async function filterByGenre(genre) {
        document.querySelectorAll('.genre-pill').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === genre) {
                btn.classList.add('active');
            }
        });
        
        genreTitle.innerText = genre === 'Todos' ? 'Catálogo Completo' : `Gênero: ${genre}`;
        searchInput.value = '';

        const filteredGames = genre === 'Todos' 
            ? localGameDatabase 
            : localGameDatabase.filter(game => game.genero === genre);
        
        renderCards(filteredGames);

        if (window.scrollY > document.querySelector('.hero').offsetHeight) scrollToGrid();
    }

    async function handleSearch(e) {
        const term = e.target.value.trim().toLowerCase();

        if (!term) {
            filterByGenre('Todos');
            return;
        }

        const filteredData = localGameDatabase.filter(item => 
            item.titulo.toLowerCase().includes(term) || 
            item.genero.toLowerCase().includes(term)
        );
        renderCards(filteredData);
        genreTitle.innerText = `Resultados da busca por "${term}"`;
    }

    // --- LÓGICA DO MODAL ---
    async function openModal(item) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const videoContainer = document.getElementById('modal-video');

        modalTitle.innerText = item.titulo;
        modalDesc.innerText = 'Carregando detalhes...';
        videoContainer.innerHTML = `<iframe src="${item.trailer}?autoplay=1&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        setTimeout(() => modal.querySelector('.modal-content').style.transform = 'scale(1)', 10);
        renderModalDetails(item);
    }

    function renderModalDetails(details) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc'); 
        const modalInfoGrid = document.getElementById('modal-info-grid');
        const modalScreenshotsContainer = document.getElementById('modal-screenshots-container');
        const modalActions = document.getElementById('modal-actions');
        const modalAgeRating = document.getElementById('modal-age-rating');
        const screenshotsSection = document.getElementById('modal-screenshots-section');

        modalTitle.innerText = details.titulo;
        modalDesc.innerHTML = details.descricao || 'Descrição não disponível.';

        const platforms = details.plataformas.join(', ');
        
        modalInfoGrid.innerHTML = `
            <div class="info-item"><strong>Gênero</strong><span>${details.genero}</span></div>
            <div class="info-item"><strong>Plataformas</strong><span>${platforms}</span></div>
        `;

        modalAgeRating.textContent = details.classificacao.sigla;
        modalAgeRating.className = `age-rating rating-${details.classificacao.sigla}`;
        modalAgeRating.title = `Classificação: ${details.classificacao.descricao}`;
        modalAgeRating.style.display = 'block';

        screenshotsSection.style.display = 'none';
        modalScreenshotsContainer.innerHTML = '';

        modalActions.innerHTML = `
            <a href="${details.linkLoja}" target="_blank" class="btn btn-primary">
                <i data-lucide="external-link"></i> Saiba Mais
            </a>
        `;
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
        genreTitle.innerText = 'Catálogo Completo';
        renderCards(localGameDatabase);
    }

    // Event Listeners
    searchInput.addEventListener('input', handleSearch);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('explore-now-btn').addEventListener('click', scrollToGrid);
    document.getElementById('view-catalog-btn').addEventListener('click', () => filterByGenre('Todos'));
    document.getElementById('logo-home').addEventListener('click', (e) => {
        e.preventDefault();
        filterByGenre('Todos');
    });

    navSearchToggle.addEventListener('click', () => {
        const searchContainer = document.querySelector('.nav-search');
        searchContainer.classList.toggle('active');
    });
    
    // --- LÓGICA DO TEMA ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const THEME_KEY = 'movie-site-theme'; // Chave para localStorage

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
    if (savedTheme === 'light') {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isLight = body.classList.contains('light-mode');
            
            applyTheme(!isLight);
        });
    }


    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    
    // --- INICIALIZAÇÃO DA APLICAÇÃO ---
    loadInitialGames();
    populateGenreFilter();
}); 



    