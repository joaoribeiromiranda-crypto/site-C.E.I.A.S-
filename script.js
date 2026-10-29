// Credenciais de Administração
const ADMIN_EMAIL = "sjpambrosiasabatovich@seed.pr.gov.br";
const ADMIN_PASS = "ceias2026";

// Instâncias dos Gráficos
let chartIdebInstance = null;
let chartAprendizadoInstance = null;
let chartRendimentoInstance = null;

// Eventos Iniciais Padrão
const defaultEvents = [
    { id: 'evt-1', date: '28 SET', title: 'Simulado Prova Paraná', desc: 'Turmas de 9º Ano e 3º EM' },
    { id: 'evt-2', date: '05 OUT', title: 'Mostra Cultural da Colônia', desc: 'Apresentações na quadra coberta' }
];

// Carregamento do LocalStorage
let newsDatabase = JSON.parse(localStorage.getItem('ceias_news_db')) || [];
let eventsDatabase = JSON.parse(localStorage.getItem('ceias_events_db')) || defaultEvents;

document.addEventListener('DOMContentLoaded', () => {

    // 1. Data do Topo
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const now = new Date();
        dateEl.innerText = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // 2. Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.getElementById('nav-links-container');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('mobile-open');
        });
    }

    // 3. Navegação Suave entre Abas
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            navButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            
            const activePane = document.getElementById(`tab-${tabId}`);
            if (activePane) {
                activePane.classList.add('active');
            }

            if (navLinksContainer) navLinksContainer.classList.remove('mobile-open');

            setTimeout(() => {
                if (tabId === 'ideb') renderIdebChart();
                if (tabId === 'aprendizado') renderAprendizadoChart();
                if (tabId === 'rendimento') renderRendimentoChart();
            }, 60);
        });
    });

    // 4. Inicializa Notícias e Eventos
    renderNews(newsDatabase);
    renderEvents(eventsDatabase);

    // 5. Filtros de Notícia
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

    // 6. Busca
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

    // 7. Acessibilidade
    const gearBtn = document.getElementById('gear-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const toggleThemeBtn = document.getElementById('toggle-theme-btn');
    const fontIncrease = document.getElementById('font-increase');
    const fontDecrease = document.getElementById('font-decrease');
    const fontReset = document.getElementById('font-reset');

    if (gearBtn && settingsMenu) {
        gearBtn.addEventListener('click', () => settingsMenu.classList.toggle('hidden'));
    }

    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            renderIdebChart();
            renderAprendizadoChart();
            renderRendimentoChart();
        });
    }

    let currentFontSize = 16;
    if (fontIncrease) {
        fontIncrease.addEventListener('click', () => {
            if (currentFontSize < 20) {
                currentFontSize += 2;
                document.documentElement.style.setProperty('--base-font-size', currentFontSize + 'px');
            }
        });
    }

    if (fontDecrease) {
        fontDecrease.addEventListener('click', () => {
            if (currentFontSize > 13) {
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
});

// Renderizador do Feed de Notícias
function renderNews(list) {
    const container = document.getElementById('news-container');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 30px; text-align: center; border-radius: 4px;">
                <p style="font-size: 1.1rem; color: var(--royal-blue); font-weight: bold; margin-bottom: 8px;">Nenhuma matéria publicada ainda.</p>
                <p style="font-size: 0.85rem; color: var(--muted-color);">Utilize o botão "🔑 Painel CMS" para publicar novas matérias no site.</p>
            </div>`;
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

// Renderizador da Agenda de Eventos da Sidebar
function renderEvents(list) {
    const container = document.getElementById('events-container');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `<li style="font-size:0.85rem; color:var(--muted-color); padding:10px 0;">Nenhum evento agendado.</li>`;
        return;
    }

    container.innerHTML = list.map(evt => `
        <li>
            <div class="event-date">${evt.date}</div>
            <div class="event-details">
                <strong>${evt.title}</strong>
                <p>${evt.desc}</p>
            </div>
        </li>
    `).join('');
}

function openArticleModal(articleId) {
    const article = newsDatabase.find(n => n.id === articleId);
    if (!article) return;

    const modalContent = document.getElementById('modal-article-content');
    modalContent.innerHTML = `
        <span class="category-badge">${article.category.toUpperCase()}</span>
        <h2 style="font-size: 1.5rem; color: var(--royal-blue); margin: 10px 0 6px 0;">${article.title}</h2>
        <p class="article-meta">Autor: <strong>${article.author}</strong> | Data: ${article.date}</p>
        <hr style="margin: 12px 0; border: 0; border-top: 1px solid var(--border-color);">
        <p style="font-size: 0.95rem; line-height: 1.6;">${article.content}</p>
    `;
    document.getElementById('article-modal').classList.remove('hidden');
}

function closeArticleModal() {
    document.getElementById('article-modal').classList.add('hidden');
}

function closeCMSModal() {
    document.getElementById('cms-modal').classList.add('hidden');
}

// Alternar entre campos de Notícia e campos de Evento no CMS
function toggleCMSFields() {
    const type = document.getElementById('cms-type').value;
    const newsFields = document.getElementById('cms-news-fields');
    const eventFields = document.getElementById('cms-event-fields');

    if (type === 'news') {
        newsFields.classList.remove('hidden');
        eventFields.classList.add('hidden');
    } else {
        newsFields.classList.add('hidden');
        eventFields.classList.remove('hidden');
    }
}

// Operação CMS Unificada (Gerencia Notícias E Eventos)
function handleCMSPublish(event) {
    event.preventDefault();

    const inputEmail = document.getElementById('cms-email').value.trim();
    const inputPass = document.getElementById('cms-password').value.trim();
    const type = document.getElementById('cms-type').value;
    const action = document.getElementById('cms-action').value;

    if (inputEmail !== ADMIN_EMAIL || inputPass !== ADMIN_PASS) {
        alert("❌ ACESSO NEGADO: E-mail ou Senha incorretos!");
        return;
    }

    if (type === 'news') {
        const title = document.getElementById('cms-title').value.trim();
        const category = document.getElementById('cms-category').value;
        const excerpt = document.getElementById('cms-excerpt').value.trim();
        const content = document.getElementById('cms-content').value.trim();

        if (action === 'remove') {
            const countBefore = newsDatabase.length;
            newsDatabase = newsDatabase.filter(item => !item.title.toLowerCase().includes(title.toLowerCase()));
            if (newsDatabase.length < countBefore) {
                localStorage.setItem('ceias_news_db', JSON.stringify(newsDatabase));
                alert(`✅ Matéria "${title}" removida.`);
            } else {
                alert('⚠️ Nenhuma matéria correspondente foi encontrada.');
            }
        } else {
            if (!title || !excerpt || !content) {
                alert("⚠️ Preencha o Título, Resumo e Conteúdo da matéria.");
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
            alert(`🎉 Nova matéria publicada com sucesso!`);
        }
        renderNews(newsDatabase);

    } else if (type === 'event') {
        const eventTitle = document.getElementById('cms-event-title').value.trim();
        const eventDate = document.getElementById('cms-event-date').value.trim();
        const eventDesc = document.getElementById('cms-event-desc').value.trim();

        if (action === 'remove') {
            const countBefore = eventsDatabase.length;
            eventsDatabase = eventsDatabase.filter(e => !e.title.toLowerCase().includes(eventTitle.toLowerCase()));
            if (eventsDatabase.length < countBefore) {
                localStorage.setItem('ceias_events_db', JSON.stringify(eventsDatabase));
                alert(`✅ Evento "${eventTitle}" removido.`);
            } else {
                alert('⚠️ Nenhum evento correspondente encontrado.');
            }
        } else {
            if (!eventTitle || !eventDate) {
                alert("⚠️ Preencha a Data e o Título do Evento.");
                return;
            }

            const newEvent = {
                id: 'evt-' + Date.now(),
                date: eventDate,
                title: eventTitle,
                desc: eventDesc || 'Evento escolar'
            };

            eventsDatabase.push(newEvent);
            localStorage.setItem('ceias_events_db', JSON.stringify(eventsDatabase));
            alert(`📅 Evento adicionado à agenda com sucesso!`);
        }
        renderEvents(eventsDatabase);
    }

    closeCMSModal();
    document.getElementById('cms-form').reset();
    toggleCMSFields();
}

// Renderização dos Gráficos com Chart.js
function getTextColor() {
    return document.body.classList.contains('dark-theme') ? '#E2E8F0' : '#222222';
}

function renderIdebChart() {
    const canvas = document.getElementById('chartIdebProficiencia');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartIdebInstance) chartIdebInstance.destroy();

    chartIdebInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Língua Portuguesa', 'Matemática'],
            datasets: [{
                label: 'Pontuação Saeb',
                data: [271.5, 281.28],
                backgroundColor: ['#1B4998', '#C5A059']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: getTextColor() } },
                title: { display: true, text: 'Proficiência Média (Anos Finais)', color: getTextColor() }
            },
            scales: {
                y: { ticks: { color: getTextColor() }, min: 200, max: 350 },
                x: { ticks: { color: getTextColor() } }
            }
        }
    });
}

function renderAprendizadoChart() {
    const canvas = document.getElementById('chartEvolucaoAprendizado');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartAprendizadoInstance) chartAprendizadoInstance.destroy();

    chartAprendizadoInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: ['2019', '2021', '2023'],
            datasets: [
                {
                    label: 'Português (%)',
                    data: [36, 38, 32],
                    borderColor: '#1B4998',
                    backgroundColor: '#1B4998',
                    tension: 0.2
                },
                {
                    label: 'Matemática (%)',
                    data: [28, 25, 26],
                    borderColor: '#C5A059',
                    backgroundColor: '#C5A059',
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: getTextColor() } },
                title: { display: true, text: 'Aprendizado Adequado (9º Ano)', color: getTextColor() }
            },
            scales: {
                y: { ticks: { color: getTextColor() }, beginAtZero: true, max: 50 },
                x: { ticks: { color: getTextColor() } }
            }
        }
    });
}

function renderRendimentoChart() {
    const canvas = document.getElementById('chartRendimentoEnsinoMedio');
    if (!canvas || typeof Chart === 'undefined') return;

    if (chartRendimentoInstance) chartRendimentoInstance.destroy();

    chartRendimentoInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['1º EM', '2º EM', '3º EM'],
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
                legend: { labels: { color: getTextColor() } },
                title: { display: true, text: 'Rendimento (Ensino Médio)', color: getTextColor() }
            },
            scales: {
                y: { ticks: { color: getTextColor() }, beginAtZero: true, max: 100 },
                x: { ticks: { color: getTextColor() } }
            }
        }
    });
}