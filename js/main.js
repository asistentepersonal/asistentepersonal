import { DashboardComponent } from '../components/Dashboard.js';
import { ShoppingListComponent } from '../components/ShoppingList.js';
import { ShoppingItemFormComponent } from '../components/ShoppingItemForm.js';

document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        if (tg.themeParams) {
            document.documentElement.style.setProperty('--bg', tg.themeParams.bg_color || '#f5f7fa');
            document.documentElement.style.setProperty('--card-bg', tg.themeParams.secondary_bg_color || '#ffffff');
            document.documentElement.style.setProperty('--text', tg.themeParams.text_color || '#333333');
            document.documentElement.style.setProperty('--muted', tg.themeParams.hint_color || '#555555');
            document.documentElement.style.setProperty('--primary', tg.themeParams.button_color || '#4a76f3');
            document.documentElement.style.setProperty('--action-text', tg.themeParams.button_text_color || '#ffffff');
        }
    }

    const config = {
        webhookURL: 'https://script.google.com/macros/s/AKfycbxMy9HJ33GJz2S2RvWIFTc6AxI1L2EFw_cyVstKbmvEXQl43sbrYv3QE0dc6OhIX6XBpw/exec',
        chatId: tg?.initDataUnsafe?.user?.id || prompt('MODO DESARROLLO\n\nIngresa tu chat_ID:', '')
    };

    const AppState = {
        data: {
            counts: {},
            remindersList: [],
            shoppingList: [],
            notesList: []
        },
        update(newData) {
            if (newData.error) throw new Error(newData.error);
            this.data = newData;
        }
    };

    const root = document.getElementById('app-root');
    const tabsRoot = document.getElementById('tabs-root');
    const spinner = document.getElementById('spinner');
    const toast = document.getElementById('toast');
    let toastTimer;

    const UI = {
        showSpinner: () => spinner.style.display = 'block',
        hideSpinner: () => spinner.style.display = 'none',
        showToast: (msg, isError = false) => {
            clearTimeout(toastTimer);
            toast.textContent = msg;
            toast.className = 'toast show' + (isError ? ' error' : '');
            toastTimer = setTimeout(() => { toast.className = 'toast'; }, 3000);
        },
        render: (component) => {
            root.innerHTML = '';
            root.appendChild(component);
        },
        renderTabs: (activeTabId) => {
            tabsRoot.innerHTML = `<div class="tabs"><div class="tab ${activeTabId === 'home' ? 'active' : ''}" id="tab-home">Home</div></div>`;
            document.getElementById('tab-home').onclick = () => App.router.navigate('dashboard');
        }
    };

    const API = {
        fetch: async (payload, timeout = 30000) => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            try {
                const response = await fetch(config.webhookURL, {
                    method: 'POST',
                    signal: controller.signal,
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                    body: JSON.stringify({ chat_ID: config.chatId, ...payload })
                });
                clearTimeout(id);
                if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
                return await response.json();
            } catch (error) {
                clearTimeout(id);
                if (error.name === 'AbortError') throw new Error('Timeout');
                throw error;
            }
        }
    };

    window.App = {
        router: {
            navigate(route, params = {}) {
                UI.renderTabs(route === 'dashboard' ? 'home' : '');
                switch (route) {
                    case 'dashboard':
                        UI.render(DashboardComponent(AppState.data, this));
                        break;
                    case 'shoppingList':
                        UI.render(ShoppingListComponent(AppState.data, this));
                        break;
                    case 'addShoppingItem':
                        UI.render(ShoppingItemFormComponent(null, this));
                        break;
                }
            }
        },
        actions: {
            toggleShoppingItem: (trackingCode) => {
                const originalData = JSON.parse(JSON.stringify(AppState.data));
                const itemIndex = AppState.data.shoppingList.findIndex(i => i['3'] === trackingCode);
                if (itemIndex === -1) return;
                
                const newStatus = AppState.data.shoppingList[itemIndex]['2'] === 'Pendiente' ? 'Comprado' : 'Pendiente';
                AppState.data.shoppingList[itemIndex]['2'] = newStatus;
                
                UI.render(ShoppingListComponent(AppState.data, App.router));
                
                API.fetch({ Type: 'toggle_item_status', tracking_code: trackingCode })
                   .then(data => AppState.update(data))
                   .catch(() => {
                       UI.showToast('Error de Sincronización', true);
                       AppState.data = originalData;
                       UI.render(ShoppingListComponent(AppState.data, App.router));
                   });
            },
            addShoppingItem: (description, cycle) => {
                UI.showSpinner();
                API.fetch({ Type: 'add_articulo', description, cycle })
                   .then(data => {
                       AppState.update(data);
                       App.router.navigate('shoppingList');
                   })
                   .catch(err => UI.showToast(err.message, true))
                   .finally(() => UI.hideSpinner());
            }
        },
        init() {
            UI.showSpinner();
            API.fetch({ Type: 'get_full_dashboard' })
                .then(data => {
                    AppState.update(data);
                    this.router.navigate('dashboard');
                })
                .catch(err => {
                    console.error('Error en carga inicial:', err);
                    UI.showToast(`Error al cargar datos: ${err.message}`, true);
                })
                .finally(() => UI.hideSpinner());
        }
    };

    App.init();
});
