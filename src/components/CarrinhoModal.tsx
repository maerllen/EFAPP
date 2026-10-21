/**
 * EFAPP - Modal do Carrinho de Compras da Loja Virtual
 * Finalização de pedidos e integração financeira automática com o módulo do TIPO5
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Trash2, ShoppingBag, CreditCard, QrCode, FileText, CheckCircle2 } from 'lucide-react';

interface CarrinhoModalProps {
  aberto: boolean;
  onFechar: () => void;
}

export const CarrinhoModal: React.FC<CarrinhoModalProps> = ({ aberto, onFechar }) => {
  const { carrinho, removerDoCarrinho, finalizarCompra } = useApp();
  const [formaPagamento, setFormaPagamento] = useState<'PIX' | 'CARTAO' | 'BOLETO'>('PIX');
  const [compraConcluida, setCompraConcluida] = useState(false);

  if (!aberto) return null;

  const total = carrinho.reduce((acc, item) => acc + item.produto.preco * item.quantidade, 0);

  const handleCheckout = () => {
    const nomePagto =
      formaPagamento === 'PIX'
        ? 'PIX (Chave Institucional EFAPP)'
        : formaPagamento === 'CARTAO'
        ? 'Cartão de Crédito'
        : 'Boleto Bancário Registrado';

    const res = finalizarCompra(nomePagto);
    if (res.sucesso) {
      setCompraConcluida(true);
    }
  };

  const handleFecharTudo = () => {
    setCompraConcluida(false);
    onFechar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Topo do Carrinho */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">Carrinho de Compras - Loja EFAPP</h3>
          </div>
          <button
            onClick={handleFecharTudo}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {compraConcluida ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Pedido Confirmado!</h4>
              <p className="text-xs text-slate-500 mt-1">
                A receita deste pedido foi lançada automaticamente no Painel Financeiro da EFAPP (TIPO 5).
              </p>
            </div>

            {formaPagamento === 'PIX' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <span className="font-semibold text-slate-700 block">Chave PIX da EFAPP:</span>
                <code className="bg-white border px-3 py-1.5 rounded font-mono text-emerald-800 font-bold block select-all">
                  financeiro@efapp.edu.br
                </code>
                <span className="text-[11px] text-slate-400 block">
                  Envie o comprovante para liberação imediata do acesso.
                </span>
              </div>
            )}

            <button
              onClick={handleFecharTudo}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
            >
              Concluir e Voltar à Loja
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {carrinho.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-sm font-medium">Seu carrinho está vazio.</p>
                <p className="text-xs text-slate-400">Navegue pela loja para adicionar livros, apostilas ou softwares.</p>
              </div>
            ) : (
              <>
                {/* Lista de Itens */}
                <div className="space-y-3">
                  {carrinho.map(({ produto, quantidade }) => (
                    <div
                      key={produto.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex-1 pr-3">
                        <span className="font-bold text-slate-800 line-clamp-1">
                          {produto.nome}
                        </span>
                        <div className="text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="font-mono">Qtd: {quantidade}</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            R$ {(produto.preco * quantidade).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removerDoCarrinho(produto.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition"
                        title="Remover produto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Forma de Pagamento */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Forma de Pagamento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormaPagamento('PIX')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        formaPagamento === 'PIX'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-emerald-600" />
                      <span>PIX (5% desc.)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormaPagamento('CARTAO')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        formaPagamento === 'CARTAO'
                          ? 'bg-blue-50 border-blue-600 text-blue-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span>Cartão 12x</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormaPagamento('BOLETO')}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                        formaPagamento === 'BOLETO'
                          ? 'bg-purple-50 border-purple-600 text-purple-800'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span>Boleto Bancário</span>
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">Total do Pedido:</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg transition"
                >
                  Confirmar e Finalizar Pedido
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
