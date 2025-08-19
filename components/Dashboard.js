export function DashboardComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'grid';
    const counts = appData.counts;
    element.innerHTML = `
        <div class="card" data-route="shoppingList">
            <div class="card-badge-group">
                <div class="card-badge green">${counts.shoppingPendingCount}</div>
                <div class="card-badge red">${counts.shoppingBoughtCount}</div>
            </div>
            <div class="card-icon">🛒</div>
            <div class="card-title">Compras</div>
        </div>
        <!-- El resto de las tarjetas -->
    `;
    element.querySelector('[data-route="shoppingList"]').addEventListener('click', () => {
        router.navigate('shoppingList');
    });
    return element;
}
