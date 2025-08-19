export function NotesListComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    const items = appData.notesList || [];
    let html = '<div class="list-header"><button class="back-btn">‹</button><h2>Mis Notas</h2></div><ul class="list-style-none">';
    if (items.length > 0) {
        html += items.map(note =>
            '<li class="list-item note-item" id="note-' + note.Nota_ID + '">' +
                '<div class="list-item-content note-header">' +
                    '<div class="list-item-details">' +
                        '<span class="list-item-title">' + note.Titulo + '</span>' +
                        '<span class="list-item-subtitle">' + note.Fecha + '</span>' +
                    '</div>' +
                    '<button class="card-menu-btn" data-menu-id="menu-note-' + note.Nota_ID + '">⋮</button>' +
                '</div>' +
                '<div class="dropdown-menu" id="menu-note-' + note.Nota_ID + '">' +
                    '<a class="dropdown-item" data-action="edit-note" data-id="' + note.Nota_ID + '">Editar</a>' +
                    '<a class="dropdown-item" data-action="delete-note" data-id="' + note.Nota_ID + '">Eliminar</a>' +
                '</div>' +
                '<div class="note-description">' + note.Descripcion + '</div>' +
            '</li>').join('');
    } else {
        html += '<div class="no-data-msg">📝<br>No tienes notas guardadas.</div>';
    }
    html += '</ul>';
    element.innerHTML = html;
    element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
    element.addEventListener('click', (e) => {
        const header = e.target.closest('.note-header');
        const menuBtn = e.target.closest('.card-menu-btn');
        const actionItem = e.target.closest('.dropdown-item');
        if (menuBtn) {
            e.stopPropagation();
            const menuId = menuBtn.dataset.menuId;
            const menu = element.querySelector('#' + menuId);
            if (menu) {
                const isShown = menu.classList.contains('show');
                element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
                if (!isShown) menu.classList.add('show');
            }
            return;
        }
        if (actionItem) {
            e.stopPropagation();
            const noteId = actionItem.dataset.id;
            if (actionItem.dataset.action === 'edit-note') {
                const note = appData.notesList.find(n => n.Nota_ID === noteId);
                router.navigate('editNote', { note });
            } else if (actionItem.dataset.action === 'delete-note') {
                if (confirm('¿Eliminar esta nota?')) App.actions.deleteNote(noteId);
            }
        } else if (header) {
            header.closest('.note-item').classList.toggle('open');
        }
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.list-item')) { element.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show')); } }, { once: true });
    return element;
}
