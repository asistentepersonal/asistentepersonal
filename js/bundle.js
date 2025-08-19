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



