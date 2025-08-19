export function NoteFormComponent(note, router) {
    const isEditing = !!note;
    const element = document.createElement('div');
    element.className = 'list-container';
    element.innerHTML = `<div class="list-header"><button class="back-btn">‹</button><h2>${isEditing ? '✏️ Editar' : '➕ Nueva'} Nota</h2></div><div class="form-card"><label>Título</label><input type="text" id="note-title" value="${isEditing ? note.Titulo : ''}"/><label>Descripción</label><textarea id="note-description" rows="8">${isEditing ? note.Descripcion : ''}</textarea><button id="save-note-btn" ${isEditing ? 'class="enabled"' : ''} ${isEditing ? '' : 'disabled'}>${isEditing ? 'Guardar Cambios' : 'Crear Nota'}</button></div></div>`;
    
    const titleInput = element.querySelector('#note-title');
    const descInput = element.querySelector('#note-description');
    const saveBtn = element.querySelector('#save-note-btn');
    
    function validate() {
        const isValid = titleInput.value.trim() !== '' && descInput.value.trim() !== '';
        saveBtn.disabled = !isValid;
    }
    
    titleInput.oninput = validate;
    descInput.oninput = validate;
    
    element.querySelector('.back-btn').onclick = () => router.navigate('notesList');
    saveBtn.onclick = () => {
        const payload = {
            Type: isEditing ? 'edit_note' : 'add_note',
            note_id: isEditing ? note.Nota_ID : null,
            title: titleInput.value.trim(),
            description: descInput.value.trim()
        };
        App.actions.saveNote(payload);
    };
    return element;
}
