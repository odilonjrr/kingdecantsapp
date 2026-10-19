// ============================================================
// King Decantes - Lógica de Conexão, Cálculos e Supabase (app.js)
// ============================================================

// 1. Identificação do Usuário Ativo (Odilon ou Ursula)
function obterUsuarioAtivo() {
  return localStorage.getItem('king_usuario_ativo') || 'Odilon';
}

function definirUsuarioAtivo(nome) {
  localStorage.setItem('king_usuario_ativo', nome);
}

// 2. Funções de Insumos & Matérias-Primas (Perfumes frasco-mãe, vidros, caixas)
async function cadastrarInsumo(dados) {
  try {
    const usuario = obterUsuarioAtivo();
    const { data, error } = await supabase
      .from('insumos')
      .insert([
        {
          nome: dados.nome,
          categoria: dados.categoria,
          quantidade_estoque: parseFloat(dados.quantidade_estoque || 0),
          unidade_medida: dados.unidade_medida || 'un',
          custo_unitario: parseFloat(dados.custo_unitario || 0),
          fornecedor: dados.fornecedor || '',
          criado_por: usuario
        }
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao cadastrar insumo:', err);
    throw err;
  }
}

async function listarInsumos() {
  try {
    const { data, error } = await supabase
      .from('insumos')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar insumos:', err);
    return [];
  }
}

// Editar e excluir: o .select() devolve as linhas afetadas; se vier vazio,
// o banco não deixou (regra de permissão/RLS) e avisamos em vez de fingir sucesso.
async function atualizarInsumo(id, dados) {
  const { data, error } = await supabase
    .from('insumos')
    .update({
      nome: dados.nome,
      categoria: dados.categoria,
      quantidade_estoque: parseFloat(dados.quantidade_estoque || 0),
      unidade_medida: dados.unidade_medida || 'un',
      custo_unitario: parseFloat(dados.custo_unitario || 0),
      fornecedor: dados.fornecedor || ''
    })
    .eq('id', id)
    .select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('o banco não permitiu editar este item (verifique as permissões da tabela insumos).');
  return data;
}

async function excluirInsumo(id) {
  const { data, error } = await supabase.from('insumos').delete().eq('id', id).select();
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('o banco não permitiu excluir este item (verifique as permissões da tabela insumos).');
  return data;
}

// 3. Funções de Produtos / Fórmulas e Decantes
async function cadastrarProduto(dados) {
  try {
    const usuario = obterUsuarioAtivo();
    const linha = {
      nome: dados.nome,
      categoria: dados.categoria || 'Decante',
      tamanho_ml: parseFloat(dados.tamanho_ml || 0),
      custo_total: parseFloat(dados.custo_total || 0),
      preco_venda_sugerido: parseFloat(dados.preco_venda_sugerido || 0),
      margem_lucro_pct: parseFloat(dados.margem_lucro_pct || 0),
      criado_por: usuario
    };
    if (dados.rendimento) {
      linha.rendimento = dados.rendimento;
      linha.unidade_rendimento = dados.unidade_rendimento || 'un';
    }
    let { data, error } = await supabase.from('produtos').insert([linha]).select();

    // Se a tabela ainda não tiver as colunas de rendimento (PGRST204 = coluna
    // não encontrada), salva a receita sem elas em vez de perder o cadastro.
    if (error && error.code === 'PGRST204' && 'rendimento' in linha) {
      console.warn('Tabela produtos sem colunas de rendimento; salvando sem elas.', error);
      delete linha.rendimento;
      delete linha.unidade_rendimento;
      ({ data, error } = await supabase.from('produtos').insert([linha]).select());
    }

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    throw err;
  }
}

async function listarProdutos() {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return [];
  }
}

// 4. Funções de Entrada de Compras
async function registrarCompra(dados) {
  try {
    const usuario = obterUsuarioAtivo();
    const { data, error } = await supabase
      .from('compras')
      .insert([
        {
          fornecedor: dados.fornecedor,
          data_compra: dados.data_compra || new Date().toISOString(),
          valor_total: parseFloat(dados.valor_total || 0),
          numero_nota: dados.numero_nota || '',
          criado_por: usuario
        }
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Erro ao registrar compra:', err);
    throw err;
  }
}

async function listarCompras() {
  try {
    const { data, error } = await supabase
      .from('compras')
      .select('*')
      .order('data_compra', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Erro ao listar compras:', err);
    return [];
  }
}

// 5. Motor de Cálculo de Custo Unitário de Decantes
function calcularCustoDecante({ custoFrascoMae, volumeFrascoMaeMl, fracionamentoMl, custoFlaconete, custoEtiqueta, custoEmbalagem }) {
  const custoPorMl = volumeFrascoMaeMl > 0 ? (custoFrascoMae / volumeFrascoMaeMl) : 0;
  const custoLiquido = custoPorMl * fracionamentoMl;
  const custoMaterial = (custoFlaconete || 0) + (custoEtiqueta || 0) + (custoEmbalagem || 0);
  const custoTotal = custoLiquido + custoMaterial;

  return {
    custoLiquido: parseFloat(custoLiquido.toFixed(2)),
    custoMaterial: parseFloat(custoMaterial.toFixed(2)),
    custoTotal: parseFloat(custoTotal.toFixed(2))
  };
}

// 6. Utilitários de exibição (usados pelas telas)
function formatarReais(valor) {
  return 'R$ ' + (parseFloat(valor) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function escaparHtml(texto) {
  return String(texto == null ? '' : texto).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
