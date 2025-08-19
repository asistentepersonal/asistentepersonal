export function DashboardComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'grid';

    const counts = appData.counts;

    element.innerHTML = `
        <div class="card">
            <div class="card-badge red">${counts.remindersCount}</div>
            <button class="card-menu-btn" data-menu-id="menu-recordatorios">⋮</button>
            <div class="card-icon" data-route="remindersList">🗓️</div>
            <div class="card-title" data-route="remindersList">Recordatorios</div>
            <div class="dropdown-menu" id="menu-recordatorios">
                <a class="dropdown-item" data-route="addReminder">Añadir</a>
                <a class="dropdown-item" data-route="remindersList">Ver Lista</a>
            </div>
        </div>
        <div class="card">
            <div class="card-badge-group">
                <div class="card-badge green">${counts.shoppingPendingCount}</div>
                <div class="card-badge red">${counts.shoppingBoughtCount}</div>
            </div>
            <button class="card-menu-btn" data-menu-id="menu-shopping">⋮</button>
            <div class="card-icon" data-route="shoppingList">🛒</div>
            <div class="card-title" data-route="shoppingList">Compras</div>
            <div class="dropdown-menu" id="menu-shopping">
                <a class="dropdown-item" data-route="addShoppingItem">Añadir</a>
                <a class="dropdown-item" data-route="shoppingList">Ver Lista</a>
            </div>
        </div>
        <div class="card">
            <div class="card-badge red">${counts.notesCount}</div>
            <button class="card-menu-btn" data-menu-id="menu-notes">⋮</button>
            <div class="card-icon" data-route="notesList">📝</div>
            <div class="card-title" data-route="notesList">Notas</div>
            <div class="dropdown-menu" id="menu-notes">
                <a class="dropdown-item" data-route="addNote">Añadir</a>
                <a class="dropdown-item" data-route="notesList">Ver Lista</a>
            </div>
        </div>
        <div class="card">
            <div class="card-badge red">${counts.calendarTodayCount}</div>
            <button class="card-menu-btn" data-menu-id="menu-calendar">⋮</button>
            <div class="card-icon" data-route="calendar">🗓️</div>
            <div class="card-title" data-route="calendar">Calendario</div>
            <div class="dropdown-menu" id="menu-calendar">
                <a class="dropdown-item" data-route="addEvent">Añadir Evento</a>
                <a class="dropdown-item" data-route="viewAgenda">Ver Agenda</a>
            </div>
        </div>
        <div class="card">
            <div class="card-badge red">${(counts.gastosMesActual || '0,00').split(',')[0]}</div>
            <button class="card-menu-btn" data-menu-id="menu-expenses">⋮</button>
            <div class="card-icon" data-route="expenses">💰</div>
            <div class="card-title" data-route="expenses">Gastos</div>
            <div class="dropdown-menu" id="menu-expenses">
                <a class="dropdown-item" data-route="addExpense">Añadir</a>
                <a class="dropdown-item" data-route="viewExpenses">Buscar</a>
                <a class="dropdown-item" data-route="viewExpenseChart">Ver Gráfico</a>
            </div>
        </div>
    `;

    // Lógica para manejar clics en toda la cuadrícula
    element.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.card-menu-btn');
        const clickable = e.target.closest('[data-route]');

        // Manejar menús desplegables
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

        // Manejar navegación
        if (clickable) {
            const route = clickable.dataset.route;
            // Ocultar cualquier menú abierto al navegar
            element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
            
            if (route === 'shoppingList' || route === 'addShoppingItem') {
                router.navigate(route);
            } else {
                window.Telegram.WebApp.showAlert(`Navegación a "${route}" aún no implementada.`);
            }
        }
    });

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.card')) {
            element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        }
    }, { once: true }); // El listener se ejecuta una vez y se auto-elimina

    return element;
}
