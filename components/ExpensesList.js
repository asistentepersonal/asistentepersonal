export function ExpensesListComponent(router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    element.innerHTML = `<div class="list-header"><button class="back-btn">‹</button><h2>Historial de Gastos</h2></div> <div class="form-card" style="display:flex; gap:10px;"><input type="text" id="gasto-fecha-start" placeholder="Desde..." readonly="readonly"><input type="text" id="gasto-fecha-end" placeholder="...hasta" readonly="readonly"><button id="buscar-gastos-btn" style="margin-top:0;">Buscar</button> </div> <ul class="list-style-none" id="gastos-list-ul"><div class="no-data-msg">🔍<br>Selecciona un rango de fechas.</div></ul>`;
    
    element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
    const startPicker = flatpickr(element.querySelector("#gasto-fecha-start"), { dateFormat: "d/m/Y", locale: "es" });
    const endPicker = flatpickr(element.querySelector("#gasto-fecha-end"), { dateFormat: "d/m/Y", locale: "es" });
    
    element.querySelector('#buscar-gastos-btn').onclick = async () => {
        const fechaStart = startPicker.input.value;
        const fechaEnd = endPicker.input.value;
        if (!fechaStart || !fechaEnd) { App.actions.showToast('Selecciona ambas fechas.', true); return; }
        
        App.actions.showSpinner();
        const listEl = element.querySelector('#gastos-list-ul');
        try {
            const data = await App.actions.fetchExpensesByDate(fechaStart, fechaEnd);
            if (data.error) throw new Error(data.error);
            if (data.Lista_de_gastos && data.Lista_de_gastos.includes("No existen registros")) {
                listEl.innerHTML = '<div class="no-data-msg">🤷<br>No se encontraron gastos.</div>';
            } else {
                const lines = data.Lista_de_gastos.split('\n').filter(line => line.includes('🆔'));
                listEl.innerHTML = lines.map(line => `<li class="list-item" style="padding:10px 15px; text-align:left;">${line.replace(/\|/g, '<span style="margin:0 5px;">|</span>')}</li>`).join('');
            }
        } catch (err) {
            listEl.innerHTML = `<div class="no-data-msg">❌<br>Error al buscar.<br><small>${err.message}</small></div>`;
        } finally {
            App.actions.hideSpinner();
        }
    };
    
    return element;
}
