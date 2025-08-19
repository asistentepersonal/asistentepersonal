export function ReminderFormComponent(reminder, router) {
    const isEditing = !!reminder;
    const element = document.createElement('div');
    element.className = 'list-container';
    element.innerHTML = `<div class="list-header"><button class="back-btn">‹</button><h2>${isEditing ? '✏️ Editar' : '📝 Nuevo'} Recordatorio</h2></div><div class="form-card"><label>Descripción</label><textarea id="text" rows="3" required>${isEditing ? reminder.Descripcion : ''}</textarea><label>Fecha y hora</label><input type="text" id="time" required/><label>Tipo</label><div class="radio-group"><label><input type="radio" name="category" value="un solo uso" ${isEditing && reminder.Categoria === 'un solo uso' ? 'checked' : ''}/> Único</label><label><input type="radio" name="category" value="diario" ${isEditing && reminder.Categoria === 'diario' ? 'checked' : ''}/> Diario</label></div><button id="sendBtn" ${isEditing ? 'class="enabled"' : ''} disabled>${isEditing ? 'Guardar Cambios' : 'Crear'}</button></div></div>`;
    
    const textInput = element.querySelector('#text');
    const timeInput = element.querySelector('#time');
    const sendBtn = element.querySelector('#sendBtn');
    const radios = element.querySelectorAll('input[name="category"]');
    
    flatpickr(timeInput, { enableTime: true, dateFormat: "Y-m-d H:i", defaultDate: isEditing ? new Date(reminder.FullDate) : null, locale: "es" });
    
    function validate() {
        const isValid = textInput.value.trim() !== '' && timeInput.value && element.querySelector('input[name="category"]:checked');
        sendBtn.disabled = !isValid;
    }
    
    textInput.oninput = validate;
    timeInput.oninput = validate;
    radios.forEach(r => r.onchange = validate);
    
    element.querySelector('.back-btn').onclick = () => router.navigate('remindersList');
    sendBtn.onclick = () => {
        const payload = {
            Type: isEditing ? 'edit_reminder' : 'add_reminder',
            tracking_code: isEditing ? reminder.tracking_code : null,
            description: textInput.value.trim(),
            time: timeInput._flatpickr.selectedDates[0].toISOString(),
            category: element.querySelector('input[name="category"]:checked').value
        };
        App.actions.saveReminder(payload);
    };
    return element;
}
