<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Asistente Personal</title>
  
  <!-- Estilos (CORREGIDOS Y AMPLIADOS) -->
  <style>
    :root { --bg:#f5f7fa; --card-bg:#fff; --text:#333; --muted:#555; --badge-color:#e74c3c; --primary:#4a76f3; --action-bg:#4caf50; --action-text:#fff; --error-bg:#e74c3c; --pending-bg: #28a745; --bought-bg: #dc3545; --list-item-text: #fff; }
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--text);padding-bottom: 60px;}
    .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:20px;}
    .card{background:var(--card-bg);border-radius:12px;padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.05);text-align:center;position:relative; cursor: pointer;}
    .card-icon{font-size:2.5rem;margin-bottom:8px;}
    .card-title{font-size:1.2rem;margin-bottom:4px;}
    .card-badge{position:absolute;top:12px;background:var(--badge-color);color:#fff;border-radius:12px;min-width:24px;height:24px;padding:0 7px;display:flex;align-items:center;justify-content:center;font-size:.9rem;line-height:24px;font-weight:500;}
    .card-badge-group{position:absolute;top:12px;left:12px;display:flex;gap:4px;}
    .card-badge.green{background-color:#28a745; position: static;}
    .card-badge.red{background-color:#e74c3c; position: static;}
    .tabs{position:fixed;bottom:0;left:0;width:100%;display:flex;background:var(--card-bg);box-shadow:0 -2px 8px rgba(0,0,0,0.1);z-index: 100;}
    .tab{flex:1;text-align:center;padding:12px 0;font-size:1rem;color:var(--muted);cursor:pointer;}
    .tab.active{color:var(--badge-color);}
    .form-container, .list-container{max-width:480px;margin:20px auto;padding:10px;}
    .form-card{background:var(--card-bg);border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.05);padding:24px;}
    .form-card label{display:block;margin-top:12px;font-weight:600;}
    .form-card textarea,.form-card input, .form-card select{width:100%;margin-top:8px;padding:10px;border:1px solid #ddd;border-radius:8px;font-size:1rem;}
    .form-card button{margin-top:20px;width:100%;padding:12px;background:var(--action-bg);color:var(--action-text);border:none;border-radius:8px;font-size:1rem;cursor:pointer;opacity:1;}
    .form-card button:disabled{cursor:not-allowed;opacity:.6;}
    .toast{visibility:hidden;width:90%;max-width:480px;background:var(--action-bg);color:var(--action-text);text-align:center;border-radius:8px;padding:12px;position:fixed;left:50%;bottom:80px;transform:translateX(-50%);z-index:1000;font-size:1rem;}
    .toast.error{background:var(--error-bg);}
    .toast.show{visibility:visible;animation:fadein .3s,fadeout .3s 2.7s;}
    .spinner{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);border:4px solid #f3f3f3;border-top:4px solid var(--primary);border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;z-index:1001;}
    @keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg);}100%{transform:translate(-50%,-50%) rotate(360deg);}}
    @keyframes fadein{from{opacity:0;}to{opacity:1;}}@keyframes fadeout{from{opacity:1;}to{opacity:0;}}
    .list-header { display: flex; align-items: center; padding: 10px; margin-bottom: 10px; }
    .back-btn { background: transparent; border: none; font-size: 1.8rem; cursor: pointer; color: var(--muted); padding-right: 15px; }
    .list-header h2 { font-size: 1.4rem; margin: 0; }
    .list-style-none { list-style: none; padding: 0; margin: 0; }
    .list-item { background: var(--card-bg); border-radius: 10px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
    .list-item-content { padding: 15px; display: flex; align-items: center; justify-content: space-between; }
    .list-item-details { display: flex; flex-direction: column; flex-grow: 1; text-align: left;}
    .list-item-title { font-size: 1.1rem; font-weight: 500; }
    .list-item-subtitle { font-size: 0.9rem; color: var(--muted); margin-top: 4px; }
    .no-data-msg { text-align: center; padding: 40px; color: var(--muted); background: var(--card-bg); border-radius: 12px; }
    .shopping-item { background: var(--card-bg); border-radius:10px; margin-bottom: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 10px 15px; display: flex; align-items: center; gap: 10px; }
    .shopping-item-toggle-btn { flex-grow: 1; text-align: left; border: none; font-size: 1rem; padding: 10px 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; color: var(--list-item-text); font-weight: 500; cursor: pointer;}
    .shopping-item-toggle-btn.pending { background-color: var(--pending-bg); }
    .shopping-item-toggle-btn.bought { background-color: var(--bought-bg); text-decoration: line-through; opacity: 0.85; }
    .item-date { font-size: 0.8rem; opacity: 0.9; }
    .shopping-list-section-title { font-size: 1rem; color: var(--muted); margin: 20px 10px 10px; }
    .add-article-btn-container { padding: 10px; }
    .add-article-btn { width: 100%; padding: 12px; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; background-color: var(--primary); color: var(--action-text); }
  </style>
</head>
<body>
  <div id="spinner" class="spinner"></div>
  <div id="app-root"></div>
  <div id="tabs-root"></div>
  <div id="toast" class="toast"></div>

  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <script src="components/Dashboard.js"></script>
  <script src="components/ShoppingList.js"></script>
  <script src="components/ShoppingItemForm.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
