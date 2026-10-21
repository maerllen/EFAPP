/**
 * EFAPP - Escola de Formação de Agentes Públicos e Privados
 * Sistema Integrado de Cursos EAD/Presenciais, Loja Virtual e Gestão Financeira
 * Segmento: Saúde e Educação Pública e Privada
 * Todo o sistema em português conforme especificação oficial
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { CadastroModal } from './components/CadastroModal.tsx';
import { CarrinhoModal } from './components/CarrinhoModal.tsx';

// Visões do Sistema
import { CursosView } from './views/CursosView.tsx';
import { LojaView } from './views/LojaView.tsx';
import { GestaoUsuariosView } from './views/GestaoUsuariosView.tsx';
import { GestaoPedagogicaFinanceiraView } from './views/GestaoPedagogicaFinanceiraView.tsx';
import { PainelProfessorView } from './views/PainelProfessorView.tsx';
import { BancoDeDadosView } from './views/BancoDeDadosView.tsx';

import {
  GraduationCap,
  Shield,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Building,
  HeartHandshake
} from 'lucide-react';

const ConteudoPrincipal: React.FC = () => {
  const { notificacao, usuarioAtual } = useApp();

  const [abaAtiva, setAbaAtiva] = useState<
    'cursos' | 'loja' | 'usuarios' | 'pedagogico_financeiro' | 'professor' | 'banco_sql'
  >('cursos');

  const [modalLoginAberto, setModalLoginAberto] = useState(false);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Notificação Flutuante / Toast */}
      {notificacao && (
        <div className="fixed top-20 right-5 z-50 animate-fadeIn transition-all max-w-sm">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
              notificacao.tipo === 'sucesso'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : notificacao.tipo === 'erro'
                ? 'bg-rose-900 text-white border-rose-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {notificacao.tipo === 'sucesso' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {notificacao.tipo === 'erro' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {notificacao.tipo === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
            <span className="text-xs font-medium leading-relaxed">{notificacao.texto}</span>
          </div>
        </div>
      )}

      {/* Barra de Navegação Superior */}
      <Navbar
        abaAtiva={abaAtiva}
        onMudarAba={(novaAba) => setAbaAtiva(novaAba)}
        onAbrirLogin={() => setModalLoginAberto(true)}
        onAbrirCadastro={() => setModalCadastroAberto(true)}
        onAbrirCarrinho={() => setModalCarrinhoAberto(true)}
      />

      {/* Conteúdo da Visão Selecionada */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {abaAtiva === 'cursos' && <CursosView />}
        {abaAtiva === 'loja' && <LojaView onAbrirCarrinho={() => setModalCarrinhoAberto(true)} />}
        {abaAtiva === 'usuarios' && <GestaoUsuariosView />}
        {abaAtiva === 'pedagogico_financeiro' && <GestaoPedagogicaFinanceiraView />}
        {abaAtiva === 'professor' && <PainelProfessorView />}
        {abaAtiva === 'banco_sql' && <BancoDeDadosView />}
      </main>

      {/* Rodapé Institucional da EFAPP */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">
                  EFAPP - Escola de Formação de Agentes Públicos e Privados
                </h4>
                <p className="text-[11px] text-slate-500">
                  Capacitação Continuada, Certificação Digital e Pesquisa em Saúde e Educação
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                Segurança Anticópia e Rastreabilidade por CPF
              </span>
              <span className="flex items-center gap-1 text-blue-800 font-semibold">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                Ambiente Institucional EFAPP
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              © {new Date().getFullYear()} EFAPP. Todos os direitos reservados. Cursos respaldados pela Lei nº 9.394/96 e Decreto nº 5.154/04.
            </p>
            <p>
              Ambiente de Demonstração em Produção • Perfis TIPO1 a TIPO7 Habilitados
            </p>
          </div>
        </div>
      </footer>

      {/* Modais Globais */}
      <LoginModal
        aberto={modalLoginAberto}
        onFechar={() => setModalLoginAberto(false)}
        onAbrirCadastro={() => setModalCadastroAberto(true)}
      />

      <CadastroModal
        aberto={modalCadastroAberto}
        onFechar={() => setModalCadastroAberto(false)}
      />

      <CarrinhoModal
        aberto={modalCarrinhoAberto}
        onFechar={() => setModalCarrinhoAberto(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ConteudoPrincipal />
    </AppProvider>
  );
}
