// Contenido de DashboardComponent.js (sin 'export')
function DashboardComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'grid';
    const counts = appData.counts;
    element.innerHTML = `
        <div class="card"><div class="card-badge">${counts.remindersCount}</div><button class="card-menu-btn" data-menu-id="menu-recordatorios">⋮</button><div class="card-icon" data-route="remindersList">🗓️</div><div class="card-title" data-route="remindersList">Recordatorios</div><div class="dropdown-menu" id="menu-recordatorios"><a class="dropdown-item" data-route="addReminder">Añadir</a><a class="dropdown-item" data-route="remindersList">Ver Lista</a></div></div>
        <div class="card"><div class="card-badge-group"><div class="card-badge green pill">${counts.shoppingPendingCount}</div><div class="card-badge red pill">${counts.shoppingBoughtCount}</div></div><button class="card-menu-btn" data-menu-id="menu-shopping">⋮</button><div class="card-icon" data-route="shoppingList">🛒</div><div class="card-title" data-route="shoppingList">Compras</div><div class="dropdown-menu" id="menu-shopping"><a class="dropdown-item" data-route="addShoppingItem">Añadir</a><a class="dropdown-item" data-route="shoppingList">Ver Lista</a></div></div>
        <div class="card"><div class="card-badge">${counts.notesCount}</div><button class="card-menu-btn" data-menu-id="menu-notes">⋮</button><div class="card-icon" data-route="notesList">📝</div><div class="card-title" data-route="notesList">Notas</div><div class="dropdown-menu" id="menu-notes"><a class="dropdown-item" data-route="addNote">Añadir</a><a class="dropdown-item" data-route="notesList">Ver Lista</a></div></div>
        <div class="card"><div class="card-badge">${counts.calendarTodayCount}</div><button class="card-menu-btn" data-menu-id="menu-calendar">⋮</button><div class="card-icon" data-route="viewAgenda">🗓️</div><div class="card-title" data-route="viewAgenda">Calendario</div><div class="dropdown-menu" id="menu-calendar"><a class="dropdown-item" data-route="addEvent">Añadir Evento</a><a class="dropdown-item" data-route="viewAgenda">Ver Agenda</a></div></div>
        <div class="card"><div class="card-badge pill">${(counts.gastosMesActual || '0,00').split(',')[0]}</div><button class="card-menu-btn" data-menu-id="menu-expenses">⋮</button><div class="card-icon" data-route="viewExpenses">💰</div><div class="card-title" data-route="viewExpenses">Gastos</div><div class="dropdown-menu" id="menu-expenses"><a class="dropdown-item" data-route="addExpense">Añadir</a><a class="dropdown-item" data-route="viewExpenses">Buscar</a><a class="dropdown-item" data-route="viewExpenseChart">Ver Gráfico</a></div></div>
        <div class="card" data-route="comingSoon"><div class="card-icon">⚙️</div><div class="card-title">Próximamente</div></div>`;
    
    element.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.card-menu-btn');
        const clickable = e.target.closest('[data-route]');
        if (menuBtn) { e.stopPropagation(); const menuId = menuBtn.dataset.menuId; const menu = element.querySelector(`#${menuId}`); if (menu) { const isShown = menu.classList.contains('show'); element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show')); if (!isShown) menu.classList.add('show'); } return; }
        if (clickable) { const route = clickable.dataset.route; element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show')); router.navigate(route); }
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.card')) { element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show')); } }, { once: true });
    return element;
}

// Contenido de main.js (sin imports y con el router simplificado)
document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) { tg.expand(); if (tg.themeParams) { document.documentElement.style.setProperty('--bg', tg.themeParams.bg_color || '#f5f7fa'); document.documentElement.style.setProperty('--card-bg', tg.themeParams.secondary_bg_color || '#ffffff'); document.documentElement.style.setProperty('--text', tg.themeParams.text_color || '#333333'); document.documentElement.style.setProperty('--muted', tg.themeParams.hint_color || '#555555'); document.documentElement.style.setProperty('--primary', tg.themeParams.button_color || '#4a76f3'); document.documentElement.style.setProperty('--action-text', tg.themeParams.button_text_color || '#ffffff'); } }

    const config = { webhookURL: 'https://script.google.com/macros/s/AKfycbxMy9HJ33GJz2S2RvWIFTc6AxI1L2EFw_cyVstKbmvEXQl43sbrYv3QE0dc6OhIX6XBpw/exec', chatId: tg?.initDataUnsafe?.user?.id || prompt('MODO DESARROLLO\n\nIngresa tu chat_ID:', '') };
    const AppState = { data: { counts: {}, remindersList: [], shoppingList: [], notesList: [] }, update(newData) { if (newData.error) throw new Error(newData.error); this.data = newData; } };
    const root = document.getElementById('app-root'), tabsRoot = document.getElementById('tabs-root'), spinner = document.getElementById('spinner'), toast = document.getElementById('toast');
    let toastTimer;

    const UI = {
        showSpinner: () => spinner.style.display = 'block',
        hideSpinner: () => spinner.style.display = 'none',
        showToast: (msg, isError = false) => { clearTimeout(toastTimer); toast.textContent = msg; toast.className = 'toast show' + (isError ? ' error' : ''); toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000); },
        render: (component) => { root.innerHTML = ''; root.appendChild(component); },
        renderTabs: (activeTabId) => { tabsRoot.innerHTML = `<div class="tabs"><div class="tab ${activeTabId === 'home' ? 'active' : ''}" id="tab-home">Home</div></div>`; document.getElementById('tab-home').onclick = () => App.router.navigate('dashboard'); }
    };

    const API = {
        fetch: async (payload) => {
            console.log("Iniciando fetch...");
            try {
                const response = await fetch(config.webhookURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({ chat_ID: config.chatId, ...payload }),
                    mode: 'cors'
                });
                if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error("Error atrapado en fetch:", error);
                throw error;
            }
        }
    };

    window.App = {
        router: {
            navigate(route, params = {}) {
                UI.renderTabs(route.includes('dashboard') ? 'home' : '');
                switch (route) {
                    case 'dashboard':
                        UI.render(DashboardComponent(AppState.data, this));
                        break;
                    default:
                        // Para la prueba, cualquier otra ruta simplemente mostrará una alerta.
                        tg.showAlert(`Ruta "${route}" no está habilitada en el modo de prueba.`);
                        break;
                }
            }
        },
        // Las actions no las necesitamos para la prueba inicial,
        // pero las dejamos para que no haya errores si algo las llama.
        actions: { showSpinner: UI.showSpinner, hideSpinner: UI.hideSpinner, showToast: UI.showToast },
        init() {
            UI.showSpinner();
            API.fetch({ Type: 'get_full_dashboard' })
                .then(data => {
                    AppState.update(data);
                    this.router.navigate('dashboard');
                })
                .catch(err => {
                    console.error('Error final en carga inicial:', err);
                    UI.showToast(`Error al cargar datos: ${err.message}`, true);
                    root.innerHTML = `<div class="no-data-msg">❌<br>Error al cargar la aplicación.<br><small>${err.message}</small><br><br><button onclick="window.location.reload()">Reintentar</button></div>`;
                })
                .finally(() => UI.hideSpinner());
        }
    };

    App.init();
});
