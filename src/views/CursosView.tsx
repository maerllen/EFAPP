/**
 * EFAPP - Visão de Cursos (EAD e Presenciais)
 * Filtragem estrita conforme regras de perfis:
 * - TIPO 1: visualiza e acessa cursos do TIPO 1
 * - TIPO 2: visualiza e acessa cursos do TIPO 2
 * - TIPO 4 e TIPO 7: podem cadastrar novos cursos do TIPO 1 e TIPO 2
 * - TIPO 7: acesso irrestrito a todos os cursos
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Curso, TipoCurso, ModalidadeCurso, SegmentoAtuacao } from '../types/index.ts';
import { CursoViewerModal } from '../components/CursoViewerModal.tsx';
import {
  GraduationCap,
  PlayCircle,
  FileText,
  Clock,
  Building,
  Award,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Lock,
  Sparkles
} from 'lucide-react';

export const CursosView: React.FC = () => {
  const { cursos, usuarioAtual, cadastrarCurso, certificados } = useApp();

  const [busca, setBusca] = useState('');
  const [filtroSegmento, setFiltroSegmento] = useState<'TODOS' | 'SAUDE' | 'EDUCACAO'>('TODOS');
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [modalNovoCursoAberto, setModalNovoCursoAberto] = useState(false);

  // Estados para formulário de cadastro de curso pelo TIPO4 ou TIPO7
  const [novoNome, setNovoNome] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [novaModalidade, setNovaModalidade] = useState<ModalidadeCurso>('EAD');
  const [novoTipo, setNovoTipo] = useState<TipoCurso>('TIPO1');
  const [novoSegmento, setNovoSegmento] = useState<SegmentoAtuacao>('SAUDE');
  const [novaCarga, setNovaCarga] = useState(40);
  const [novoProfessor, setNovoProfessor] = useState('Prof. Dr. Ricardo Barros Albuquerque');
  const [novaInstituicao, setNovaInstituicao] = useState('Secretaria Municipal de Saúde (SMS - Polo Formador)');

  // Regras de Visualização de Cursos:
  // "o perfil de quem se cadastra na plataforma será TIPO1 e terá acesso aos cursos do TIPO1"
  // "Perfil TIPO1 poderá acessar todos os cursos do TIPO1"
  // "Perfil TIPO2 poderá acessar todos os cursos do TIPO2"
  // Perfis administrativos/docentes (3, 4, 5, 6, 7) visualizam conforme escopo de gestão; TIPO7 tem acesso total.
  const cursosFiltrados = cursos.filter((c) => {
    // 1. Filtro de Perfil
    if (usuarioAtual.codigoPerfil === 'TIPO1' && c.tipoCurso !== 'TIPO1') {
      return false;
    }
    if (usuarioAtual.codigoPerfil === 'TIPO2' && c.tipoCurso !== 'TIPO2') {
      return false;
    }
    // 2. Filtro de Busca
    const matchBusca =
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.descricao.toLowerCase().includes(busca.toLowerCase());
    // 3. Filtro de Segmento
    const matchSegmento = filtroSegmento === 'TODOS' || c.segmento === filtroSegmento;

    return matchBusca && matchSegmento;
  });

  // Permissão de cadastro de cursos: TIPO4 e TIPO7
  const podeCadastrarCurso = ['TIPO4', 'TIPO7'].includes(usuarioAtual.codigoPerfil);

  const handleSalvarCurso = (e: React.FormEvent) => {
    e.preventDefault();

    const novo: Curso = {
      id: Date.now(),
      nome: novoNome,
      descricao: novaDescricao,
      modalidade: novaModalidade,
      tipoCurso: novoTipo,
      segmento: novoSegmento,
      cargaHorariaHoras: Number(novaCarga) || 40,
      notaMinimaAprovacao: 7.0,
      prazoProvaMinutos: 60,
      professorResponsavel: novoProfessor,
      instituicaoSede: novaInstituicao,
      valorInscricao: 0.00,
      imagemUrl:
        novoSegmento === 'SAUDE'
          ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      modulos: [
        {
          id: Date.now() + 1,
          ordem: 1,
          titulo: 'Módulo 1: Fundamentação e Práticas Institucionais',
          descricao: 'Conteúdo programático principal.',
          videoaulas: [
            {
              id: Date.now() + 2,
              titulo: 'Aula Inaugural: Diretrizes e Protocolos de Excelência',
              duracaoMinutos: 25,
              urlVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
              resumo: 'Apresentação das competências e marcos regulatórios.'
            }
          ],
          materiaisEscritos: [
            {
              id: Date.now() + 3,
              titulo: 'Apostila Técnica Integrada EFAPP',
              tipo: 'APOSTILA',
              paginasEstimadas: 15,
              conteudoTexto: `MANUAL DE CAPACITAÇÃO PROFISSIONAL CONTINUADA

1. APRESENTAÇÃO
Este material foi preparado especificamente para capacitar agentes públicos e privados no segmento de ${novoSegmento}.

2. BOAS PRÁTICAS E ÉTICA NO ATENDIMENTO
A conduta dos profissionais deve pautar-se pela legalidade, impessoalidade, moralidade, publicidade e eficiência (Art. 37 da Constituição Federal).

3. DIRETRIZES TÉCNICAS E DE SEGURANÇA
Todos os protocolos aqui descritos seguem normas técnicas vigentes e possuem certificação de qualidade da EFAPP.`
            }
          ]
        }
      ],
      // Prova padrão obrigatória com 10 questões e 1 hora
      avaliacao: {
        id: Date.now() + 10,
        idCurso: Date.now(),
        titulo: `Avaliação Final Oficial - ${novoNome}`,
        instrucoes: 'Prova oficial com 10 questões de múltipla escolha. Duração máxima de 1 hora.',
        tempoLimiteMinutos: 60,
        notaCorte: 7.0,
        questoes: Array.from({ length: 10 }).map((_, i) => ({
          id: i + 1,
          numero: i + 1,
          enunciado: `Questão ${i + 1}: De acordo com as diretrizes da EFAPP e a legislação de ${novoSegmento}, qual a conduta recomendada para a garantia do interesse público e da qualidade do serviço?`,
          opcoes: [
            { id: (i + 1) * 10 + 1, letra: 'A', texto: 'Adoção rigorosa dos protocolos técnicos, respeito à dignidade humana e aperfeiçoamento contínuo.' },
            { id: (i + 1) * 10 + 2, letra: 'B', texto: 'Dispensa das regras formais em casos de conveniência individual sem registro.' },
            { id: (i + 1) * 10 + 3, letra: 'C', texto: 'Cobrança não autorizada de taxas extras de atendimento.' },
            { id: (i + 1) * 10 + 4, letra: 'D', texto: 'Descarte de prontuários e registros em locais públicos.' }
          ],
          opcaoCorretaId: (i + 1) * 10 + 1,
          justificativaPedagogica: 'A conduta ética e o cumprimento dos protocolos representam o alicerce da capacitação.'
        }))
      }
    };

    cadastrarCurso(novo);
    setModalNovoCursoAberto(false);
    setNovoNome('');
    setNovaDescricao('');
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior Institucional */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Formação de Excelência em Saúde & Educação</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Cursos de Capacitação Profissional da EFAPP
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 font-light leading-relaxed">
            Ambiente de ensino seguro com videoaulas, apostilas com proteção anticópia e marca d'água de CPF, avaliação oficial de 10 questões (prazo de 1h) e certificação imediata.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs font-semibold">
              Seu Perfil Atual: <strong>{usuarioAtual.codigoPerfil}</strong>
            </span>
            <span className="bg-emerald-500/30 px-3 py-1.5 rounded-xl font-semibold text-emerald-200">
              Liberado para: Cursos do <strong>{usuarioAtual.codigoPerfil === 'TIPO7' ? 'TIPO 1, 2 e 3' : usuarioAtual.codigoPerfil}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Campo de Busca */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por curso ou tema..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        {/* Filtros de Segmento */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFiltroSegmento('TODOS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
              filtroSegmento === 'TODOS'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos os Segmentos
          </button>
          <button
            onClick={() => setFiltroSegmento('SAUDE')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
              filtroSegmento === 'SAUDE'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            🏥 Saúde Pública/Privada
          </button>
          <button
            onClick={() => setFiltroSegmento('EDUCACAO')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition shrink-0 ${
              filtroSegmento === 'EDUCACAO'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            🎓 Educação Básica/Gestão
          </button>

          {/* Botão de Cadastrar Curso (TIPO4 e TIPO7) */}
          {podeCadastrarCurso && (
            <button
              onClick={() => setModalNovoCursoAberto(true)}
              className="ml-auto px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Curso (TIPO 1 ou 2)</span>
            </button>
          )}
        </div>
      </div>

      {/* Grade de Cursos Disponíveis */}
      {cursosFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Nenhum curso encontrado para este perfil</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            O seu perfil atual (<strong>{usuarioAtual.codigoPerfil}</strong>) tem acesso restrito aos cursos do seu respectivo nível. Utilize o <strong>Simulador de Perfis</strong> no topo da página para alternar para outros tipos de agentes caso deseje avaliar outros cursos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso) => {
            const concluido = certificados.some(
              (cert) => cert.idCurso === curso.id && cert.cpfAluno === usuarioAtual.cpf
            );

            return (
              <div
                key={curso.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Imagem do Curso com Badges */}
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={curso.imagemUrl}
                    alt={curso.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-slate-900/85 text-white backdrop-blur-xs">
                      {curso.tipoCurso}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-xs ${
                        curso.segmento === 'SAUDE'
                          ? 'bg-emerald-600/90 text-white'
                          : 'bg-blue-600/90 text-white'
                      }`}
                    >
                      {curso.segmento === 'SAUDE' ? 'Saúde' : 'Educação'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-white/90 text-slate-800 shadow-xs">
                      {curso.modalidade}
                    </span>
                  </div>

                  {concluido && (
                    <div className="absolute bottom-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Certificado Emitido</span>
                    </div>
                  )}
                </div>

                {/* Conteúdo do Card */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition line-clamp-2">
                      {curso.nome}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {curso.descricao}
                    </p>
                  </div>

                  {/* Informações Complementares */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Carga Horária: <strong>{curso.cargaHorariaHoras}h</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{curso.instituicaoSede}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>Prova: 10 questões (Máx. 1 hora)</span>
                    </div>
                  </div>

                  {/* Botão de Ação */}
                  <button
                    onClick={() => setCursoSelecionado(curso)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Acessar Sala de Aula Protegida</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro de Cursos (TIPO4 e TIPO7) */}
      {modalNovoCursoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="bg-purple-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-purple-200" />
                <h3 className="font-bold text-base">Cadastrar Novo Curso (TIPO 4 / TIPO 7)</h3>
              </div>
              <button
                onClick={() => setModalNovoCursoAberto(false)}
                className="text-purple-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSalvarCurso} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Nome do Curso
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Políticas Públicas de Saúde Básica"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-purple-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Descrição do Curso
                </label>
                <textarea
                  required
                  rows={2}
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  placeholder="Resumo pedagógico do curso..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Tipo do Curso
                  </label>
                  <select
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="TIPO1">TIPO 1 (Acesso Cidadão/Geral)</option>
                    <option value="TIPO2">TIPO 2 (Agente Especializado)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Modalidade
                  </label>
                  <select
                    value={novaModalidade}
                    onChange={(e) => setNovaModalidade(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="EAD">EAD (Distância)</option>
                    <option value="PRESENCIAL">Presencial</option>
                    <option value="HIBRIDO">Híbrido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Segmento
                  </label>
                  <select
                    value={novoSegmento}
                    onChange={(e) => setNovoSegmento(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="SAUDE">Saúde Pública/Privada</option>
                    <option value="EDUCACAO">Educação Básica</option>
                    <option value="GESTAO_PUBLICA">Gestão Pública</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">
                    Carga Horária (Horas)
                  </label>
                  <input
                    type="number"
                    value={novaCarga}
                    onChange={(e) => setNovaCarga(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
                <strong>Padrão Regulatório:</strong> A prova de 10 questões com prazo máximo de 1 hora e a proteção anticópia com marca d'água de CPF são geradas e configuradas automaticamente pela plataforma.
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-md transition"
              >
                Publicar Curso na EFAPP
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal da Sala de Aula Virtual com Proteção Anticópia */}
      <CursoViewerModal
        aberto={cursoSelecionado !== null}
        onFechar={() => setCursoSelecionado(null)}
        curso={cursoSelecionado}
      />
    </div>
  );
};
