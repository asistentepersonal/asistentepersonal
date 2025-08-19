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
            html += pending.map(item => `
                <li class="shopping-item">
                    <button class="shopping-item-toggle-btn pending" data-id="${item['3']}"><span>${item['1']}</span></button>
                    <button class="card-menu-btn" data-menu-id="menu-shop-${item['3']}">⋮</button>
                    <div class="dropdown-menu" id="menu-shop-${item['3']}">
                        <a class="dropdown-item delete-btn-item" data-id="${item['3']}">Eliminar</a>
                    </div>
                </li>`).join('');
        }

        if (bought.length > 0) {
            html += '<h3 class="shopping-list-section-title">Comprados</h3>';
            html += '<div class="shopping-list-header-row"><label for="select-all">Todos</label><input type="checkbox" id="select-all"></div>';
            html += bought.map(item => `
                <li class="shopping-item">
                    <input type="checkbox" class="shopping-item-checkbox" data-id="${item['3']}">
                    <button class="shopping-item-toggle-btn bought" data-id="${item['3']}"><span>${item['1']}</span><span class="item-date">${item['4']}</span></button>
                    <button class="card-menu-btn" data-menu-id="menu-shop-${item['3']}">⋮</button>
                    <div class="dropdown-menu" id="menu-shop-${item['3']}">
                        <a class="dropdown-item delete-btn-item" data-id="${item['3']}">Eliminar</a>
                    </div>
                </li>`).join('');
        }

        if (items.length === 0) {
            html += '<div class="no-data-msg">🛒<br>Tu lista está vacía.</div>';
        }
        
        html += `</ul><div class="add-article-btn-container"><button class="add-article-btn">Añadir Artículo</button><button class="multi-select-action-btn" disabled>Marcar para comprar</button></div>`;
        element.innerHTML = html;

        element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
        element.querySelector('.add-article-btn').onclick = () => router.navigate('addShoppingItem');
        
        element.querySelectorAll('.shopping-item-toggle-btn').forEach(btn => {
            btn.onclick = () => App.actions.toggleShoppingItem(btn.dataset.id);
        });

        element.querySelectorAll('.card-menu-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const menuId = btn.dataset.menuId;
                const menu = element.querySelector(`#${menuId}`);
                if (menu) {
                    const isShown = menu.classList.contains('show');
                    element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
                    if (!isShown) menu.classList.add('show');
                }
            };
        });

        element.querySelectorAll('.delete-btn-item').forEach(btn => {
            btn.onclick = () => {
                if (confirm('¿Seguro que quieres eliminar este artículo?')) {
                    App.actions.deleteShoppingItem(btn.dataset.id);
                }
            };
        });

        const selectAll = element.querySelector('#select-all');
        if(selectAll) {
            selectAll.onchange = (e) => {
                element.querySelectorAll('.shopping-item-checkbox').forEach(cb => cb.checked = e.target.checked);
                updateMultiSelectButtonState();
            };
        }

        element.querySelectorAll('.shopping-item-checkbox').forEach(cb => {
            cb.onchange = updateMultiSelectButtonState;
        });

        const multiBtn = element.querySelector('.multi-select-action-btn');
        if (multiBtn) {
            multiBtn.onclick = () => {
                const codes = Array.from(element.querySelectorAll('.shopping-item-checkbox:checked')).map(cb => cb.dataset.id);
                App.actions.toggleMultipleToPending(codes);
            };
        }

        function updateMultiSelectButtonState() {
            if(!multiBtn) return;
            const count = element.querySelectorAll('.shopping-item-checkbox:checked').length;
            multiBtn.disabled = count === 0;
            multiBtn.classList.toggle('enabled', count > 0);
            multiBtn.textContent = count > 0 ? `Marcar ${count} para comprar` : 'Marcar para comprar';
        }
        
        updateMultiSelectButtonState();
    }

    render();
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.shopping-item')) {
            element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        }
    }, { once: true });

    return element;
}
