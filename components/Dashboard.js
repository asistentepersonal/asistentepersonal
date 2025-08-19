export function DashboardComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'grid';

    const counts = appData.counts;

    element.innerHTML = `
        <div class="card" data-route="remindersList">
            <div class="card-badge red" style="left:12px;">${counts.remindersCount}</div>
            <div class="card-icon">🗓️</div>
            <div class="card-title">Recordatorios</div>
        </div>
        <div class="card" data-route="shoppingList">
            <div class="card-badge-group">
                <div class="card-badge green">${counts.shoppingPendingCount}</div>
                <div class="card-badge red">${counts.shoppingBoughtCount}</div>
            </div>
            <div class="card-icon">🛒</div>
            <div class="card-title">Compras</div>
        </div>
        <div class="card" data-route="notesList">
            <div class="card-badge red" style="left:12px;">${counts.notesCount}</div>
            <div class="card-icon">📝</div>
            <div class="card-title">Notas</div>
        </div>
        <div class="card" data-route="calendar">
            <div class="card-badge red" style="left:12px;">${counts.calendarTodayCount}</div>
            <div class="card-icon">🗓️</div>
            <div class="card-title">Calendario</div>
        </div>
        <div class="card" data-route="expenses">
            <div class="card-badge red" style="left:12px;">${(counts.gastosMesActual || '0,00').split(',')[0]}</div>
            <div class="card-icon">💰</div>
            <div class="card-title">Gastos</div>
        </div>
        <div class="card" data-route="comingSoon">
             <div class="card-icon">⚙️</div>
            <div class="card-title">Próximamente</div>
        </div>
    `;

    element.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const route = card.dataset.route;
            if (route === 'shoppingList') {
                router.navigate('shoppingList');
            } else {
                // De momento, las otras rutas no están implementadas
                window.Telegram.WebApp.showAlert(`La sección "${route}" aún no está conectada.`);
            }
        });
    });

    return element;
}
