export function ShoppingItemFormComponent(itemData, router) {
    const element = document.createElement('div');
    element.className = 'list-container';
    element.innerHTML = `<div class="list-header"><button class="back-btn">‹</button><h2>➕ Añadir Artículo</h2></div><div class="form-card"><label>Descripción</label><textarea id="article-desc" rows="2"></textarea><label>¿Cada cuántos días lo compras? (0 si es ocasional)</label><input type="number" id="article-cycle" value="0" inputmode="numeric"/><button id="add-btn" disabled>Añadir a la lista</button></div>`;
    const sendBtn = element.querySelector('#add-btn'), descInput = element.querySelector('#article-desc'), cycleInput = element.querySelector('#article-cycle');
    function validate() { const isValid = descInput.value.trim() !== '' && cycleInput.value.trim() !== ''; sendBtn.disabled = !isValid; }
    descInput.oninput = validate; cycleInput.oninput = validate;
    element.querySelector('.back-btn').onclick = () => router.navigate('shoppingList');
    sendBtn.onclick = () => { App.actions.addShoppingItem(descInput.value.trim(), cycleInput.value.trim()); };
    return element;
}
