// Credenciais Únicas de Gestão
const ADMIN_EMAIL = "sjpambrosiasabatovich@seed.pr.gov.br";
const ADMIN_PASS = "ceias2026";

// Notícias Iniciais Padrão
const defaultNews = [
    {
        id: 'destaque-ideb',
        title: 'C.E.I.A.S. Alcança Nota 5,8 no IDEB dos Anos Finais',
        category: 'institucional',
        author: `Gestão (${ADMIN_EMAIL})`,
        date: '10/10/2026',
        excerpt: 'Combinação de excelente índice de aprovação (99,0%) e nota média SAEB de 5,88 fortalece o colégio como referência no espaço rural.',
        content: 'O Colégio Estadual do Campo Irmã Ambrósia Sabatovich celebrou o excelente resultado no IDEB. O indicador é composto pela taxa de aprovação de 99,0% combinada com médias expressivas no exame Saeb: 271,5 em Língua Portuguesa e 281,3 em Matemática.'
    },
    {
        id: 'feira-campo',
        title: 'Feira do Conhecimento Rural Celebra Sustentabilidade na Colônia Marcelino',
        category: 'projetos',
        author: `Grêmio Estudantil`,
        date: '24/09/2026',
        excerpt: 'Estudantes apresentaram maquetes ecológicas, projetos de hortas e inovações em agricultura familiar.',
        content: 'A feira anual reuniu a comunidade local para prestigiar projetos ecológicos e práticos desenvolvidos pelos alunos do Ensino Fundamental II e Ensino Médio do Campo.'
    }
];

// Instâncias de Gráficos (Chart.js)
let chartIdeb = null;
let chartAprendizado = null;
let chartRendimento = null;

// Banco de dados dinâmico via LocalStorage
let newsDatabase = JSON.parse(localStorage.getItem('ceias_news_db')) || defaultNews;

document.addEventListener('DOMContentLoaded', () => {

    // Data Formatada no Topo
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const now = new Date();
        dateEl.innerText = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Navegação por Abas
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');

            if (tabId === 'ideb') initIdebChart();
            if (tabId === 'aprendizado') initAprendizadoChart();
            if (tabId === 'rendimento') initRendimentoChart();
        });
    });

    // Renderizar Notícias
    renderNews(newsDatabase);

    // Filtros de Categoria
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

    // Pesquisa Dinâmica
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

    // Configurações e Engrenagem (Acessibilidade)
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
            initIdebChart();
            initAprendizadoChart();
            initRendimentoChart();
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

    // CMS Modal
    const openCmsBtn = document.getElementById('open-cms-btn');
    if (openCmsBtn) {
        openCmsBtn.addEventListener('click', () => {
            document.getElementById('cms-modal').classList.remove('hidden');
        });
    }

    // Inicialização do Gráfico do IDEB
    initIdebChart();
});

// Renderizar Notícias
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

// Gestão CMS
function handleCMSPublish(event) {
    event.preventDefault();

    const inputEmail = document.getElementById('cms-email').value.trim();
    const inputPass = document.getElementById('cms-password').value.trim();
    const title = document.getElementById('cms-title').value.trim();
    const category = document.getElementById('cms-category').value;
    const action = document.getElementById('cms-action').value;
    const excerpt = document.getElementById('cms-excerpt').value.trim();
    const content = document.getElementById('cms-content').value.trim();

    if (inputEmail !== ADMIN_EMAIL || inputPass !== ADMIN_PASS) {
        alert("❌ ACESSO NEGADO: E-mail ou Senha incorretos!");
        return;
    }

    if (action === 'remove') {
        const countBefore = newsDatabase.length;
        newsDatabase = newsDatabase.filter(item => !item.title.toLowerCase().includes(title.toLowerCase()));
        
        if (newsDatabase.length < countBefore) {
            localStorage.setItem('ceias_news_db', JSON.stringify(newsDatabase));
            alert(`✅ A matéria "${title}" foi PERMANENTEMENTE removida.`);
        } else {
            alert('⚠️ Nenhuma matéria correspondente foi encontrada para remoção.');
        }
    } else {
        if (!excerpt || !content) {
            alert("⚠️ Preencha o Resumo e o Texto Completo para publicar.");
            return;
        }

        const newArticle = {
            id: 'news-' + Date.now(),
            title: title,
            category: category,
            author: `Gestão (${ADMIN_EMAIL})`,
            date: new Date().toLocaleDateString('pt-BR'),
            excerpt: excerpt,
            content: content
        };

        newsDatabase.unshift(newArticle);
        localStorage.setItem('ceias_news_db', JSON.stringify(newsDatabase));
        alert(`🎉 Nova matéria PERMANENTEMENTE publicada no site!`);
    }

    renderNews(newsDatabase);
    closeCMSModal();
    document.getElementById('cms-form').reset();
}

/* ==========================================================================
   INICIALIZAÇÃO DOS GRÁFICOS (CHART.JS)
   ========================================================================== */

function getThemeTextColor() {
    return document.body.classList.contains('dark-theme') ? '#E2E8F0' : '#222222';
}

function initIdebChart() {
    const ctx = document.getElementById('chartIdebProficiencia');
    if (!ctx) return;
    if (chartIdeb) chartIdeb.destroy();

    chartIdeb = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Língua Portuguesa', 'Matemática'],
            datasets: [{
                label: 'Média do Colégio (Saeb 2025)',
                data: [271.5, 281.28],
                backgroundColor: ['#1B4998', '#C5A059'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: getThemeTextColor() } },
                title: { display: true, text: 'Pontuação Padronizada Saeb (Escala 0-500)', color: getThemeTextColor() }
            },
            scales: {
                y: { ticks: { color: getThemeTextColor() }, beginAtZero: false, min: 200, max: 350 },
                x: { ticks: { color: getThemeTextColor() } }
            }
        }
    });
}

function initAprendizadoChart() {
    const ctx = document.getElementById('chartEvolucaoAprendizado');
    if (!ctx) return;
    if (chartAprendizado) chartAprendizado.destroy();

    chartAprendizado = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2019', '2021', '2023'],
            datasets: [
                {
                    label: 'Português Adequado (%)',
                    data: [36, 38, 32],
                    borderColor: '#1B4998',
                    backgroundColor: '#1B4998',
                    tension: 0.2,
                    fill: false
                },
                {
                    label: 'Matemática Adequada (%)',
                    data: [28, 25, 26],
                    borderColor: '#C5A059',
                    backgroundColor: '#C5A059',
                    tension: 0.2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: getThemeTextColor() } },
                title: { display: true, text: 'Evolução % de Alunos no Nível Adequado (9º Ano)', color: getThemeTextColor() }
            },
            scales: {
                y: { ticks: { color: getThemeTextColor() }, beginAtZero: true, max: 50 },
                x: { ticks: { color: getThemeTextColor() } }
            }
        }
    });
}

function initRendimentoChart() {
    const ctx = document.getElementById('chartRendimentoEnsinoMedio');
    if (!ctx) return;
    if (chartRendimento) chartRendimento.destroy();

    chartRendimento = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1º Ano EM', '2º Ano EM', '3º Ano EM'],
            datasets: [
                {
                    label: 'Aprovação (%)',
                    data: [88.1, 98.3, 90.2],
                    backgroundColor: '#2E7D32'
                },
                {
                    label: 'Reprovação (%)',
                    data: [11.9, 1.7, 9.8],
                    backgroundColor: '#C62828'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: getThemeTextColor() } },
                title: { display: true, text: 'Rendimento Escolar Por Série (Ensino Médio 2025)', color: getThemeTextColor() }
            },
            scales: {
                y: { ticks: { color: getThemeTextColor() }, beginAtZero: true, max: 100 },
                x: { ticks: { color: getThemeTextColor() } }
            }
        }
    });
}