export function ShoppingListComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    const items = appData.shoppingList || [];

    function render() {
        const pending = items.filter(i => i['2'] === 'Pendiente');
        const bought = items.filter(i => i['2'] === 'Comprado');
        let html = `<div class="list-header"><button class="back-btn">‹</button><h2>Lista de Compras</h2></div><ul class="list-style-none">`;
        if (pending.length > 0) {
            html += '<h3 class="shopping-list-section-title">Pendientes</h3>';
            html += pending.map(item => `<li class="shopping-item"><button class="shopping-item-toggle-btn pending" data-id="${item['3']}"><span>${item['1']}</span></button></li>`).join('');
        }
        if (bought.length > 0) {
            html += '<h3 class="shopping-list-section-title">Comprados</h3>';
            html += bought.map(item => `<li class="shopping-item"><button class="shopping-item-toggle-btn bought" data-id="${item['3']}"><span>${item['1']}</span><span class="item-date">${item['4']}</span></button></li>`).join('');
        }
        if (items.length === 0) {
            html += '<div class="no-data-msg">🛒<br>Tu lista está vacía.</div>';
        }
        html += `</ul><div class="add-article-btn-container"><button class="add-article-btn">Añadir Artículo</button></div>`;
        element.innerHTML = html;

        element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
        element.querySelector('.add-article-btn').onclick = () => router.navigate('addShoppingItem');
        element.querySelectorAll('.shopping-item-toggle-btn').forEach(btn => {
            btn.onclick = () => App.actions.toggleShoppingItem(btn.dataset.id);
        });
    }

    render();
    return element;
}
