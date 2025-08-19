function AgendaViewComponent(router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    element.innerHTML = `<div class="list-header"><button class="back-btn">‹</button><h2>Agenda</h2></div><ul class="list-style-none"></ul>`;
    element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
    
    const listEl = element.querySelector('.list-style-none');

    async function loadEvents() {
        App.actions.showSpinner();
        try {
            const startDate = new Date(); startDate.setHours(0,0,0,0);
            const endDate = new Date(startDate); endDate.setDate(startDate.getDate() + 30);
            const events = await App.actions.fetchCalendarEvents(startDate.toISOString(), endDate.toISOString());
            
            if (events.error) throw new Error(events.error);
            
            if (events.length === 0) {
                listEl.innerHTML = '<div class="no-data-msg">🗓️<br>No tienes eventos próximos.</div>';
                return;
            }

            const eventsByDay = events.reduce((acc, event) => {
                const day = new Date(event.start).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
                if (!acc[day]) acc[day] = [];
                acc[day].push(event);
                return acc;
            }, {});

            let html = '';
            for (const day in eventsByDay) {
                html += `<h3 class="day-header">${day}</h3>`;
                html += events.filter(e => new Date(e.start).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) === day)
                    .map(event => {
                        const startTime = new Date(event.start).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                        const endTime = new Date(event.end).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                        return `<li class="list-item" id="event-${event.id}"><div class="list-item-content"><div class="list-item-details"><span class="list-item-title">${event.summary}</span><span class="list-item-subtitle">${startTime} - ${endTime}</span></div><button class="generic-menu-btn" data-menu-id="menu-event-${event.id}">⋮</button></div><div class="dropdown-menu" id="menu-event-${event.id}"><a class="dropdown-item" href="${event.htmlLink}" target="_blank">Ver en Google</a><a class="dropdown-item" data-action="delete-event" data-event-id="${event.id}">Eliminar</a></div></li>`;
                    }).join('');
            }
            listEl.innerHTML = html;

        } catch (err) {
            listEl.innerHTML = `<div class="no-data-msg">❌<br>Error al cargar la agenda.<br><small>${err.message}</small></div>`;
        } finally {
            App.actions.hideSpinner();
        }
    }
    
    listEl.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.generic-menu-btn');
        if (menuBtn) {
            e.stopPropagation();
            const menuId = menuBtn.dataset.menuId;
            const menu = element.querySelector(`#${menuId}`);
            if (menu) {
                const isShown = menu.classList.contains('show');
                element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
                if (!isShown) menu.classList.add('show');
            }
            return;
        }

        const actionItem = e.target.closest('.dropdown-item');
        if (actionItem && actionItem.dataset.action === 'delete-event') {
            if(confirm('¿Eliminar este evento?')) {
                App.actions.deleteCalendarEvent(actionItem.dataset.eventId)
                    .then(() => { App.actions.showToast('Evento eliminado'); loadEvents(); })
                    .catch(err => App.actions.showToast(err.message, true));
            }
        }
    });

    document.addEventListener('click', (e) => { if (!e.target.closest('.list-item')) { element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show')); } }, { once: true });

    loadEvents();
    return element;
}
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

{ DashboardComponent } from '../components/Dashboard.js';
{ ShoppingListComponent } from '../components/ShoppingList.js';
{ ShoppingItemFormComponent } from '../components/ShoppingItemForm.js';
{ RemindersListComponent } from '../components/RemindersList.js';
{ ReminderFormComponent } from '../components/ReminderForm.js';
{ NotesListComponent } from '../components/NotesList.js';
{ NoteFormComponent } from '../components/NoteForm.js';
{ AgendaViewComponent } from '../components/AgendaView.js';
{ EventFormComponent } from '../components/EventForm.js';
{ ExpensesListComponent } from '../components/ExpensesList.js';
{ ExpenseFormComponent } from '../components/ExpenseFormComponent.js';
{ ExpenseChartComponent } from '../components/ExpenseChartComponent.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- INICIO DEL CÓDIGO DE DEPURACIÓN ---
    try { 
    // --- FIN DEL CÓDIGO DE DEPURACIÓN ---

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
            // --- INICIO DEL CÓDIGO DE DEPURACIÓN ---
            console.log("Paso 1: Entrando en la función API.fetch.");
            const fullPayload = { chat_ID: config.chatId, ...payload };
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(fullPayload),
                mode: 'cors'
            };
            console.log("Paso 2: URL a la que se va a conectar:", config.webhookURL);
            console.log("Paso 3: Opciones de la petición:", options);
            // --- FIN DEL CÓDIGO DE DEPURACIÓN ---
            
            try {
                const response = await fetch(config.webhookURL, options);
                console.log("Paso 4: La petición fetch se completó. Respuesta del servidor:", response);
                if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
                const data = await response.json();
                console.log("Paso 5: Datos JSON recibidos:", data);
                return data;
            } catch (error) {
                console.error("Paso X: ERROR ATRAPADO DENTRO DE FETCH", error);
                throw error;
            }
        }
    };

    window.App = {
        router: {
            navigate(route, params = {}) {
                UI.renderTabs(route.includes('dashboard') ? 'home' : '');
                switch (route) {
                    case 'dashboard': UI.render(DashboardComponent(AppState.data, this)); break;
                    case 'shoppingList': UI.render(ShoppingListComponent(AppState.data, this)); break;
                    case 'addShoppingItem': UI.render(ShoppingItemFormComponent(null, this)); break;
                    case 'remindersList': UI.render(RemindersListComponent(AppState.data, this)); break;
                    case 'addReminder': UI.render(ReminderFormComponent(null, this)); break;
                    case 'editReminder': UI.render(ReminderFormComponent(params.reminder, this)); break;
                    case 'notesList': UI.render(NotesListComponent(AppState.data, this)); break;
                    case 'addNote': UI.render(NoteFormComponent(null, this)); break;
                    case 'editNote': UI.render(NoteFormComponent(params.note, this)); break;
                    case 'viewAgenda': UI.render(AgendaViewComponent(this)); break;
                    case 'addEvent': UI.render(EventFormComponent(this)); break;
                    case 'viewExpenses': UI.render(ExpensesListComponent(this)); break;
                    case 'addExpense': UI.render(ExpenseFormComponent(this)); break;
                    case 'viewExpenseChart': UI.render(ExpenseChartComponent(AppState.data, this)); break;
                    default: tg.showAlert(`Ruta "${route}" no implementada.`);
                }
            }
        },
        actions: {
            showSpinner: UI.showSpinner,
            hideSpinner: UI.hideSpinner,
            showToast: UI.showToast,
            // ... (el resto de las acciones no necesitan cambios)
            toggleShoppingItem: (trackingCode) => { const originalData = JSON.parse(JSON.stringify(AppState.data)); const itemIndex = AppState.data.shoppingList.findIndex(i => i['3'] === trackingCode); if (itemIndex === -1) return; const newStatus = AppState.data.shoppingList[itemIndex]['2'] === 'Pendiente' ? 'Comprado' : 'Pendiente'; AppState.data.shoppingList[itemIndex]['2'] = newStatus; if(newStatus === 'Comprado') { AppState.data.counts.shoppingPendingCount--; AppState.data.counts.shoppingBoughtCount++; } else { AppState.data.counts.shoppingPendingCount++; AppState.data.counts.shoppingBoughtCount--; } UI.render(ShoppingListComponent(AppState.data, App.router)); API.fetch({ Type: 'toggle_item_status', tracking_code: trackingCode }).then(data => AppState.update(data)).catch(() => { UI.showToast('Error de Sincronización', true); AppState.data = originalData; UI.render(ShoppingListComponent(AppState.data, App.router)); }); },
            addShoppingItem: (description, cycle) => { UI.showSpinner(); API.fetch({ Type: 'add_articulo', description, cycle }).then(data => { AppState.update(data); App.router.navigate('shoppingList'); }).catch(err => UI.showToast(err.message, true)).finally(() => UI.hideSpinner()); },
            deleteShoppingItem: (trackingCode) => { const originalData = JSON.parse(JSON.stringify(AppState.data)); const itemIndex = AppState.data.shoppingList.findIndex(i => i['3'] === trackingCode); if (itemIndex > -1) { const item = AppState.data.shoppingList[itemIndex]; if(item['2'] === 'Pendiente') AppState.data.counts.shoppingPendingCount--; else AppState.data.counts.shoppingBoughtCount--; AppState.data.shoppingList.splice(itemIndex, 1); UI.render(ShoppingListComponent(AppState.data, App.router)); } API.fetch({ Type: 'delete_item_shopping_list', tracking_code: trackingCode }).then(data => AppState.update(data)).catch(() => { UI.showToast('Error de Sincronización', true); AppState.data = originalData; UI.render(ShoppingListComponent(AppState.data, App.router)); }); },
            toggleMultipleToPending: (codes) => { UI.showSpinner(); API.fetch({ Type: 'toggle_multiple_to_pending', tracking_codes: codes }).then(data => { AppState.update(data); UI.render(ShoppingListComponent(AppState.data, App.router)); }).catch(err => UI.showToast(err.message, true)).finally(() => UI.hideSpinner()); },
            saveReminder: (payload) => { UI.showSpinner(); API.fetch(payload).then(data => { AppState.update(data); App.router.navigate('remindersList'); UI.showToast('Recordatorio guardado'); }).catch(err => UI.showToast(err.message, true)).finally(() => UI.hideSpinner()); },
            deleteReminder: (trackingCode) => { const originalData = JSON.parse(JSON.stringify(AppState.data)); const itemIndex = AppState.data.remindersList.findIndex(i => i.tracking_code === trackingCode); if (itemIndex > -1) { AppState.data.remindersList.splice(itemIndex, 1); AppState.data.counts.remindersCount--; UI.render(RemindersListComponent(AppState.data, App.router)); } API.fetch({ Type: 'delete_reminder', tracking_code: trackingCode }).then(data => AppState.update(data)).catch(() => { UI.showToast('Error de Sincronización', true); AppState.data = originalData; UI.render(RemindersListComponent(AppState.data, App.router)); }); },
            saveNote: (payload) => { UI.showSpinner(); API.fetch(payload).then(data => { AppState.update(data); App.router.navigate('notesList'); UI.showToast('Nota guardada'); }).catch(err => UI.showToast(err.message, true)).finally(() => UI.hideSpinner()); },
            deleteNote: (noteId) => { const originalData = JSON.parse(JSON.stringify(AppState.data)); const itemIndex = AppState.data.notesList.findIndex(i => i.Nota_ID === noteId); if (itemIndex > -1) { AppState.data.notesList.splice(itemIndex, 1); AppState.data.counts.notesCount--; UI.render(NotesListComponent(AppState.data, App.router)); } API.fetch({ Type: 'delete_note', note_id: noteId }).then(data => AppState.update(data)).catch(() => { UI.showToast('Error de Sincronización', true); AppState.data = originalData; UI.render(NotesListComponent(AppState.data, App.router)); }); },
            fetchCalendarEvents: (startDate, endDate) => API.fetch({ Type: 'get_calendar_events', startDate, endDate }),
            addCalendarEvent: (eventData) => { const startDate = new Date(eventData.start); const today = new Date(); if (startDate.getFullYear() === today.getFullYear() && startDate.getMonth() === today.getMonth() && startDate.getDate() === today.getDate()) { AppState.data.counts.calendarTodayCount++; } API.fetch({ Type: 'add_calendar_event', eventData }).then(result => { if(result.error) throw new Error(result.error); }).catch(err => { UI.showToast(`Error al crear evento: ${err.message}`, true); if (startDate.getFullYear() === today.getFullYear() && startDate.getMonth() === today.getMonth() && startDate.getDate() === today.getDate()) { AppState.data.counts.calendarTodayCount--; } }); },
            deleteCalendarEvent: (eventId) => API.fetch({ Type: 'delete_calendar_event', eventId }),
            fetchExpensesByDate: (fecha_start, fecha_end) => API.fetch({ make_action: 'get_gastos_fecha', datos: { fecha_start, fecha_end } }),
            addExpense: (expenseData) => API.fetch({ make_action: 'add_gasto', datos: expenseData }),
            fetchExpenseChart: (mes_anio) => API.fetch({ Type: 'get_gastos_chart', mes_anio }),
        },
        init() {
            UI.showSpinner();
            API.fetch({ Type: 'get_full_dashboard' })
                .then(data => { AppState.update(data); this.router.navigate('dashboard'); })
                .catch(err => { console.error('Error final en carga inicial:', err); UI.showToast(`Error al cargar datos: ${err.message}`, true); root.innerHTML = `<div class="no-data-msg">❌<br>Error al cargar la aplicación.<br><small>${err.message}</small><br><br><button onclick="window.location.reload()">Reintentar</button></div>`})
                .finally(() => UI.hideSpinner());
        }
    };

    App.init();

    // --- INICIO DEL CÓDIGO DE DEPURACIÓN ---
    } catch (e) {
        // Si hay cualquier error al inicializar, lo veremos aquí.
        console.error("ERROR CATASTRÓFICO DURANTE LA INICIALIZACIÓN:", e);
        document.body.innerHTML = `<div style="padding: 20px;"><h1>Error Crítico</h1><p>Ha ocurrido un error antes de que la aplicación pudiera iniciarse. Revisa la consola para más detalles.</p><pre>${e.stack}</pre></div>`;
    }
    // --- FIN DEL CÓDIGO DE DEPURACIÓN ---
});

