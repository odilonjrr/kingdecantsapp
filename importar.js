// ============================================================
// King Decantes - Importar insumos de planilha (importar.js)
// Lê .xlsx/.xls/.csv no próprio navegador, entende o formato do
// inventário (uma aba por categoria, colunas Produto, Tamanho,
// Unid. medida, Quantidade, Unid. estoque, Marca, Observações),
// mostra uma prévia e grava os itens confirmados no estoque.
// ============================================================
(function () {
  // Leitor de planilhas (SheetJS), carregado só quando for importar
  const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

  const CATEGORIAS = { perfume: 'Perfume', embalagem: 'Embalagem', artesanato: 'Artesanato', acessorio: 'Acessório', outro: 'Outro' };

  // Nomes de coluna aceitos (sem acento e em minúsculas)
  const COLUNAS = {
    nome: ['produto', 'nome', 'item', 'insumo', 'descricao'],
    tamanho: ['tamanho', 'volume', 'peso', 'conteudo'],
    unidTamanho: ['unid. medida', 'unid medida', 'unidade de medida', 'unidade medida', 'medida', 'un. medida'],
    quantidade: ['quantidade', 'qtd', 'qtde', 'qtd.'],
    unidEstoque: ['unid. estoque', 'unid estoque', 'unidade de estoque', 'unidade estoque', 'un. estoque'],
    subcategoria: ['subcategoria', 'sub-categoria'],
    categoria: ['categoria'],
    marca: ['marca ou referencia', 'marca', 'referencia', 'marca/referencia'],
    observacoes: ['observacoes', 'observacao', 'obs', 'obs.'],
    valor: ['valor pago', 'valor', 'preco', 'preco pago', 'custo', 'valor total']
  };

  // Unidade da planilha -> [unidade do estoque, fator]
  const CONVERSAO = {
    ml: ['ml', 1], l: ['ml', 1000], lt: ['ml', 1000], litro: ['ml', 1000], litros: ['ml', 1000],
    g: ['g', 1], gr: ['g', 1], grama: ['g', 1], gramas: ['g', 1], kg: ['g', 1000], quilo: ['g', 1000], quilos: ['g', 1000]
  };

  function normalizar(t) {
    return String(t == null ? '' : t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  function texto(v) {
    return v == null ? '' : String(v).trim();
  }

  // Aceita 50, "50", "1,5" e "1.5"; devolve null para textos como "12 × 12 × 4"
  function numero(v) {
    if (typeof v === 'number') return isFinite(v) ? v : null;
    const t = texto(v).replace(/\s/g, '');
    if (!/^\d+([.,]\d+)?$/.test(t)) return null;
    return parseFloat(t.replace(',', '.'));
  }

  function formatarNumero(n) {
    return Number.isInteger(n) ? String(n) : String(n).replace('.', ',');
  }

  function categoriaPorTexto(t) {
    const n = normalizar(t);
    if (!n) return null;
    if (CATEGORIAS[n]) return n;
    if (/vidraria|bequer|pipeta|proveta|funil|balanca|termometro/.test(n)) return 'acessorio';
    if (/frasco|caixa|embalag|papel|etiqueta|vinil|filme|sacola|valvula|tampa|pote|rotulo/.test(n)) return 'embalagem';
    if (/perfum/.test(n)) return 'perfume';
    if (/essenc|sabon|saboaria|vela|cera|oleo|extrato|glicerin|parafina|fragrancia|aroma/.test(n)) return 'artesanato';
    return null;
  }

  // Lê uma aba (matriz de células) e devolve os itens dela
  function itensDaAba(nomeAba, linhas) {
    const itens = [];
    let mapa = null;
    for (const linha of linhas) {
      const celulas = (linha || []).map(texto);
      const normal = celulas.map(normalizar);
      // Linha de cabeçalho: tem a coluna do nome do produto
      if (normal.some(c => COLUNAS.nome.includes(c))) {
        mapa = {};
        normal.forEach((c, i) => {
          for (const [chave, nomes] of Object.entries(COLUNAS)) {
            if (mapa[chave] == null && nomes.includes(c)) { mapa[chave] = i; break; }
          }
        });
        continue;
      }
      if (!mapa) continue;
      const r = {};
      for (const chave of Object.keys(COLUNAS)) r[chave] = mapa[chave] == null ? null : (linha || [])[mapa[chave]];
      if (!texto(r.nome)) continue;
      // Título de seção (só o primeiro campo preenchido) não é item
      const outros = Object.keys(COLUNAS).filter(k => k !== 'nome' && texto(r[k]));
      if (outros.length === 0) continue;
      itens.push(montarItem(r, nomeAba));
    }
    return itens;
  }

  function montarItem(r, aba) {
    const nomeBase = texto(r.nome);
    const categoria = categoriaPorTexto(r.categoria) || categoriaPorTexto(r.subcategoria) ||
      categoriaPorTexto(aba) || categoriaPorTexto(nomeBase) || 'outro';
    const tamanhoNum = numero(r.tamanho);
    const tamanhoTxt = texto(r.tamanho);
    const unidTam = texto(r.unidTamanho);
    const qtd = numero(r.quantidade);
    const avisos = [];

    // O tamanho entra no nome (ex.: "Frasco PET âmbar 50 ml"), para distinguir embalagens
    const descTamanho = tamanhoTxt
      ? `${tamanhoNum != null ? formatarNumero(tamanhoNum) : tamanhoTxt}${unidTam ? ' ' + unidTam : ''}`
      : '';
    const nome = descTamanho && !normalizar(nomeBase).includes(normalizar(descTamanho))
      ? `${nomeBase} ${descTamanho}` : nomeBase;

    // Estoque: matéria-prima em ml/g (tamanho × quantidade), embalagens e acessórios em unidades
    const contavel = categoria === 'embalagem' || categoria === 'acessorio';
    const convTamanho = CONVERSAO[normalizar(unidTam)];
    const convEstoque = CONVERSAO[normalizar(r.unidEstoque)];
    let quantidade, unidade;
    if (!contavel && tamanhoNum != null && convTamanho) {
      quantidade = tamanhoNum * convTamanho[1] * (qtd == null ? 1 : qtd);
      unidade = convTamanho[0];
      if (qtd == null) avisos.push('Quantidade não informada: considerei 1.');
    } else if (!contavel && convEstoque && qtd != null) {
      quantidade = qtd * convEstoque[1];
      unidade = convEstoque[0];
    } else {
      quantidade = qtd == null ? 0 : qtd;
      unidade = 'un';
      if (qtd == null) avisos.push('Quantidade não informada: entra como 0.');
    }
    quantidade = Math.round(quantidade * 1000) / 1000;

    // Se a planilha tiver o valor pago, o custo por unidade é valor ÷ quantidade
    const valor = numero(r.valor);
    const custo = valor != null && quantidade > 0 ? valor / quantidade : 0;

    const observacoes = [texto(r.observacoes), texto(r.subcategoria) ? `Subcategoria: ${texto(r.subcategoria)}` : '']
      .filter(Boolean).join(' ');

    return {
      nome, categoria, aba, avisos, incluir: true,
      quantidade_estoque: quantidade,
      unidade_medida: unidade,
      custo_unitario: custo,
      marca: texto(r.marca),
      observacoes
    };
  }

  // abas = [{ nome, linhas: [[célula, ...], ...] }]
  function extrairItens(abas, nomesExistentes) {
    const existentes = new Set((nomesExistentes || []).map(normalizar));
    const itens = [];
    abas.forEach(aba => itens.push(...itensDaAba(aba.nome, aba.linhas)));
    itens.forEach(item => {
      if (existentes.has(normalizar(item.nome))) {
        item.existe = true;
        item.incluir = false;
        item.avisos.unshift('Já existe no estoque (desmarcado para não duplicar).');
      }
    });
    return itens;
  }

  function carregarLeitor() {
    if (window.XLSX) return Promise.resolve();
    return new Promise((ok, falha) => {
      const s = document.createElement('script');
      s.src = XLSX_URL;
      s.onload = ok;
      s.onerror = () => falha(new Error('não foi possível carregar o leitor de planilhas. Verifique a internet.'));
      document.head.appendChild(s);
    });
  }

  async function lerArquivo(arquivo) {
    await carregarLeitor();
    const dados = await arquivo.arrayBuffer();
    const pasta = window.XLSX.read(dados, { type: 'array' });
    return pasta.SheetNames.map(nome => ({
      nome,
      linhas: window.XLSX.utils.sheet_to_json(pasta.Sheets[nome], { header: 1, raw: true, defval: null, blankrows: false })
    }));
  }

  // ---------------- Tela de prévia ----------------
  let itensPrevia = [];

  function descricaoEstoque(item) {
    return `${formatarNumero(item.quantidade_estoque)} ${item.unidade_medida}`;
  }

  function renderizarPrevia() {
    const lista = document.getElementById('importar-lista');
    let abaAtual = null;
    lista.innerHTML = itensPrevia.map((item, i) => {
      const titulo = item.aba !== abaAtual ? `<div class="col-span-full text-[11px] uppercase tracking-wider text-brand-gold font-semibold pt-3">${escaparHtml(item.aba)}</div>` : '';
      abaAtual = item.aba;
      const opcoes = Object.entries(CATEGORIAS).map(([v, n]) => `<option value="${v}"${v === item.categoria ? ' selected' : ''}>${n}</option>`).join('');
      return `${titulo}
        <div class="bg-[#181816] border border-brand-cardBorder rounded-xl p-3 flex items-start gap-3 ${item.incluir ? '' : 'opacity-50'}">
          <input type="checkbox" data-i="${i}" class="importar-incluir mt-0.5 w-4 h-4 accent-[#d8ac43] shrink-0" ${item.incluir ? 'checked' : ''} aria-label="Incluir ${escaparHtml(item.nome)}">
          <div class="flex-1 min-w-0 space-y-1">
            <div class="text-xs font-semibold text-white break-words">${escaparHtml(item.nome)}</div>
            <div class="text-[11px] text-zinc-400">Estoque: <strong class="text-zinc-200">${descricaoEstoque(item)}</strong>${item.marca ? ' • ' + escaparHtml(item.marca) : ''}</div>
            ${item.avisos.map(a => `<div class="text-[11px] text-amber-400">${escaparHtml(a)}</div>`).join('')}
          </div>
          <select data-i="${i}" class="importar-categoria shrink-0 bg-[#131312] border border-brand-cardBorder rounded-lg px-2 py-1 text-[11px] text-white" aria-label="Categoria">${opcoes}</select>
        </div>`;
    }).join('');
    atualizarResumo();
  }

  function atualizarResumo() {
    const marcados = itensPrevia.filter(i => i.incluir).length;
    const comAviso = itensPrevia.filter(i => i.avisos.length).length;
    document.getElementById('importar-resumo').textContent =
      `${itensPrevia.length} itens encontrados • ${marcados} selecionados${comAviso ? ` • ${comAviso} com aviso` : ''}`;
    const btn = document.getElementById('importar-confirmar');
    btn.textContent = `Importar ${marcados} ${marcados === 1 ? 'item' : 'itens'}`;
    btn.disabled = marcados === 0;
  }

  function montarJanela() {
    if (document.getElementById('modal-importar')) return;
    const div = document.createElement('div');
    div.id = 'modal-importar';
    div.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden items-end sm:items-center justify-center p-0 sm:p-4';
    div.innerHTML = `
      <div class="bg-brand-card border border-brand-cardBorder w-full max-w-2xl rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[92vh]">
        <div class="p-4 border-b border-brand-cardBorder space-y-1">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white">Importar planilha</h3>
            <button type="button" id="importar-fechar" class="text-zinc-400 hover:text-white p-1" aria-label="Fechar">✕</button>
          </div>
          <p id="importar-resumo" class="text-[11px] text-zinc-400"></p>
          <p id="importar-sem-preco" class="text-[11px] text-amber-400 hidden">A planilha não tem preço: os itens entram com custo R$ 0,00. Depois, use Editar em cada item para informar o valor pago.</p>
          <div class="flex gap-3 text-[11px] pt-1">
            <button type="button" id="importar-todos" class="text-brand-gold underline">Marcar todos</button>
            <button type="button" id="importar-nenhum" class="text-brand-gold underline">Desmarcar todos</button>
          </div>
        </div>
        <div id="importar-lista" class="flex-1 overflow-y-auto p-4 pt-1 grid grid-cols-1 gap-2 content-start"></div>
        <div class="p-4 border-t border-brand-cardBorder flex gap-2">
          <button type="button" id="importar-cancelar" class="w-1/3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl text-xs">Cancelar</button>
          <button type="button" id="importar-confirmar" class="w-2/3 py-2.5 bg-brand-gold hover:bg-brand-goldLight text-black font-semibold rounded-xl text-xs disabled:opacity-50">Importar</button>
        </div>
      </div>`;
    document.body.appendChild(div);

    div.addEventListener('change', ev => {
      const i = ev.target.dataset.i;
      if (i == null) return;
      if (ev.target.classList.contains('importar-incluir')) itensPrevia[i].incluir = ev.target.checked;
      if (ev.target.classList.contains('importar-categoria')) itensPrevia[i].categoria = ev.target.value;
      ev.target.closest('.rounded-xl').classList.toggle('opacity-50', !itensPrevia[i].incluir);
      atualizarResumo();
    });
    const marcarTodos = valor => { itensPrevia.forEach(i => { i.incluir = valor; }); renderizarPrevia(); };
    document.getElementById('importar-todos').addEventListener('click', () => marcarTodos(true));
    document.getElementById('importar-nenhum').addEventListener('click', () => marcarTodos(false));
    document.getElementById('importar-fechar').addEventListener('click', fecharJanela);
    document.getElementById('importar-cancelar').addEventListener('click', fecharJanela);
    document.getElementById('importar-confirmar').addEventListener('click', confirmarImportacao);
  }

  function fecharJanela() {
    const m = document.getElementById('modal-importar');
    m.classList.add('hidden');
    m.classList.remove('flex');
    itensPrevia = [];
  }

  async function confirmarImportacao() {
    const selecionados = itensPrevia.filter(i => i.incluir);
    if (!selecionados.length) return;
    const btn = document.getElementById('importar-confirmar');
    btn.disabled = true;
    try {
      await cadastrarInsumos(selecionados.map(i => ({
        nome: i.nome, categoria: i.categoria, quantidade_estoque: i.quantidade_estoque,
        unidade_medida: i.unidade_medida, custo_unitario: i.custo_unitario,
        marca: i.marca, observacoes: i.observacoes
      })), (feitos, total) => { btn.textContent = `Importando ${feitos}/${total}...`; });
      alert(`${selecionados.length} ${selecionados.length === 1 ? 'item importado' : 'itens importados'} para o estoque!`);
      fecharJanela();
      if (typeof carregarListaInsumos === 'function') await carregarListaInsumos();
    } catch (err) {
      console.error(err);
      alert('Erro ao importar: ' + err.message + '\nNada foi perdido: os itens que já entraram aparecem na lista.');
      atualizarResumo();
      if (typeof carregarListaInsumos === 'function') carregarListaInsumos();
    }
  }

  async function aoEscolherArquivo(ev) {
    const arquivo = ev.target.files && ev.target.files[0];
    ev.target.value = '';
    if (!arquivo) return;
    try {
      const abas = await lerArquivo(arquivo);
      const existentes = (typeof todosInsumos !== 'undefined' ? todosInsumos : []).map(i => i.nome);
      itensPrevia = extrairItens(abas, existentes);
      if (!itensPrevia.length) {
        alert('Não encontrei itens na planilha. Ela precisa de uma linha de cabeçalho com a coluna "Produto" (ou "Nome").');
        return;
      }
      montarJanela();
      const temPreco = abas.some(a => a.linhas.some(l => (l || []).some(c => COLUNAS.valor.includes(normalizar(c)))));
      document.getElementById('importar-sem-preco').classList.toggle('hidden', temPreco);
      renderizarPrevia();
      const m = document.getElementById('modal-importar');
      m.classList.remove('hidden');
      m.classList.add('flex');
    } catch (err) {
      console.error(err);
      alert('Erro ao ler a planilha: ' + err.message);
    }
  }

  function abrirImportacao() {
    let input = document.getElementById('importar-arquivo');
    if (!input) {
      input = document.createElement('input');
      input.type = 'file';
      input.id = 'importar-arquivo';
      input.accept = '.xlsx,.xls,.csv';
      input.className = 'hidden';
      input.addEventListener('change', aoEscolherArquivo);
      document.body.appendChild(input);
    }
    input.click();
  }

  window.abrirImportacao = abrirImportacao;
  // Exposto para testes
  window.KingImportar = { extrairItens, lerArquivo };
})();
