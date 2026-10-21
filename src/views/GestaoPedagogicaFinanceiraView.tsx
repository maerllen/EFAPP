/**
 * EFAPP - Módulo de Gestão Pedagógica e Financeira (TIPO 5 e TIPO 7)
 * Atribuições do TIPO 5:
 * 1. Criar cronogramas e calendários de cursos
 * 2. Cadastrar instituições parceiras (saúde e educação pública e privada)
 * 3. Cadastrar professores e criar escala de atuação nas aulas
 * 4. Gerar relatórios de pagamentos aos professores (horas x valor hora-aula)
 * 5. Lançar despesas fixas e variáveis
 * 6. Gerir o financeiro da loja online e consolidar o fluxo de caixa
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Instituicao,
  Professor,
  CronogramaCurso,
  EscalaProfessor,
  LancamentoFinanceiro
} from '../types/index.ts';
import {
  Calendar,
  Building2,
  UserCheck,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  Wallet,
  Receipt,
  Layers
} from 'lucide-react';

export const GestaoPedagogicaFinanceiraView: React.FC = () => {
  const {
    usuarioAtual,
    instituicoes,
    cadastrarInstituicao,
    professores,
    cadastrarProfessor,
    cronogramas,
    cadastrarCronograma,
    escalas,
    cadastrarEscala,
    atualizarStatusEscala,
    lancamentos,
    lancarTransacaoFinanceira,
    obterRelatorioPagamentoProfessores,
    cursos
  } = useApp();

  const [subAba, setSubAba] = useState<
    'cronogramas' | 'instituicoes' | 'professores' | 'pagamentos' | 'despesas' | 'balanco'
  >('balanco');

  // Modais de cadastro
  const [modalNovoCronograma, setModalNovoCronograma] = useState(false);
  const [modalNovaInstituicao, setModalNovaInstituicao] = useState(false);
  const [modalNovoProfessor, setModalNovoProfessor] = useState(false);
  const [modalNovaEscala, setModalNovaEscala] = useState(false);
  const [modalNovaDespesa, setModalNovaDespesa] = useState(false);

  // Estados - Nova Instituição
  const [instNome, setInstNome] = useState('');
  const [instCnpj, setInstCnpj] = useState('');
  const [instEsfera, setInstEsfera] = useState<'PUBLICA_MUNICIPAL' | 'PUBLICA_ESTADUAL' | 'PUBLICA_FEDERAL' | 'PRIVADA'>('PUBLICA_MUNICIPAL');
  const [instArea, setInstArea] = useState<'SAUDE' | 'EDUCACAO' | 'MISTA'>('SAUDE');
  const [instCidade, setInstCidade] = useState('');
  const [instEstado, setInstEstado] = useState('SP');
  const [instResponsavel, setInstResponsavel] = useState('');
  const [instTelefone, setInstTelefone] = useState('');
  const [instEmail, setInstEmail] = useState('');

  // Estados - Novo Professor
  const [profNome, setProfNome] = useState('');
  const [profCpf, setProfCpf] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profTitulacao, setProfTitulacao] = useState<'ESPECIALISTA' | 'MESTRE' | 'DOUTOR' | 'POS_DOUTOR'>('MESTRE');
  const [profArea, setProfArea] = useState('');
  const [profValorHora, setProfValorHora] = useState(140.00);
  const [profPix, setProfPix] = useState('');

  // Estados - Novo Cronograma
  const [cronoCursoId, setCronoCursoId] = useState(cursos[0]?.id || 1);
  const [cronoInstId, setCronoInstId] = useState(instituicoes[0]?.id || 1);
  const [cronoProfId, setCronoProfId] = useState(professores[0]?.id || 1);
  const [cronoDataInicio, setCronoDataInicio] = useState('2026-11-01');
  const [cronoDataFim, setCronoDataFim] = useState('2026-12-15');
  const [cronoHoraInicio, setCronoHoraInicio] = useState('19:00');
  const [cronoHoraFim, setCronoHoraFim] = useState('22:00');
  const [cronoDias, setCronoDias] = useState('Terças e Quintas-feiras');
  const [cronoSala, setCronoSala] = useState('Sala Virtual EAD 02');

  // Estados - Nova Escala de Aula
  const [escalaProfId, setEscalaProfId] = useState(professores[0]?.id || 1);
  const [escalaCursoId, setEscalaCursoId] = useState(cursos[0]?.id || 1);
  const [escalaInstId, setEscalaInstId] = useState(instituicoes[0]?.id || 1);
  const [escalaData, setEscalaData] = useState('2026-10-28');
  const [escalaHoraInicio, setEscalaHoraInicio] = useState('19:00');
  const [escalaHoraFim, setEscalaHoraFim] = useState('22:00');
  const [escalaTotalHoras, setEscalaTotalHoras] = useState(3.0);
  const [escalaTema, setEscalaTema] = useState('Gestão de Prontuários e Sigilo Profissional');

  // Estados - Nova Despesa
  const [despTipo, setDespTipo] = useState<'FIXA' | 'VARIAVEL'>('FIXA');
  const [despSubcat, setDespSubcat] = useState('SERVIDORES_TI');
  const [despDescricao, setDespDescricao] = useState('');
  const [despValor, setDespValor] = useState(1500.00);
  const [despData, setDespData] = useState(new Date().toISOString().split('T')[0]);

  // Cálculos Consolidados de Balanço Financeiro
  const totalReceitasLoja = lancamentos
    .filter((l) => l.tipoOperacao === 'RECEITA' && l.subcategoria === 'VENDA_LOJA')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalReceitasCursos = lancamentos
    .filter((l) => l.tipoOperacao === 'RECEITA' && l.subcategoria !== 'VENDA_LOJA')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalReceitas = totalReceitasLoja + totalReceitasCursos;

  const totalDespesasFixas = lancamentos
    .filter((l) => l.tipoOperacao === 'DESPESA' && l.categoriaDespesa === 'FIXA')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalDespesasVariaveis = lancamentos
    .filter((l) => l.tipoOperacao === 'DESPESA' && l.categoriaDespesa === 'VARIAVEL')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalDespesas = totalDespesasFixas + totalDespesasVariaveis;
  const saldoLiquido = totalReceitas - totalDespesas;

  const relatorioProfessores = obterRelatorioPagamentoProfessores();

  // Handlers de Salvar
  const handleSalvarInstituicao = (e: React.FormEvent) => {
    e.preventDefault();
    cadastrarInstituicao({
      id: Date.now(),
      nome: instNome,
      cnpj: instCnpj,
      esfera: instEsfera,
      areaFoco: instArea,
      cidade: instCidade,
      estado: instEstado,
      responsavel: instResponsavel,
      telefone: instTelefone,
      email: instEmail
    });
    setModalNovaInstituicao(false);
    setInstNome('');
    setInstCnpj('');
  };

  const handleSalvarProfessor = (e: React.FormEvent) => {
    e.preventDefault();
    cadastrarProfessor({
      id: Date.now(),
      nome: profNome,
      cpf: profCpf,
      email: profEmail,
      titulacao: profTitulacao,
      areaAtuacao: profArea,
      valorHoraAula: Number(profValorHora),
      chavePix: profPix || profEmail
    });
    setModalNovoProfessor(false);
    setProfNome('');
    setProfCpf('');
  };

  const handleSalvarCronograma = (e: React.FormEvent) => {
    e.preventDefault();
    const curso = cursos.find((c) => c.id === Number(cronoCursoId));
    const inst = instituicoes.find((i) => i.id === Number(cronoInstId));
    const prof = professores.find((p) => p.id === Number(cronoProfId));

    cadastrarCronograma({
      id: Date.now(),
      idCurso: Number(cronoCursoId),
      nomeCurso: curso?.nome || 'Curso EFAPP',
      idInstituicao: Number(cronoInstId),
      nomeInstituicao: inst?.nome || 'Instituição',
      idProfessor: Number(cronoProfId),
      nomeProfessor: prof?.nome || 'Docente',
      dataInicio: cronoDataInicio,
      dataTermino: cronoDataFim,
      horarioInicio: cronoHoraInicio,
      horarioTermino: cronoHoraFim,
      diasSemana: cronoDias,
      salaLocal: cronoSala,
      vagasTotais: 60,
      vagasOcupadas: 0,
      status: 'ABERTA'
    });
    setModalNovoCronograma(false);
  };

  const handleSalvarEscala = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = professores.find((p) => p.id === Number(escalaProfId));
    const curso = cursos.find((c) => c.id === Number(escalaCursoId));
    const inst = instituicoes.find((i) => i.id === Number(escalaInstId));

    cadastrarEscala({
      id: Date.now(),
      idProfessor: Number(escalaProfId),
      nomeProfessor: prof?.nome || 'Docente',
      idCurso: Number(escalaCursoId),
      nomeCurso: curso?.nome || 'Curso',
      idInstituicao: Number(escalaInstId),
      nomeInstituicao: inst?.nome || 'Instituição',
      dataAula: escalaData,
      horaInicio: escalaHoraInicio,
      horaFim: escalaHoraFim,
      totalHoras: Number(escalaTotalHoras),
      temaAula: escalaTema,
      status: 'AGENDADA'
    });
    setModalNovaEscala(false);
  };

  const handleSalvarDespesa = (e: React.FormEvent) => {
    e.preventDefault();
    lancarTransacaoFinanceira({
      id: Date.now(),
      tipoOperacao: 'DESPESA',
      categoriaDespesa: despTipo,
      subcategoria: despSubcat,
      descricao: despDescricao,
      valor: Number(despValor),
      dataCompetencia: despData,
      dataPagamento: despData,
      status: 'PAGO'
    });
    setModalNovaDespesa(false);
    setDespDescricao('');
  };

  return (
    <div className="space-y-6">
      {/* Banner Principal do Módulo do TIPO 5 */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold mb-2">
            <DollarSign className="w-3.5 h-3.5 text-amber-300" />
            <span>Módulo Exclusivo Perfil TIPO 5 & TIPO 7</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestão Pedagógica, Calendários & Controle Financeiro
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl font-light mt-1">
            Gestão completa de cronogramas de cursos, instituições conveniadas, escalas e pagamentos de professores, controle de despesas fixas/variáveis e receitas da loja online.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <span className="text-[11px] uppercase tracking-wider text-amber-200 font-bold block">
            Saldo Líquido em Caixa
          </span>
          <span className="text-2xl font-black font-mono text-emerald-300">
            R$ {saldoLiquido.toFixed(2)}
          </span>
          <span className="text-[10px] text-amber-100 block mt-0.5">
            EFAPP Controladoria
          </span>
        </div>
      </div>

      {/* Sub-Abas do Módulo */}
      <div className="flex items-center gap-1.5 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
        <button
          onClick={() => setSubAba('balanco')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-2 ${
            subAba === 'balanco'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Balanço e Caixa</span>
        </button>

        <button
          onClick={() => setSubAba('cronogramas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-2 ${
            subAba === 'cronogramas'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Cronogramas & Calendários</span>
        </button>

        <button
          onClick={() => setSubAba('instituicoes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-2 ${
            subAba === 'instituicoes'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Instituições ({instituicoes.length})</span>
        </button>

        <button
          onClick={() => setSubAba('professores')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-2 ${
            subAba === 'professores'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Docentes & Escala ({professores.length})</span>
        </button>

        <button
          onClick={() => setSubAba('pagamentos')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-2 ${
            subAba === 'pagamentos'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Relatório Pagto Professores</span>
        </button>

        <button
          onClick={() => setSubAba('despesas')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition shrink-0 flex items-center gap-2 ${
            subAba === 'despesas'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Despesas Fixas e Variáveis</span>
        </button>
      </div>

      {/* ABA 1: BALANÇO FINANCEIRO CONSOLIDADO */}
      {subAba === 'balanco' && (
        <div className="space-y-6">
          {/* Cartões Estatísticos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-xs font-bold uppercase text-slate-500">Receita da Loja</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono mt-2">
                R$ {totalReceitasLoja.toFixed(2)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Vendas de livros, kits e softwares</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-blue-600">
                <span className="text-xs font-bold uppercase text-slate-500">Receita Inscrições</span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-slate-900 font-mono mt-2">
                R$ {totalReceitasCursos.toFixed(2)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Cursos especializados e convênios</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-rose-600">
                <span className="text-xs font-bold uppercase text-slate-500">Despesas Totais</span>
                <TrendingDown className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-rose-600 font-mono mt-2">
                R$ {totalDespesas.toFixed(2)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Fixas: R$ {totalDespesasFixas.toFixed(2)} | Var: R$ {totalDespesasVariaveis.toFixed(2)}
              </span>
            </div>

            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 shadow-xs">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold uppercase">Resultado Líquido</span>
                <Wallet className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-emerald-800 font-mono mt-2">
                R$ {saldoLiquido.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Margem operacional positiva</span>
            </div>
          </div>

          {/* Extrato Recente de Lançamentos */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Extrato Geral de Lançamentos</h3>
                <p className="text-xs text-slate-500">Fluxo unificado de receitas da loja e despesas da EFAPP</p>
              </div>
              <button
                onClick={() => setModalNovaDespesa(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Lançar Despesa</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Tipo</th>
                    <th className="px-6 py-3">Subcategoria</th>
                    <th className="px-6 py-3">Descrição do Lançamento</th>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-6 py-3">Valor</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lancamentos.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-extrabold text-[10px] uppercase ${
                            l.tipoOperacao === 'RECEITA'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {l.tipoOperacao}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-slate-700">
                        {l.subcategoria}
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 max-w-md">
                        {l.descricao}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500">
                        {l.dataCompetencia}
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold">
                        <span
                          className={
                            l.tipoOperacao === 'RECEITA'
                              ? 'text-emerald-700'
                              : 'text-rose-700'
                          }
                        >
                          {l.tipoOperacao === 'RECEITA' ? '+' : '-'} R$ {l.valor.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: CRONOGRAMAS E CALENDÁRIOS DE CURSOS */}
      {subAba === 'cronogramas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Calendário e Turmas Abertas</h3>
            <button
              onClick={() => setModalNovoCronograma(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Criar Cronograma de Curso</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cronogramas.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    {c.status}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    {c.vagasOcupadas}/{c.vagasTotais} Vagas
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                  {c.nomeCurso}
                </h4>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <p><strong>Polo / Sede:</strong> {c.nomeInstituicao}</p>
                  <p><strong>Docente:</strong> {c.nomeProfessor}</p>
                  <p><strong>Período:</strong> {c.dataInicio} até {c.dataTermino}</p>
                  <p><strong>Horário:</strong> {c.horarioInicio} às {c.horarioTermino} ({c.diasSemana})</p>
                  <p><strong>Local:</strong> {c.salaLocal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 3: INSTITUIÇÕES PARCEIRAS */}
      {subAba === 'instituicoes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Instituições Parceiras Conveniadas</h3>
              <p className="text-xs text-slate-500">Redes de Saúde e Educação pública (municipal, estadual, federal) e privada</p>
            </div>
            <button
              onClick={() => setModalNovaInstituicao(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Instituição</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instituicoes.map((inst) => (
              <div key={inst.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                    {inst.esfera.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                    Foco: {inst.areaFoco}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-base">{inst.nome}</h4>

                <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                  <p><strong>CNPJ:</strong> <span className="font-mono">{inst.cnpj}</span></p>
                  <p><strong>Localização:</strong> {inst.cidade} - {inst.estado}</p>
                  <p><strong>Responsável:</strong> {inst.responsavel}</p>
                  <p><strong>Contato:</strong> {inst.telefone} | {inst.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA 4: PROFESSORES E ESCALA DE AULAS */}
      {subAba === 'professores' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Corpo Docente e Escala de Aulas</h3>
              <p className="text-xs text-slate-500">Alocação de professores e acompanhamento de ministração</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModalNovoProfessor(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Novo Docente</span>
              </button>
              <button
                onClick={() => setModalNovaEscala(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Agendar Escala</span>
              </button>
            </div>
          </div>

          {/* Grade de Escala de Aulas */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider">
              Escala de Professores para as Próximas Aulas
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Docente</th>
                    <th className="px-6 py-3">Curso / Tema</th>
                    <th className="px-6 py-3">Data e Horário</th>
                    <th className="px-6 py-3">Carga Horária</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {escalas.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5 font-bold text-slate-900">
                        {e.nomeProfessor}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="font-semibold text-slate-800">{e.nomeCurso}</div>
                        <div className="text-slate-500 text-[11px]">{e.temaAula}</div>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-600">
                        {e.dataAula} ({e.horaInicio} às {e.horaFim})
                      </td>
                      <td className="px-6 py-3.5 font-mono font-bold text-slate-800">
                        {e.totalHoras} horas
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            e.status === 'MINISTRADA'
                              ? 'bg-emerald-100 text-emerald-800'
                              : e.status === 'CANCELADA'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        {e.status === 'AGENDADA' && (
                          <button
                            onClick={() => atualizarStatusEscala(e.id, 'MINISTRADA')}
                            className="text-[11px] px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                          >
                            Confirmar Aula
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 5: RELATÓRIO DE PAGAMENTO A PROFESSORES */}
      {subAba === 'pagamentos' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Relatório Consolidado de Pagamento a Professores</h3>
            <p className="text-xs text-slate-500">
              Cálculo automatizado com base no número de horas de aulas efetivamente ministradas na escala multiplicado pelo valor contratado por hora-aula.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5">Professor(a)</th>
                    <th className="px-6 py-3.5">Titulação</th>
                    <th className="px-6 py-3.5">Horas Ministradas</th>
                    <th className="px-6 py-3.5">Valor Hora</th>
                    <th className="px-6 py-3.5">Total Bruto</th>
                    <th className="px-6 py-3.5">Retenção INSS (11%)</th>
                    <th className="px-6 py-3.5">Valor Líquido</th>
                    <th className="px-6 py-3.5">Chave PIX Cadastrada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {relatorioProfessores.map((r) => (
                    <tr key={r.idProfessor} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                        {r.nomeProfessor}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {r.titulacao}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-800">
                        {r.horasMinistradas}h
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        R$ {r.valorHora.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-slate-800">
                        R$ {r.totalBruto.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono text-rose-600">
                        - R$ {r.descontos.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono font-extrabold text-emerald-700 text-sm">
                        R$ {r.totalLiquido.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                        {r.chavePix}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 6: DESPESAS FIXAS E VARIÁVEIS */}
      {subAba === 'despesas' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Lançamento de Despesas Fixas e Variáveis</h3>
              <p className="text-xs text-slate-500">Custos operacionais de servidores, aluguel, gráficas e honorários</p>
            </div>
            <button
              onClick={() => setModalNovaDespesa(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lançar Nova Despesa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-rose-800 font-bold text-sm">
                <span>Despesas Fixas Mensais</span>
                <span className="font-mono">R$ {totalDespesasFixas.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500">
                Aluguel do polo de cursos presenciais, servidores de nuvem de alta segurança e infraestrutura de TI.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-amber-800 font-bold text-sm">
                <span>Despesas Variáveis</span>
                <span className="font-mono">R$ {totalDespesasVariaveis.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500">
                Impressão de apostilas gráficas da loja, materiais descartáveis para saúde e diárias de deslocamento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOVA INSTITUIÇÃO */}
      {modalNovaInstituicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Cadastrar Nova Instituição Conveniada</h3>
              <button onClick={() => setModalNovaInstituicao(false)}>✕</button>
            </div>
            <form onSubmit={handleSalvarInstituicao} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Nome da Instituição</label>
                <input
                  type="text"
                  required
                  value={instNome}
                  onChange={(e) => setInstNome(e.target.value)}
                  placeholder="Ex: Hospital Regional do Vale"
                  className="w-full p-2 rounded-xl border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">CNPJ</label>
                  <input
                    type="text"
                    required
                    value={instCnpj}
                    onChange={(e) => setInstCnpj(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full p-2 rounded-xl border font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Esfera</label>
                  <select
                    value={instEsfera}
                    onChange={(e) => setInstEsfera(e.target.value as any)}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    <option value="PUBLICA_MUNICIPAL">Pública Municipal</option>
                    <option value="PUBLICA_ESTADUAL">Pública Estadual</option>
                    <option value="PUBLICA_FEDERAL">Pública Federal</option>
                    <option value="PRIVADA">Privada Conveniada</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Área Foco</label>
                  <select
                    value={instArea}
                    onChange={(e) => setInstArea(e.target.value as any)}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    <option value="SAUDE">Saúde</option>
                    <option value="EDUCACAO">Educação</option>
                    <option value="MISTA">Mista</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Cidade / UF</label>
                  <input
                    type="text"
                    required
                    value={instCidade}
                    onChange={(e) => setInstCidade(e.target.value)}
                    placeholder="Cidade"
                    className="w-full p-2 rounded-xl border"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Responsável / E-mail</label>
                <input
                  type="text"
                  required
                  value={instResponsavel}
                  onChange={(e) => setInstResponsavel(e.target.value)}
                  placeholder="Nome do diretor / contato"
                  className="w-full p-2 rounded-xl border mb-2"
                />
                <input
                  type="email"
                  required
                  value={instEmail}
                  onChange={(e) => setInstEmail(e.target.value)}
                  placeholder="contato@instituicao.gov.br"
                  className="w-full p-2 rounded-xl border"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl mt-2"
              >
                Cadastrar Instituição
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO PROFESSOR */}
      {modalNovoProfessor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Cadastrar Novo Docente no Quadro</h3>
              <button onClick={() => setModalNovoProfessor(false)}>✕</button>
            </div>
            <form onSubmit={handleSalvarProfessor} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={profNome}
                  onChange={(e) => setProfNome(e.target.value)}
                  placeholder="Ex: Profa. Dra. Camila Rezende"
                  className="w-full p-2 rounded-xl border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">CPF</label>
                  <input
                    type="text"
                    required
                    value={profCpf}
                    onChange={(e) => setProfCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full p-2 rounded-xl border font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Titulação</label>
                  <select
                    value={profTitulacao}
                    onChange={(e) => setProfTitulacao(e.target.value as any)}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    <option value="ESPECIALISTA">Especialista</option>
                    <option value="MESTRE">Mestre</option>
                    <option value="DOUTOR">Doutor</option>
                    <option value="POS_DOUTOR">Pós-Doutor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Valor Hora-Aula (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={profValorHora}
                    onChange={(e) => setProfValorHora(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Chave PIX</label>
                  <input
                    type="text"
                    required
                    value={profPix}
                    onChange={(e) => setProfPix(e.target.value)}
                    placeholder="pix@dominio.com"
                    className="w-full p-2 rounded-xl border font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl mt-2"
              >
                Registrar no Quadro Docente
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVA ESCALA DE AULA */}
      {modalNovaEscala && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Escalar Professor para Aula</h3>
              <button onClick={() => setModalNovaEscala(false)}>✕</button>
            </div>
            <form onSubmit={handleSalvarEscala} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Professor Responsável</label>
                <select
                  value={escalaProfId}
                  onChange={(e) => setEscalaProfId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-white font-bold"
                >
                  {professores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.titulacao}) - R$ {p.valorHoraAula}/h
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Curso Ministrado</label>
                <select
                  value={escalaCursoId}
                  onChange={(e) => setEscalaCursoId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-white font-bold"
                >
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.tipoCurso})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Data da Aula</label>
                  <input
                    type="date"
                    required
                    value={escalaData}
                    onChange={(e) => setEscalaData(e.target.value)}
                    className="w-full p-2 rounded-xl border font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Duração (Horas)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={escalaTotalHoras}
                    onChange={(e) => setEscalaTotalHoras(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Tema da Aula</label>
                <input
                  type="text"
                  required
                  value={escalaTema}
                  onChange={(e) => setEscalaTema(e.target.value)}
                  placeholder="Ex: Auditoria e Controle Social no SUS"
                  className="w-full p-2 rounded-xl border"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl mt-2"
              >
                Salvar Escala
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVA DESPESA */}
      {modalNovaDespesa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-rose-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Lançar Despesa Operacional</h3>
              <button onClick={() => setModalNovaDespesa(false)}>✕</button>
            </div>
            <form onSubmit={handleSalvarDespesa} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Natureza da Despesa</label>
                  <select
                    value={despTipo}
                    onChange={(e) => setDespTipo(e.target.value as any)}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    <option value="FIXA">Despesa Fixa (Recorrente)</option>
                    <option value="VARIAVEL">Despesa Variável</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Subcategoria</label>
                  <select
                    value={despSubcat}
                    onChange={(e) => setDespSubcat(e.target.value)}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    <option value="SERVIDORES_TI">Servidores de TI e Nuvem</option>
                    <option value="ALUGUEL_POLO">Aluguel do Polo Presencial</option>
                    <option value="IMPRESSAO_GRAFICA">Impressão de Apostilas</option>
                    <option value="HONORARIOS_DOCENTES">Honorários Docentes</option>
                    <option value="MANUTENCAO">Manutenção Geral</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={despDescricao}
                  onChange={(e) => setDespDescricao(e.target.value)}
                  placeholder="Ex: Licença anual do streaming seguro de vídeo"
                  className="w-full p-2 rounded-xl border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={despValor}
                    onChange={(e) => setDespValor(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={despData}
                    onChange={(e) => setDespData(e.target.value)}
                    className="w-full p-2 rounded-xl border font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl mt-2"
              >
                Confirmar Lançamento Financeiro
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOVO CRONOGRAMA */}
      {modalNovoCronograma && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-amber-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Criar Cronograma / Turma de Curso</h3>
              <button onClick={() => setModalNovoCronograma(false)}>✕</button>
            </div>
            <form onSubmit={handleSalvarCronograma} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Curso</label>
                <select
                  value={cronoCursoId}
                  onChange={(e) => setCronoCursoId(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border bg-white font-bold"
                >
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome} ({c.modalidade})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Instituição Sede</label>
                  <select
                    value={cronoInstId}
                    onChange={(e) => setCronoInstId(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    {instituicoes.map((i) => (
                      <option key={i.id} value={i.id}>{i.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Professor Responsável</label>
                  <select
                    value={cronoProfId}
                    onChange={(e) => setCronoProfId(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    {professores.map((p) => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Data de Início</label>
                  <input
                    type="date"
                    required
                    value={cronoDataInicio}
                    onChange={(e) => setCronoDataInicio(e.target.value)}
                    className="w-full p-2 rounded-xl border font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase block mb-1">Data de Término</label>
                  <input
                    type="date"
                    required
                    value={cronoDataFim}
                    onChange={(e) => setCronoDataFim(e.target.value)}
                    className="w-full p-2 rounded-xl border font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 uppercase block mb-1">Sala / Ambiente</label>
                <input
                  type="text"
                  required
                  value={cronoSala}
                  onChange={(e) => setCronoSala(e.target.value)}
                  placeholder="Ex: Sala Presencial Polo Central ou Sala EAD"
                  className="w-full p-2 rounded-xl border"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl mt-2"
              >
                Publicar no Calendário
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
