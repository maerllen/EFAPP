/**
 * EFAPP - Loja Virtual Integrada
 * Regras de visualização e permissão:
 * - Perfil TIPO1: visualiza e compra produtos do TIPO1
 * - Perfil TIPO2: visualiza e compra produtos do TIPO2
 * - Perfil TIPO3: pode cadastrar produtos do TIPO1 e do TIPO2
 * - Perfil TIPO4 e TIPO7: podem cadastrar produtos de todas as naturezas
 * - As receitas geradas alimentam automaticamente o controle financeiro do TIPO5
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ProdutoLoja, TipoProduto, CategoriaProduto, SegmentoAtuacao } from '../types/index.ts';
import {
  ShoppingBag,
  PlusCircle,
  Search,
  Book,
  Laptop,
  Box,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface LojaViewProps {
  onAbrirCarrinho: () => void;
}

export const LojaView: React.FC<LojaViewProps> = ({ onAbrirCarrinho }) => {
  const { produtos, usuarioAtual, adicionarAoCarrinho, cadastrarProduto } = useApp();

  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODAS');
  const [modalNovoProdutoAberto, setModalNovoProdutoAberto] = useState(false);

  // Estados do formulário de novo produto
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<CategoriaProduto>('LIVRO');
  const [novoTipo, setNovoTipo] = useState<TipoProduto>('TIPO1');
  const [novoSegmento, setNovoSegmento] = useState<SegmentoAtuacao>('SAUDE');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoPreco, setNovoPreco] = useState(49.90);
  const [novoEstoque, setNovoEstoque] = useState(50);

  // Filtragem estrita conforme regras de perfis:
  // "Perfil TIPO1 poderá ter acesso a loja e visualizar todos os produtos do TIPO1"
  // "Perfil TIPO2 poderá ter acesso a loja e visualizar todos os produtos do TIPO2"
  const produtosFiltrados = produtos.filter((p) => {
    // 1. Filtro por Perfil
    if (usuarioAtual.codigoPerfil === 'TIPO1' && p.tipoProduto !== 'TIPO1') {
      return false;
    }
    if (usuarioAtual.codigoPerfil === 'TIPO2' && p.tipoProduto !== 'TIPO2') {
      return false;
    }

    // 2. Filtro de Categoria
    if (categoriaFiltro !== 'TODAS' && p.categoria !== categoriaFiltro) {
      return false;
    }

    // 3. Filtro de Busca
    const matchBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(busca.toLowerCase());

    return matchBusca;
  });

  // Permissões de cadastro de produto:
  // "Perfil TIPO3 poderá cadastrar produtos do TIPO1 e do TIPO2."
  // "Perfil TIPO4 poderá cadastrar produtos de todas as naturezas"
  // "Perfil TIPO7 poderá fazer tudo"
  const podeCadastrarProdutos = ['TIPO3', 'TIPO4', 'TIPO7'].includes(usuarioAtual.codigoPerfil);

  // Opções de tipos de produto que o usuário logado tem permissão para cadastrar
  const tiposPermitidosCadastro: TipoProduto[] =
    usuarioAtual.codigoPerfil === 'TIPO3'
      ? ['TIPO1', 'TIPO2']
      : ['TIPO1', 'TIPO2', 'GERAL'];

  const handleSalvarProduto = (e: React.FormEvent) => {
    e.preventDefault();

    const novoProd: ProdutoLoja = {
      id: Date.now(),
      nome: novoNome,
      categoria: novaCategoria,
      tipoProduto: novoTipo,
      segmento: novoSegmento,
      descricao: novaDescricao,
      preco: Number(novoPreco),
      estoque: Number(novoEstoque),
      imagemUrl:
        novaCategoria === 'LIVRO'
          ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
          : novaCategoria === 'SOFTWARE'
          ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    };

    cadastrarProduto(novoProd);
    setModalNovoProdutoAberto(false);
    setNovoNome('');
    setNovaDescricao('');
  };

  return (
    <div className="space-y-6">
      {/* Banner da Loja Institucional */}
      <div className="bg-gradient-to-r from-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5 text-teal-300" />
            <span>Loja Virtual Especializada EFAPP</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Livros, Softwares e Materiais Didáticos
          </h1>

          <p className="text-sm text-teal-100 font-light leading-relaxed">
            Publicações oficiais, kits práticos e ferramentas de apoio para agentes públicos e privados da saúde e educação.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-white/10 px-3 py-1.5 rounded-xl font-semibold">
              Visualizando catálogo: <strong>{usuarioAtual.codigoPerfil === 'TIPO7' ? 'Completo (TIPO 1, 2 e Geral)' : `Produtos ${usuarioAtual.codigoPerfil}`}</strong>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl font-semibold">
              Pagamentos seguros via PIX, Cartão e Boleto
            </span>
          </div>
        </div>
      </div>

      {/* Controles de Busca e Filtro */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar material na loja..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoriaFiltro('TODAS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
              categoriaFiltro === 'TODAS'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas as Categorias
          </button>
          <button
            onClick={() => setCategoriaFiltro('LIVRO')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
              categoriaFiltro === 'LIVRO'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            📚 Livros
          </button>
          <button
            onClick={() => setCategoriaFiltro('APOSTILA')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
              categoriaFiltro === 'APOSTILA'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            📑 Apostilas
          </button>
          <button
            onClick={() => setCategoriaFiltro('SOFTWARE')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
              categoriaFiltro === 'SOFTWARE'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            💻 Softwares
          </button>

          {/* Botão de Cadastrar Produto (TIPO3, TIPO4 e TIPO7) */}
          {podeCadastrarProdutos && (
            <button
              onClick={() => setModalNovoProdutoAberto(true)}
              className="ml-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Produto</span>
            </button>
          )}
        </div>
      </div>

      {/* Grade de Produtos */}
      {produtosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Nenhum produto disponível para o seu perfil</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            O seu perfil atual (<strong>{usuarioAtual.codigoPerfil}</strong>) tem acesso filtrado aos produtos do seu tipo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
            >
              <div>
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-900/80 text-white">
                      {produto.tipoProduto}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-600/90 text-white">
                      {produto.categoria}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {produto.nome}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {produto.descricao}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Preço</span>
                    <span className="text-lg font-extrabold text-slate-900 font-mono">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Estoque: <strong>{produto.estoque} un</strong>
                  </span>
                </div>

                <button
                  onClick={() => {
                    adicionarAoCarrinho(produto);
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cadastro de Produto (TIPO 3, TIPO 4 e TIPO 7) */}
      {modalNovoProdutoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-200" />
                <h3 className="font-bold text-base">
                  Cadastrar Produto na Loja ({usuarioAtual.codigoPerfil})
                </h3>
              </div>
              <button
                onClick={() => setModalNovoProdutoAberto(false)}
                className="text-emerald-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarProduto} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Nome do Produto / Publicação
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Manual de Biossegurança Hospitalar"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Descrição Detalhada
                </label>
                <textarea
                  required
                  rows={2}
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Sumário e objetivos da publicação..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Tipo do Produto
                  </label>
                  <select
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    {tiposPermitidosCadastro.map((t) => (
                      <option key={t} value={t}>
                        {t === 'GERAL' ? 'Geral (Todos os Públicos)' : `Destinado ao ${t}`}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {usuarioAtual.codigoPerfil === 'TIPO3'
                      ? 'TIPO 3 pode cadastrar produtos do TIPO1 e TIPO2.'
                      : 'TIPO 4 e 7 cadastram produtos de todas as naturezas.'}
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Categoria
                  </label>
                  <select
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="LIVRO">Livro Impresso / Digital</option>
                    <option value="APOSTILA">Apostila de Questões</option>
                    <option value="SOFTWARE">Software / Licença Digital</option>
                    <option value="KIT_PRATICO">Kit Prático de Intervenção</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Preço (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Estoque Disponível
                  </label>
                  <input
                    type="number"
                    required
                    value={novoEstoque}
                    onChange={(e) => setNovoEstoque(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Salvar Produto no Catálogo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
