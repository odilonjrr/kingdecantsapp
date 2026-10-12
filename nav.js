// ============================================================
// King Decantes - Menu inferior compartilhado (nav.js)
// Um único menu para todas as telas: os links ficam sempre
// iguais e a aba da tela atual fica destacada.
// Telas com <body data-sem-menu> (login, formulação) não recebem menu.
// ============================================================
(function () {
  const ITENS_MENU = [
    { secao: 'painel', href: './dashboard.html', icone: 'dashboard', rotulo: 'Painel' },
    { secao: 'receitas', href: './receitas.html', icone: 'calculate', rotulo: 'Receitas' },
    { secao: 'estoque', href: './estoque.html', icone: 'inventory_2', rotulo: 'Estoque' },
    { secao: 'compras', href: './compras.html', icone: 'shopping_cart', rotulo: 'Compras' },
    { secao: 'perfil', href: './index.html', icone: 'person', rotulo: 'Perfil' }
  ];

  // Telas "filhas" acendem a aba da seção a que pertencem
  const SECAO_POR_PAGINA = {
    'dashboard': 'painel',
    'receitas': 'receitas',
    'formulacao': 'receitas',
    'estoque': 'estoque',
    'compras': 'compras',
    'index': 'perfil'
  };

  const COR_ATIVA = '#d8ac43';
  const COR_INATIVA = '#a1a1aa';

  // Funciona com e sem ".html" na URL (a Vercel pode servir /dashboard)
  function secaoAtual() {
    const nome = window.location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
    return SECAO_POR_PAGINA[nome] || null;
  }

  function garantirFonteIcones() {
    if (document.querySelector('link[href*="Material+Symbols+Outlined"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
    document.head.appendChild(link);
  }

  function montarMenu() {
    if (document.body.hasAttribute('data-sem-menu')) return;
    if (document.getElementById('king-bottom-nav')) return;
    garantirFonteIcones();

    const secao = secaoAtual();
    const nav = document.createElement('nav');
    nav.id = 'king-bottom-nav';
    nav.setAttribute('aria-label', 'Menu principal');
    nav.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:50;background:rgba(19,19,18,0.95);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid #2d2d2a;padding-bottom:env(safe-area-inset-bottom);';

    const linha = document.createElement('div');
    linha.style.cssText = 'height:64px;display:flex;align-items:stretch;justify-content:space-around;max-width:640px;margin:0 auto;';

    ITENS_MENU.forEach(item => {
      const ativo = item.secao === secao;
      const a = document.createElement('a');
      a.href = item.href;
      if (ativo) a.setAttribute('aria-current', 'page');
      a.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:44px;text-decoration:none;font-family:inherit;border-top:2px solid ' +
        (ativo ? COR_ATIVA : 'transparent') + ';color:' + (ativo ? COR_ATIVA : COR_INATIVA) + ';';

      const icone = document.createElement('span');
      icone.className = 'material-symbols-outlined';
      icone.style.cssText = 'font-size:22px;line-height:1;' + (ativo ? "font-variation-settings:'FILL' 1;" : '');
      icone.textContent = item.icone;

      const rotulo = document.createElement('span');
      rotulo.style.cssText = 'font-size:10px;font-weight:600;letter-spacing:0.02em;';
      rotulo.textContent = item.rotulo;

      a.appendChild(icone);
      a.appendChild(rotulo);
      linha.appendChild(a);
    });

    nav.appendChild(linha);
    document.body.appendChild(nav);

    // Garante que o fim do conteúdo não fique escondido atrás do menu
    const atual = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    if (atual < 88) document.body.style.paddingBottom = '88px';
  }

  // Elementos com data-href viram navegação (botões que antes não faziam nada)
  function ligarAtalhos() {
    document.querySelectorAll('[data-href]').forEach(el => {
      if (el.dataset.navLigado) return;
      el.dataset.navLigado = '1';
      el.style.cursor = 'pointer';
      el.addEventListener('click', ev => {
        ev.preventDefault();
        window.location.href = el.getAttribute('data-href');
      });
    });
  }

  // Voltar com fallback: se a tela foi aberta direto (sem histórico do app), vai para a seção pai
  window.voltarOu = function (destino) {
    if (document.referrer && document.referrer.indexOf(window.location.host) !== -1 && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = destino;
    }
  };

  function iniciar() {
    montarMenu();
    ligarAtalhos();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
