document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.expand();
        // Lógica para adaptar el tema de Telegram
        if (tg.themeParams) {
            document.documentElement.style.setProperty('--bg', tg.themeParams.bg_color || '#f5f7fa');
            document.documentElement.style.setProperty('--card-bg', tg.themeParams.secondary_bg_color || '#ffffff');
            document.documentElement.style.setProperty('--text', tg.themeParams.text_color || '#333333');
            document.documentElement.style.setProperty('--muted', tg.themeParams.hint_color || '#555555');
            document.documentElement.style.setProperty('--primary', tg.themeParams.button_color || '#4a76f3');
            document.documentElement.style.setProperty('--action-text', tg.themeParams.button_text_color || '#ffffff');
        }
    }

    // --- CONFIGURACIÓN GLOBAL ---
    const config = {
        webhookURL: 'https://script.google.com/macros/s/AKfycbxMy9HJ33GJz2S2RvWIFTc6AxI1L2EFw_cyVstKbmvEXQl43sbrYv3QE0dc6OhIX6XBpw/exec',
        chatId: tg?.initDataUnsafe?.user?.id || prompt('MODO DESARROLLO\n\nIngresa tu chat_ID:', '')
    };

    // --- ESTADO GLOBAL DE LA APP (LA DESPENSA) ---
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

    // --- ELEMENTOS DEL DOM ---
    const root = document.getElementById('app-root');
    const tabsRoot = document.getElementById('tabs-root');
    const spinner = document.getElementById('spinner');
    const toast = document.getElementById('toast');
    let toastTimer;

    // --- HERRAMIENTAS GLOBALES ---
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
            tabsRoot.innerHTML = `
                <div class="tabs">
                    <div class="tab ${activeTabId === 'home' ? 'active' : ''}" id="tab-home">Home</div>
                </div>`;
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
                if (error.name === 'AbortError') throw new Error('Timeout: La solicitud tardó demasiado.');
                throw error;
            }
        }
    };

    // --- NÚCLEO DE LA APLICACIÓN (EL ORQUESTADOR) ---
    const App = {
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
        },
        router: {
            navigate(route) {
                UI.renderTabs(route === 'dashboard' ? 'home' : '');
                switch (route) {
                    case 'dashboard':
                        UI.render(DashboardComponent(AppState.data, this));
                        break;
                    case 'shoppingList':
                        UI.render(ShoppingListComponent(AppState.data.shoppingList, this));
                        break;
                    // Aquí añadiremos más rutas en el futuro
                }
            }
        },
        actions: {
            // Aquí vivirá la lógica para llamar a la API y actualizar el estado
            toggleShoppingItem: (trackingCode) => {
                // Lógica optimista y llamada a la API
                // Esto lo construiremos en el siguiente paso
            }
        }
    };

    // Iniciar la aplicación
    App.init();
});
