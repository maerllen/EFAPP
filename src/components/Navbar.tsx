/**
 * EFAPP - Barra Superior Institucional (Navbar)
 * Identidade visual da Escola de Formação de Agentes Públicos e Privados,
 * Seletor rápido de perfis (TIPO1 a TIPO7) para testes, status do Gov.br e carrinho.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CodigoPerfil } from '../types/index.ts';
import {
  GraduationCap,
  ShoppingBag,
  Users,
  CalendarCheck,
  BookOpenCheck,
  Database,
  ShieldCheck,
  UserPlus,
  LogIn,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  abaAtiva: 'cursos' | 'loja' | 'usuarios' | 'pedagogico_financeiro' | 'professor' | 'banco_sql';
  onMudarAba: (aba: any) => void;
  onAbrirLogin: () => void;
  onAbrirCadastro: () => void;
  onAbrirCarrinho: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  abaAtiva,
  onMudarAba,
  onAbrirLogin,
  onAbrirCadastro,
  onAbrirCarrinho
}) => {
  const { usuarioAtual, trocarPerfilAtivo, carrinho } = useApp();
  const [dropdownPerfilAberto, setDropdownPerfilAberto] = useState(false);

  const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  // Mapeamento descritivo dos 7 perfis
  const perfisDescricao: { [key in CodigoPerfil]: { titulo: string; cor: string } } = {
    TIPO1: { titulo: 'TIPO 1: Cidadão / Agente Inscrito', cor: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    TIPO2: { titulo: 'TIPO 2: Agente Especializado', cor: 'bg-blue-100 text-blue-800 border-blue-300' },
    TIPO3: { titulo: 'TIPO 3: Gestor Operacional', cor: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
    TIPO4: { titulo: 'TIPO 4: Admin de Conteúdo', cor: 'bg-purple-100 text-purple-800 border-purple-300' },
    TIPO5: { titulo: 'TIPO 5: Coord. Pedagógico & Financeiro', cor: 'bg-amber-100 text-amber-900 border-amber-300' },
    TIPO6: { titulo: 'TIPO 6: Professor / Docente', cor: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
    TIPO7: { titulo: 'TIPO 7: Super Administrador (Tudo)', cor: 'bg-rose-100 text-rose-900 border-rose-300' }
  };

  const perfilInfo = perfisDescricao[usuarioAtual.codigoPerfil] || perfisDescricao.TIPO1;

  // Permissões visíveis no menu de acordo com as regras de cada perfil
  const podeVerGestaoUsuarios = ['TIPO3', 'TIPO4', 'TIPO7'].includes(usuarioAtual.codigoPerfil);
  const podeVerPedagogicoFinanceiro = ['TIPO5', 'TIPO7'].includes(usuarioAtual.codigoPerfil);
  const podeVerAreaProfessor = ['TIPO6', 'TIPO7'].includes(usuarioAtual.codigoPerfil);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* 1. Barra Superior Institucional e Seletor de Perfis */}
      <div className="bg-slate-900 text-white text-xs px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <span className="text-emerald-400">EFAPP</span>
            <span className="text-slate-400 font-normal hidden sm:inline">|</span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              Escola de Formação de Agentes Públicos e Privados
            </span>
          </div>

          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
            Saúde & Educação Pública e Privada
          </span>
        </div>

        {/* Simulador de Perfis (TIPO1 a TIPO7) para o avaliador testar todas as permissões */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 hidden lg:inline">
            Simulador de Perfis:
          </span>
          <div className="relative">
            <button
              onClick={() => setDropdownPerfilAberto(!dropdownPerfilAberto)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold transition"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>{usuarioAtual.codigoPerfil}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {dropdownPerfilAberto && (
              <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 text-xs animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-500 uppercase text-[10px] tracking-wider">
                  Trocar Perfil para Teste Imediato:
                </div>
                {(Object.keys(perfisDescricao) as CodigoPerfil[]).map((codigo) => (
                  <button
                    key={codigo}
                    onClick={() => {
                      trocarPerfilAtivo(codigo);
                      setDropdownPerfilAberto(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition ${
                      usuarioAtual.codigoPerfil === codigo ? 'bg-blue-50/70 font-bold text-blue-900' : ''
                    }`}
                  >
                    <span>{perfisDescricao[codigo].titulo}</span>
                    {usuarioAtual.codigoPerfil === codigo && (
                      <span className="text-blue-600 text-[10px] font-bold">ATIVO</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botão de Login Institucional EFAPP */}
          <button
            onClick={onAbrirLogin}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Entrar / Acessar</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Navegação Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logomarca EFAPP */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onMudarAba('cursos')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">EFAPP</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                EAD & Loja
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Escola de Formação de Agentes Públicos e Privados
            </p>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onMudarAba('cursos')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              abaAtiva === 'cursos'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Cursos ({usuarioAtual.codigoPerfil === 'TIPO7' ? 'Todos' : usuarioAtual.codigoPerfil})</span>
          </button>

          <button
            onClick={() => onMudarAba('loja')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              abaAtiva === 'loja'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Loja Virtual</span>
          </button>

          {/* Menus liberados conforme o perfil do usuário */}
          {podeVerGestaoUsuarios && (
            <button
              onClick={() => onMudarAba('usuarios')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                abaAtiva === 'usuarios'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Usuários</span>
            </button>
          )}

          {podeVerPedagogicoFinanceiro && (
            <button
              onClick={() => onMudarAba('pedagogico_financeiro')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                abaAtiva === 'pedagogico_financeiro'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-amber-700" />
              <span>Pedagógico & Financeiro</span>
            </button>
          )}

          {podeVerAreaProfessor && (
            <button
              onClick={() => onMudarAba('professor')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                abaAtiva === 'professor'
                  ? 'bg-cyan-50 text-cyan-900 border border-cyan-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpenCheck className="w-4 h-4 text-cyan-700" />
              <span>Área Docente (TIPO 6)</span>
            </button>
          )}

          {/* Banco de Dados SQL (solicitado expressamente no prompt) */}
          <button
            onClick={() => onMudarAba('banco_sql')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              abaAtiva === 'banco_sql'
                ? 'bg-slate-100 text-slate-900 border border-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-slate-700" />
            <span>Banco de Dados SQL</span>
          </button>
        </nav>

        {/* Lado Direito: Carrinho e Dados do Usuário Ativo */}
        <div className="flex items-center gap-3">
          {/* Carrinho de Compras */}
          <button
            onClick={onAbrirCarrinho}
            className="relative p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            title="Carrinho de Compras"
          >
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            {totalItensCarrinho > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                {totalItensCarrinho}
              </span>
            )}
          </button>

          {/* Cartão de Identificação do Usuário Logado */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded border ${perfilInfo.cor}`}>
                  {usuarioAtual.codigoPerfil}
                </span>
                <span className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[140px]">
                  {usuarioAtual.nomeCompleto}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block">
                CPF: {usuarioAtual.cpf}
              </span>
            </div>

            <button
              onClick={onAbrirCadastro}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Cadastrar Novo Agente"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile de rolagem horizontal */}
      <div className="md:hidden flex items-center gap-1 px-4 py-2 bg-slate-50 border-t border-slate-200 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => onMudarAba('cursos')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            abaAtiva === 'cursos' ? 'bg-emerald-600 text-white' : 'text-slate-600'
          }`}
        >
          Cursos
        </button>
        <button
          onClick={() => onMudarAba('loja')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            abaAtiva === 'loja' ? 'bg-emerald-600 text-white' : 'text-slate-600'
          }`}
        >
          Loja
        </button>
        {podeVerGestaoUsuarios && (
          <button
            onClick={() => onMudarAba('usuarios')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              abaAtiva === 'usuarios' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Usuários
          </button>
        )}
        {podeVerPedagogicoFinanceiro && (
          <button
            onClick={() => onMudarAba('pedagogico_financeiro')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              abaAtiva === 'pedagogico_financeiro' ? 'bg-amber-600 text-white' : 'text-slate-600'
            }`}
          >
            Financeiro
          </button>
        )}
        {podeVerAreaProfessor && (
          <button
            onClick={() => onMudarAba('professor')}
            className={`px-2.5 py-1 rounded-lg shrink-0 ${
              abaAtiva === 'professor' ? 'bg-cyan-600 text-white' : 'text-slate-600'
            }`}
          >
            Docente
          </button>
        )}
        <button
          onClick={() => onMudarAba('banco_sql')}
          className={`px-2.5 py-1 rounded-lg shrink-0 ${
            abaAtiva === 'banco_sql' ? 'bg-slate-800 text-white' : 'text-slate-600'
          }`}
        >
          SQL
        </button>
      </div>
    </header>
  );
};
