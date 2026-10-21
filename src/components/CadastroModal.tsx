/**
 * EFAPP - Modal de Cadastro de Usuário
 * Para autocadastro público: cria usuário com perfil TIPO1 e acesso aos cursos TIPO1.
 * Para administradores logados:
 * - TIPO 3: pode cadastrar usuários do TIPO 2
 * - TIPO 4: pode cadastrar usuários do TIPO 2 e TIPO 3
 * - TIPO 7: pode cadastrar usuários de qualquer perfil
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { CodigoPerfil } from '../types/index.ts';
import { X, UserPlus, Shield, CheckCircle } from 'lucide-react';

interface CadastroModalProps {
  aberto: boolean;
  onFechar: () => void;
  perfilPredefinido?: CodigoPerfil;
}

export const CadastroModal: React.FC<CadastroModalProps> = ({
  aberto,
  onFechar,
  perfilPredefinido
}) => {
  const { usuarioAtual, cadastrarNovoUsuario } = useApp();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [orgao, setOrgao] = useState('');
  const [cargo, setCargo] = useState('');
  const [segmento, setSegmento] = useState<'SAUDE' | 'EDUCACAO' | 'AMBOS'>('SAUDE');
  const [perfilDestino, setPerfilDestino] = useState<CodigoPerfil>(perfilPredefinido || 'TIPO1');

  if (!aberto) return null;

  const formatarCpf = (valor: string) => {
    const limpo = valor.replace(/\D/g, '');
    return limpo
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Determina os perfis permitidos de acordo com quem está logado
  const obterPerfisDisponiveis = (): CodigoPerfil[] => {
    if (usuarioAtual.codigoPerfil === 'TIPO3') {
      return ['TIPO2'];
    }
    if (usuarioAtual.codigoPerfil === 'TIPO4') {
      return ['TIPO2', 'TIPO3'];
    }
    if (usuarioAtual.codigoPerfil === 'TIPO7') {
      return ['TIPO1', 'TIPO2', 'TIPO3', 'TIPO4', 'TIPO5', 'TIPO6', 'TIPO7'];
    }
    // Autocadastro de visitante ou usuário comum: estritamente TIPO1
    return ['TIPO1'];
  };

  const perfisDisponiveis = obterPerfisDisponiveis();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cpf.length < 14) return;

    const res = cadastrarNovoUsuario({
      nome,
      cpf,
      email,
      orgao: orgao || 'Serviço Público / Privado',
      cargo: cargo || 'Agente',
      segmento,
      codigoPerfilDestino: perfilDestino
    });

    if (res.sucesso) {
      onFechar();
      // Limpa os campos
      setNome('');
      setCpf('');
      setEmail('');
      setOrgao('');
      setCargo('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Topo do Modal */}
        <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserPlus className="w-6 h-6 text-emerald-200" />
            <div>
              <h3 className="font-bold text-base">Cadastro de Agente - EFAPP</h3>
              <p className="text-xs text-emerald-100">
                Escola de Formação de Agentes Públicos e Privados
              </p>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informação do perfil */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-900">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield className="w-4 h-4 text-emerald-700" />
            Proteção de Autoria e Certificação por CPF
          </span>
          <span className="bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded-full text-[11px]">
            {['TIPO3', 'TIPO4', 'TIPO7'].includes(usuarioAtual.codigoPerfil)
              ? `Operador: ${usuarioAtual.codigoPerfil}`
              : 'Novo Usuário: Acesso TIPO 1'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Seletor de Perfil (habilitado conforme permissão do usuário logado) */}
          {perfisDisponiveis.length > 1 ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Perfil de Acesso do Usuário Cadastrado
              </label>
              <select
                value={perfilDestino}
                onChange={(e) => setPerfilDestino(e.target.value as CodigoPerfil)}
                className="w-full px-3.5 py-2.5 text-sm font-semibold rounded-xl border border-emerald-300 bg-emerald-50/30 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {perfisDisponiveis.map((p) => (
                  <option key={p} value={p}>
                    {p} - {p === 'TIPO2' ? 'Agente Especializado (Cursos Tipo 2)' : p === 'TIPO3' ? 'Gestor Operacional' : `Perfil ${p}`}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {usuarioAtual.codigoPerfil === 'TIPO3' && 'O perfil TIPO 3 tem permissão exclusiva para cadastrar usuários do TIPO 2.'}
                {usuarioAtual.codigoPerfil === 'TIPO4' && 'O perfil TIPO 4 tem permissão para cadastrar usuários do TIPO 2 e TIPO 3.'}
                {usuarioAtual.codigoPerfil === 'TIPO7' && 'O perfil TIPO 7 possui permissão irrestrita de cadastro.'}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
              <strong className="text-slate-800">Regra de Acesso:</strong> Todo novo usuário cadastrado na plataforma ingressa no <strong>Perfil TIPO 1</strong> e tem acesso aos cursos e produtos do TIPO 1.
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ana Paula de Oliveira"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CPF (Obrigatório)
              </label>
              <input
                type="text"
                required
                maxLength={14}
                value={cpf}
                onChange={(e) => setCpf(formatarCpf(e.target.value))}
                placeholder="000.000.000-00"
                className="w-full px-3.5 py-2 text-sm font-mono rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                E-mail Institucional ou Pessoal
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@dominio.com.br"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Órgão / Instituição
              </label>
              <input
                type="text"
                value={orgao}
                onChange={(e) => setOrgao(e.target.value)}
                placeholder="Ex: Sec. de Saúde / Escola Estadual"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cargo / Função
              </label>
              <input
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex: Agente / Coordenador"
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Segmento de Atuação
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label
                className={`flex items-center justify-center p-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  segmento === 'SAUDE'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="segmento"
                  className="sr-only"
                  checked={segmento === 'SAUDE'}
                  onChange={() => setSegmento('SAUDE')}
                />
                Saúde Pública/Privada
              </label>
              <label
                className={`flex items-center justify-center p-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  segmento === 'EDUCACAO'
                    ? 'bg-blue-50 border-blue-600 text-blue-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="segmento"
                  className="sr-only"
                  checked={segmento === 'EDUCACAO'}
                  onChange={() => setSegmento('EDUCACAO')}
                />
                Educação Básica/Sup.
              </label>
              <label
                className={`flex items-center justify-center p-2 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  segmento === 'AMBOS'
                    ? 'bg-purple-50 border-purple-600 text-purple-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="segmento"
                  className="sr-only"
                  checked={segmento === 'AMBOS'}
                  onChange={() => setSegmento('AMBOS')}
                />
                Ambos / Gestão
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Concluir Cadastro</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
