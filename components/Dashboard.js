function DashboardComponent(appData, router) {
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
    `;

    // Asignar eventos de clic para la navegación
    element.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            const route = card.dataset.route;
            if (route) {
                // De momento solo navegamos a la lista de la compra
                if (route === 'shoppingList') {
                    router.navigate('shoppingList');
                } else {
                    alert(`Navegación a "${route}" aún no implementada.`);
                }
            }
        });
    });

    return element;
}
