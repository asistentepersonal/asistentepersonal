export function RemindersListComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    const items = appData.remindersList || [];
    let html = `<div class="list-header"><button class="back-btn">‹</button><h2>Recordatorios</h2></div><ul class="list-style-none">`;
    if (items.length > 0) {
        html += items.map(item => `<li class="list-item" id="reminder-${item.tracking_code}"><div class="list-item-content"><div class="list-item-details"><span class="list-item-title">${item.Descripcion}</span><span class="list-item-subtitle">${item.Categoria === 'diario' ? 'Diario a las ' : ''}${item.Fecha}</span></div><button class="card-menu-btn" data-menu-id="menu-rem-${item.tracking_code}">⋮</button></div><div class="dropdown-menu" id="menu-rem-${item.tracking_code}"><a class="dropdown-item" data-action="edit-reminder" data-id="${item.tracking_code}">Editar</a><a class="dropdown-item" data-action="delete-reminder" data-id="${item.tracking_code}">Eliminar</a></div></li>`).join('');
    } else {
        html += '<div class="no-data-msg">🎉<br>No tienes recordatorios.</div>';
    }
    html += `</ul>`;
    element.innerHTML = html;
    element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
    element.addEventListener('click', (e) => {
        const menuBtn = e.target.closest('.card-menu-btn');
        if (menuBtn) { e.stopPropagation(); const menuId = menuBtn.dataset.menuId; const menu = element.querySelector(`#${menuId}`); if (menu) { const isShown = menu.classList.contains('show'); element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show')); if (!isShown) menu.classList.add('show'); } return; }
        const actionItem = e.target.closest('.dropdown-item');
        if(actionItem){ const id = actionItem.dataset.id; if(actionItem.dataset.action === 'edit-reminder'){ const reminder = appData.remindersList.find(r => r.tracking_code === id); router.navigate('editReminder', { reminder }); } else if(actionItem.dataset.action === 'delete-reminder'){ if(confirm('¿Eliminar este recordatorio?')) App.actions.deleteReminder(id); } }
    });
    return element;
}
