export function ExpenseFormComponent(router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    element.innerHTML = `<div class="list-header"><button class="back-btn">‹</button><h2>💰 Nuevo Gasto</h2></div> <div class="form-card"><label>Fecha</label><input type="text" id="gasto-fecha" readonly="readonly"><label>Establecimiento</label><input type="text" id="gasto-establecimiento" required /><label>Importe</label><input type="number" id="gasto-importe" step="0.01" placeholder="Ej: 12.50" required /><label>Categoría</label><input type="text" id="gasto-categoria" required /><button id="save-gasto-btn" disabled>Registrar</button> </div>`;
    
    element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
    flatpickr(element.querySelector("#gasto-fecha"), { defaultDate: new Date(), dateFormat: "Y-m-d H:i", enableTime: true, time_24hr: true, locale: "es" });
    
    const saveBtn = element.querySelector('#save-gasto-btn');
    const inputs = ['gasto-establecimiento', 'gasto-importe', 'gasto-categoria'];
    
    function validate() {
        const allValid = inputs.every(id => element.querySelector(`#${id}`).value.trim() !== '');
        saveBtn.disabled = !allValid;
    }
    inputs.forEach(id => element.querySelector(`#${id}`).addEventListener('input', validate));
    
    saveBtn.onclick = async () => {
        App.actions.showSpinner();
        try {
            const payload = {
                ID_Unico: 'A-' + Math.random().toString(36).substring(2, 9),
                Fecha: element.querySelector('#gasto-fecha')._flatpickr.selectedDates[0].toISOString(),
                Establecimiento: element.querySelector('#gasto-establecimiento').value.trim(),
                Importe: parseFloat(element.querySelector('#gasto-importe').value),
                categoria: element.querySelector('#gasto-categoria').value.trim()
            };
            const data = await App.actions.addExpense(payload);
            if (data.error || (data.resultado && data.resultado.startsWith('Error'))) {
                throw new Error(data.resultado || data.error);
            }
            App.actions.showToast('Gasto registrado');
            App.init(); 
        } catch (err) {
            App.actions.showToast(err.message, true);
        } finally {
            App.actions.hideSpinner();
        }
    };

    return element;
}
