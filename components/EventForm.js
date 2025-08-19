export function EventFormComponent(router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    element.innerHTML = `<div class="list-header"><button class="back-btn">‹</button><h2>➕ Nuevo Evento</h2></div><div class="form-card"><label>Título</label><input type="text" id="event-summary" required /><label>Descripción</label><textarea id="event-description" rows="3"></textarea><label>Inicio</label><input type="text" id="event-start" readonly="readonly"><label>Fin</label><input type="text" id="event-end" readonly="readonly"><label>Aviso</label><select id="event-reminder"><option value="0">Sin aviso</option><option value="10">Notificación 10 min antes</option><option value="60">Notificación 1 hora antes</option><option value="1440">Notificación 1 día antes</option></select><button id="save-event-btn" disabled>Crear Evento</button></div></div>`;
    
    const summaryInput = element.querySelector('#event-summary');
    const saveBtn = element.querySelector('#save-event-btn');

    flatpickr(element.querySelector("#event-start"), { enableTime: true, dateFormat: "d-m-Y H:i", time_24hr: true, locale: "es", defaultDate: new Date() });
    flatpickr(element.querySelector("#event-end"), { enableTime: true, dateFormat: "d-m-Y H:i", time_24hr: true, locale: "es", defaultDate: new Date(Date.now() + 3600000) });
    
    function validate() { saveBtn.disabled = summaryInput.value.trim() === ''; }
    summaryInput.oninput = validate;
    
    element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
    saveBtn.onclick = () => {
        if(saveBtn.disabled) return;
        saveBtn.disabled = true;
        
        App.actions.showToast('Evento creado con éxito');
        router.navigate('dashboard');
        
        const eventData = {
            summary: summaryInput.value,
            description: element.querySelector('#event-description').value,
            start: element.querySelector('#event-start')._flatpickr.selectedDates[0].toISOString(),
            end: element.querySelector('#event-end')._flatpickr.selectedDates[0].toISOString(),
            reminderMinutes: element.querySelector('#event-reminder').value
        };

        App.actions.addCalendarEvent(eventData)
            .then(result => { if(result.error) throw new Error(result.error); App.init(); }) // Recargamos para actualizar el badge
            .catch(err => { App.actions.showToast(`Error al crear evento: ${err.message}`, true); });
    };
    
    return element;
}
