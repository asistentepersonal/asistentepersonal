function ShoppingListComponent(shoppingList, router) {
    const element = document.createElement('div');
    element.className = 'list-container';

    function render(items) {
        const pending = items.filter(i => i['2'] === 'Pendiente');
        const bought = items.filter(i => i['2'] === 'Comprado');
        
        let html = `
            <div class="list-header">
                <button class="back-btn">‹</button>
                <h2>Lista de Compras</h2>
            </div>
            <ul class="list-style-none">
        `;

        if (pending.length > 0) {
            html += '<h3 class="shopping-list-section-title">Pendientes</h3>';
            html += pending.map(item => `
                <div class="shopping-item" data-id="${item['3']}">
                    <div class="shopping-item-content">
                        <button class="shopping-item-toggle-btn pending" data-id="${item['3']}">
                            <span>${item['1']}</span>
                        </button>
                    </div>
                    <!-- Menú se añadirá después -->
                </div>
            `).join('');
        }

        if (bought.length > 0) {
            html += '<h3 class="shopping-list-section-title">Comprados</h3>';
            html += bought.map(item => `
                <div class="shopping-item" data-id="${item['3']}">
                    <div class="shopping-item-content">
                        <button class="shopping-item-toggle-btn bought" data-id="${item['3']}">
                            <span>${item['1']}</span>
                            <span class="item-date">${item['4']}</span>
                        </button>
                    </div>
                     <!-- Menú se añadirá después -->
                </div>
            `).join('');
        }

        if (items.length === 0) {
            html += '<div class="no-data-msg">🛒<br>Tu lista está vacía.</div>';
        }

        html += `
            </ul>
            <div class="add-article-btn-container">
                <button class="add-article-btn">Añadir Artículo</button>
            </div>
        `;
        
        element.innerHTML = html;

        // Asignar eventos
        element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
        // Lógica para añadir y cambiar estado se implementará aquí
    }

    render(shoppingList);
    return element;
}
