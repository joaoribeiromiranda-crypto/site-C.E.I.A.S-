// E-mail Gestor Responsável
const MANAGER_EMAIL = "gomes.souza17@escola.pr.gov.br";

// Banco de dados inicial em memória
let newsDatabase = [
    {
        id: 'feira-campo',
        title: 'Feira do Conhecimento do Campo Celebra Sustentabilidade na Colônia Marcelino',
        category: 'projetos',
        author: `Gestão (${MANAGER_EMAIL})`,
        date: '24/09/2026',
        excerpt: 'Estudantes do C.E.I.A.S. apresentaram maquetes, hortas comunitárias e inovações em agricultura familiar.',
        content: 'A feira reuniu a comunidade escolar para prestigiar projetos ecológicos desenvolvidos no Ensino Médio do Campo.'
    },
    {
        id: 'intercolegial-volei',
        title: 'Equipe de Vôlei do C.E.I.A.S. Garante Vaga no Torneio Regional',
        category: 'esportes',
        author: 'Prof. Carlos (Educação Física)',
        date: '22/09/2026',
        excerpt: 'Após vitória expressiva na fase municipal em São José dos Pinhais, time avança com destaque.',
        content: 'Os treinos contínuos no ginásio do colégio levaram os atletas à fase regional do Paraná.'
    }
];

document.addEventListener('DOMContentLoaded', () => {

    // 1. Data Atual Formatada
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const now = new Date();
        dateEl.innerText = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // 2. Troca de Abas
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // 3. Renderizar Feed de Notícias
    renderNews(newsDatabase);

    // 4. Filtro por Categoria
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.getAttribute('data-cat');
            if (cat === 'todos') {
                renderNews(newsDatabase);
            } else {
                renderNews(newsDatabase.filter(item => item.category === cat));
            }
        });
    });

    // 5. Pesquisa
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            renderNews(newsDatabase.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.excerpt.toLowerCase().includes(query)
            ));
        });
    }

    // 6. Engrenagem: Modo Noturno e Acessibilidade de Fonte
    const gearBtn = document.getElementById('gear-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const fontIncrease = document.getElementById('font-increase');
    const fontDecrease = document.getElementById('font-decrease');
    const fontReset = document.getElementById('font-reset');

    if (gearBtn && settingsMenu) {
        gearBtn.addEventListener('click', () => {
            settingsMenu.classList.toggle('hidden');
        });
    }

    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
        });
    }

    let currentFontSize = 16;
    if (fontIncrease) {
        fontIncrease.addEventListener('click', () => {
            if (currentFontSize < 22) {
                currentFontSize += 2;
                document.documentElement.style.setProperty('--base-font-size', currentFontSize + 'px');
            }
        });
    }

    if (fontDecrease) {
        fontDecrease.addEventListener('click', () => {
            if (currentFontSize > 12) {
                currentFontSize -= 2;
                document.documentElement.style.setProperty('--base-font-size', currentFontSize + 'px');
            }
        });
    }

    if (fontReset) {
        fontReset.addEventListener('click', () => {
            currentFontSize = 16;
            document.documentElement.style.setProperty('--base-font-size', '16px');
        });
    }

    // Abertura do Modal CMS
    const openCmsBtn = document.getElementById('open-cms-btn');
    if (openCmsBtn) {
        openCmsBtn.addEventListener('click', () => {
            document.getElementById('cms-modal').classList.remove('hidden');
        });
    }
});

// Renderizar Lista de Notícias
function renderNews(list) {
    const container = document.getElementById('news-container');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<p style="padding:20px; text-align:center;">Nenhuma notícia encontrada.</p>`;
        return;
    }

    container.innerHTML = list.map(item => `
        <article class="news-card">
            <span class="category-badge">${item.category.toUpperCase()}</span>
            <h3>${item.title}</h3>
            <p class="article-meta">Por: ${item.author} • ${item.date}</p>
            <p class="excerpt">${item.excerpt}</p>
            <button class="read-more-btn" onclick="openArticleModal('${item.id}')">Ler Matéria Completa →</button>
        </article>
    `).join('');
}

// Modal Leitura
function openArticleModal(articleId) {
    const article = newsDatabase.find(n => n.id === articleId);
    if (!article) return;

    const modalContent = document.getElementById('modal-article-content');
    modalContent.innerHTML = `
        <span class="category-badge">${article.category.toUpperCase()}</span>
        <h2 style="font-size: 1.7rem; color: var(--royal-blue); margin: 12px 0 8px 0;">${article.title}</h2>
        <p class="article-meta">Autor: <strong>${article.author}</strong> | Data: ${article.date}</p>
        <hr style="margin: 15px 0; border: 0; border-top: 1px solid var(--border-color);">
        <p style="font-size: 1rem; line-height: 1.7;">${article.content}</p>
    `;
    document.getElementById('article-modal').classList.remove('hidden');
}

function closeArticleModal() {
    document.getElementById('article-modal').classList.add('hidden');
}

function closeCMSModal() {
    document.getElementById('cms-modal').classList.add('hidden');
}

// Gestão de Publicação e Remoção (CMS)
function handleCMSPublish(event) {
    event.preventDefault();

    const title = document.getElementById('cms-title').value;
    const category = document.getElementById('cms-category').value;
    const action = document.getElementById('cms-action').value;
    const excerpt = document.getElementById('cms-excerpt').value;
    const content = document.getElementById('cms-content').value;

    if (action === 'remove') {
        const countBefore = newsDatabase.length;
        newsDatabase = newsDatabase.filter(item => !item.title.toLowerCase().includes(title.toLowerCase()));
        
        if (newsDatabase.length < countBefore) {
            alert(`✅ A matéria contendo "${title}" foi removida com sucesso do jornal pelo e-mail autorizado ${MANAGER_EMAIL}.`);
        } else {
            alert('⚠️ Nenhuma matéria com esse título foi encontrada para remoção.');
        }
    } else {
        const newArticle = {
            id: 'news-' + Date.now(),
            title: title,
            category: category,
            author: `Gestão (${MANAGER_EMAIL})`,
            date: new Date().toLocaleDateString('pt-BR'),
            excerpt: excerpt,
            content: content
        };
        newsDatabase.unshift(newArticle);
        alert(`🎉 Nova matéria publicada com sucesso no ar com aprovação de ${MANAGER_EMAIL}!`);
    }

    renderNews(newsDatabase);
    closeCMSModal();
    document.getElementById('cms-form').reset();
}