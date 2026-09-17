document.addEventListener('DOMContentLoaded', () => {

    // 1. Data Atual Formatada no Topo do Jornal
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.innerText = now.toLocaleDateString('pt-BR', options);
    }

    // 2. Sistema de Troca de Abas (Inspirado nas seções do QEdu)
    const tabItems = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabItems.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    // 3. Modal de Leitura da História da Patrona
    const btnHistoria = document.getElementById('btn-historia');
    const historiaModal = document.getElementById('historia-modal');
    const btnCloseHistoria = document.getElementById('btn-close-historia');

    if (btnHistoria && historiaModal) {
        btnHistoria.addEventListener('click', () => {
            historiaModal.classList.remove('hidden');
        });
    }

    if (btnCloseHistoria) {
        btnCloseHistoria.addEventListener('click', () => {
            historiaModal.classList.add('hidden');
        });
    }
});