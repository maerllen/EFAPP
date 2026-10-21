/**
 * EFAPP - Módulo de Gestão de Usuários
 * Permissões estritas:
 * - Perfil TIPO3: pode cadastrar usuários do TIPO2
 * - Perfil TIPO4: pode cadastrar usuários do TIPO2 e TIPO3
 * - Perfil TIPO7: pode cadastrar e gerir usuários de todos os perfis (TIPO1 a TIPO7)
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CadastroModal } from '../components/CadastroModal.tsx';
import { CodigoPerfil } from '../types/index.ts';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Building,
  KeyRound,
  FileBadge
} from 'lucide-react';

export const GestaoUsuariosView: React.FC = () => {
  const { todosUsuarios, usuarioAtual } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroPerfil, setFiltroPerfil] = useState<string>('TODOS');
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [perfilPredefinido, setPerfilPredefinido] = useState<CodigoPerfil>('TIPO2');

  const podeCadastrar = ['TIPO3', 'TIPO4', 'TIPO7'].includes(usuarioAtual.codigoPerfil);

  const usuariosFiltrados = todosUsuarios.filter((u) => {
    const matchBusca =
      u.nomeCompleto.toLowerCase().includes(busca.toLowerCase()) ||
      u.cpf.includes(busca) ||
      u.email.toLowerCase().includes(busca.toLowerCase()) ||
      u.orgaoInstituicao.toLowerCase().includes(busca.toLowerCase());

    const matchPerfil = filtroPerfil === 'TODOS' || u.codigoPerfil === filtroPerfil;

    return matchBusca && matchPerfil;
  });

  const abrirModalCadastroComPerfil = (p: CodigoPerfil) => {
    setPerfilPredefinido(p);
    setModalCadastroAberto(true);
  };

  return (
    <div className="space-y-6">
      {/* Topo do Módulo */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-emerald-100 text-emerald-800">
              Operador Atual: {usuarioAtual.codigoPerfil}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Escola de Formação de Agentes Públicos e Privados
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Gestão Cadastral de Agentes e Perfis
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {usuarioAtual.codigoPerfil === 'TIPO3' && 'Você possui autorização para cadastrar novos usuários do TIPO 2.'}
            {usuarioAtual.codigoPerfil === 'TIPO4' && 'Você possui autorização para cadastrar novos usuários do TIPO 2 e TIPO 3.'}
            {usuarioAtual.codigoPerfil === 'TIPO7' && 'Acesso total: cadastro e gestão irrestrita de todos os perfis da EFAPP.'}
          </p>
        </div>

        {podeCadastrar && (
          <div className="flex flex-wrap gap-2">
            {usuarioAtual.codigoPerfil === 'TIPO3' && (
              <button
                onClick={() => abrirModalCadastroComPerfil('TIPO2')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar Usuário TIPO 2</span>
              </button>
            )}

            {usuarioAtual.codigoPerfil === 'TIPO4' && (
              <>
                <button
                  onClick={() => abrirModalCadastroComPerfil('TIPO2')}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Novo TIPO 2</span>
                </button>
                <button
                  onClick={() => abrirModalCadastroComPerfil('TIPO3')}
                  className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Novo TIPO 3</span>
                </button>
              </>
            )}

            {usuarioAtual.codigoPerfil === 'TIPO7' && (
              <button
                onClick={() => abrirModalCadastroComPerfil('TIPO2')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Cadastrar Usuário (Qualquer Perfil)</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabela de Usuários com Busca */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, CPF ou órgão..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-bold uppercase shrink-0">Filtrar:</span>
            {['TODOS', 'TIPO1', 'TIPO2', 'TIPO3', 'TIPO4', 'TIPO5', 'TIPO6', 'TIPO7'].map((p) => (
              <button
                key={p}
                onClick={() => setFiltroPerfil(p)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition shrink-0 ${
                  filtroPerfil === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Nome e CPF (Marca d'água)</th>
                <th className="px-6 py-3.5">Perfil de Acesso</th>
                <th className="px-6 py-3.5">Órgão / Cargo</th>
                <th className="px-6 py-3.5">Autenticação</th>
                <th className="px-6 py-3.5">Segmento</th>
                <th className="px-6 py-3.5">Data Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{u.nomeCompleto}</div>
                    <div className="font-mono text-emerald-800 text-[11px] font-semibold flex items-center gap-1 mt-0.5">
                      <KeyRound className="w-3 h-3 text-emerald-600" />
                      CPF: {u.cpf}
                    </div>
                    <div className="text-slate-400 text-[11px]">{u.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                        u.codigoPerfil === 'TIPO1'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : u.codigoPerfil === 'TIPO2'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : u.codigoPerfil === 'TIPO3'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                          : u.codigoPerfil === 'TIPO4'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : u.codigoPerfil === 'TIPO5'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : u.codigoPerfil === 'TIPO6'
                          ? 'bg-cyan-50 text-cyan-900 border-cyan-300'
                          : 'bg-rose-50 text-rose-900 border-rose-300'
                      }`}
                    >
                      {u.codigoPerfil}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{u.orgaoInstituicao}</div>
                    <div className="text-slate-500 text-[11px]">{u.cargoFuncao}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Conta Ativa EFAPP
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {u.segmento}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-500 font-mono text-[11px]">
                    {u.dataCadastro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro */}
      <CadastroModal
        aberto={modalCadastroAberto}
        onFechar={() => setModalCadastroAberto(false)}
        perfilPredefinido={perfilPredefinido}
      />
    </div>
  );
};
