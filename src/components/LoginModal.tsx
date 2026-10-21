/**
 * EFAPP - Modal de Autenticação Institucional Direta
 * Login seguro por CPF ou E-mail e Senha para os agentes de Saúde e Educação
 * Atribui automaticamente o perfil TIPO 1 para novas contas e mantém os perfis atribuídos.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, LogIn, KeyRound, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginModalProps {
  aberto: boolean;
  onFechar: () => void;
  onAbrirCadastro: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  aberto,
  onFechar,
  onAbrirCadastro
}) => {
  const { realizarLoginEfapp } = useApp();

  const [cpfOuEmail, setCpfOuEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  if (!aberto) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpfOuEmail) return;

    setCarregando(true);
    setTimeout(() => {
      setCarregando(false);
      const res = realizarLoginEfapp({ cpfOuEmail, senha });
      if (res.sucesso) {
        onFechar();
        setCpfOuEmail('');
        setSenha('');
      }
    }, 400);
  };

  // Preenchimentos rápidos para facilitar testes do usuário/avaliador
  const preencherUsuarioTipo1 = () => {
    setCpfOuEmail('123.456.789-01');
    setSenha('123456');
  };

  const preencherUsuarioTipo2 = () => {
    setCpfOuEmail('234.567.890-12');
    setSenha('123456');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Topo Institucional */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base">Área de Acesso EFAPP</h3>
              <p className="text-[11px] text-slate-400">Escola de Formação de Agentes</p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faixa Informativa */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Ambiente Institucional Seguro
          </span>
          <span className="text-[11px] bg-white border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-emerald-800">
            Saúde & Educação
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Preenchimento Rápido para Avaliação */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Testar com Contas Existentes:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={preencherUsuarioTipo1}
                className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 border border-slate-300 hover:border-emerald-400 rounded-lg font-medium text-emerald-800 transition"
              >
                👤 Carlos (TIPO 1)
              </button>
              <button
                type="button"
                onClick={preencherUsuarioTipo2}
                className="text-xs px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-lg font-medium text-blue-800 transition"
              >
                👩‍⚕️ Dra. Beatriz (TIPO 2)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              CPF ou E-mail Cadastrado
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={cpfOuEmail}
                onChange={(e) => setCpfOuEmail(e.target.value)}
                placeholder="Digite seu CPF ou e-mail"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha cadastrada"
                className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {carregando ? (
                <span className="animate-pulse">Validando credenciais...</span>
              ) : (
                <>
                  <span>Entrar na Plataforma</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Ainda não possui cadastro?{' '}
              <button
                type="button"
                onClick={() => {
                  onFechar();
                  onAbrirCadastro();
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Cadastre-se aqui (Acesso TIPO 1)
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
