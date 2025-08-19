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


