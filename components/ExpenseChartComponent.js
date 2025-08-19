export function ExpenseChartComponent(appData, router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    
    const mesesOptions = (appData.counts.mesesActivosGastos || [])
        .map(mes => `<option value="${mes}">${mes}</option>`).join('');

    element.innerHTML = `
        <div class="list-header">
            <button class="back-btn">‹</button>
            <h2>Gráfico de Gastos</h2>
        </div>
        <div class="form-card">
            <select id="gasto-chart-mes-select">
                <option value="">Selecciona un mes...</option>
                ${mesesOptions}
            </select>
            <div class="gasto-chart-container" id="chart-container"></div>
        </div>
    `;
    
    element.querySelector('.back-btn').onclick = () => router.navigate('dashboard');
    
    element.querySelector('#gasto-chart-mes-select').onchange = async (event) => {
        const mesAnio = event.target.value;
        if (!mesAnio) return;
        
        App.actions.showSpinner();
        try {
            const data = await App.actions.fetchExpenseChart(mesAnio);
            if (data.error) throw new Error(data.error);
            
            let img = element.querySelector('#chart-container img');
            if (!img) {
                img = document.createElement('img');
                element.querySelector('#chart-container').appendChild(img);
            }
            img.src = data.chartUrl;
        } catch (err) {
            App.actions.showToast(err.message, true);
        } finally {
            App.actions.hideSpinner();
        }
    };
    
    return element;
}
