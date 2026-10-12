function obterUsuarioAtivo() {
  return localStorage.getItem('king_usuario_ativo') || 'Odilon';
}

function definirUsuarioAtivo(nome) {
  localStorage.setItem('king_usuario_ativo', nome);
}

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
