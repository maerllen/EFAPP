/**
 * EFAPP - Área do Docente / Professor (Perfil TIPO 6 e TIPO 7)
 * Atribuições obrigatórias da especificação:
 * - Perfil TIPO6 cria o curso
 * - Sobe os vídeos
 * - Sobe o material impresso (apostilas, artigos)
 * - Cria a prova a ser feita com 10 questões de múltipla escolha
 * - Todos os cursos têm como padrão uma prova com prazo máximo de 1 hora
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Curso,
  ModalidadeCurso,
  TipoCurso,
  SegmentoAtuacao,
  QuestaoAvaliacao
} from '../types/index.ts';
import {
  BookOpenCheck,
  Video,
  FileText,
  Award,
  PlusCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
  Trash2
} from 'lucide-react';

export const PainelProfessorView: React.FC = () => {
  const { usuarioAtual, cadastrarCurso, cursos } = useApp();

  // Etapas do Wizard do Professor: 1. Dados Gerais, 2. Vídeos, 3. Apostilas, 4. Prova de 10 Questões
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);

  // 1. Dados do Curso
  const [nomeCurso, setNomeCurso] = useState('');
  const [descricaoCurso, setDescricaoCurso] = useState('');
  const [modalidade, setModalidade] = useState<ModalidadeCurso>('EAD');
  const [tipoCurso, setTipoCurso] = useState<TipoCurso>('TIPO1');
  const [segmento, setSegmento] = useState<SegmentoAtuacao>('SAUDE');
  const [cargaHoraria, setCargaHoraria] = useState(40);

  // 2. Videoaulas
  const [videoaulas, setVideoaulas] = useState<
    { id: number; titulo: string; duracaoMinutos: number; urlVideo: string; resumo: string }[]
  >([
    {
      id: 1,
      titulo: 'Aula 1: Introdução aos Protocolos de Atendimento e Humanização',
      duracaoMinutos: 30,
      urlVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
      resumo: 'Conceitos fundamentais da atuação profissional continuada.'
    }
  ]);
  const [novoVideoTitulo, setNovoVideoTitulo] = useState('');
  const [novoVideoDuracao, setNovoVideoDuracao] = useState(25);
  const [novoVideoUrl, setNovoVideoUrl] = useState('https://www.w3schools.com/html/mov_bbb.mp4');
  const [novoVideoResumo, setNovoVideoResumo] = useState('');

  // 3. Materiais Impressos e Apostilas
  const [materiais, setMateriais] = useState<
    { id: number; titulo: string; tipo: 'APOSTILA' | 'ARTIGO' | 'LEGISLACAO'; conteudoTexto: string; paginasEstimadas: number }[]
  >([
    {
      id: 1,
      titulo: 'Apostila Didática do Módulo Integrado EFAPP',
      tipo: 'APOSTILA',
      paginasEstimadas: 24,
      conteudoTexto: `CAPÍTULO I - DIRETRIZES DA FORMAÇÃO DE AGENTES

1.1 INTRODUÇÃO
A atuação dos agentes nos serviços de saúde e educação deve observar a ética, o sigilo das informações e a eficiência no serviço público e privado.

1.2 NORMAS E CONDUTA
- Aplicação das rotinas e protocolos da unidade.
- Proteção da dignidade humana dos assistidos.
- Atualização e aperfeiçoamento contínuo.`
    }
  ]);
  const [novoMatTitulo, setNovoMatTitulo] = useState('');
  const [novoMatTipo, setNovoMatTipo] = useState<'APOSTILA' | 'ARTIGO' | 'LEGISLACAO'>('APOSTILA');
  const [novoMatTexto, setNovoMatTexto] = useState('');

  // 4. Prova Oficial com 10 Questões de Múltipla Escolha e Limite de 1 Hora
  const questoesIniciaisPadrao: QuestaoAvaliacao[] = Array.from({ length: 10 }).map((_, idx) => ({
    id: idx + 1,
    numero: idx + 1,
    enunciado: `Questão ${idx + 1}: Em relação aos procedimentos técnicos e éticos estabelecidos para o curso, assinale a opção correta:`,
    opcoes: [
      { id: 1, letra: 'A', texto: 'Adoção rigorosa dos protocolos operacionais da EFAPP e garantia de sigilo profissional.' },
      { id: 2, letra: 'B', texto: 'Descarte dos procedimentos formais sem autorização da chefia responsável.' },
      { id: 3, letra: 'C', texto: 'Cobrança particular de honorários em ambiente público.' },
      { id: 4, letra: 'D', texto: 'Divulgação aberta de prontuários em redes sociais.' }
    ],
    opcaoCorretaId: 1,
    justificativaPedagogica: 'A ética profissional e o respeito às normas constituem requisito essencial para aprovação.'
  }));

  const [questoes, setQuestoes] = useState<QuestaoAvaliacao[]>(questoesIniciaisPadrao);

  const handleAdicionarVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoVideoTitulo) return;
    setVideoaulas((prev) => [
      ...prev,
      {
        id: Date.now(),
        titulo: novoVideoTitulo,
        duracaoMinutos: Number(novoVideoDuracao) || 20,
        urlVideo: novoVideoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
        resumo: novoVideoResumo || 'Aula técnica ministrada pelo docente responsável.'
      }
    ]);
    setNovoVideoTitulo('');
    setNovoVideoResumo('');
  };

  const handleAdicionarMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoMatTitulo || !novoMatTexto) return;
    setMateriais((prev) => [
      ...prev,
      {
        id: Date.now(),
        titulo: novoMatTitulo,
        tipo: novoMatTipo,
        paginasEstimadas: Math.ceil(novoMatTexto.length / 800) || 12,
        conteudoTexto: novoMatTexto
      }
    ]);
    setNovoMatTitulo('');
    setNovoMatTexto('');
  };

  const handleEditarEnunciado = (index: number, novoEnunciado: string) => {
    setQuestoes((prev) => {
      const atualizadas = [...prev];
      atualizadas[index].enunciado = novoEnunciado;
      return atualizadas;
    });
  };

  const handleEditarOpcao = (qIndex: number, opIndex: number, novoTexto: string) => {
    setQuestoes((prev) => {
      const atualizadas = [...prev];
      atualizadas[qIndex].opcoes[opIndex].texto = novoTexto;
      return atualizadas;
    });
  };

  const handleFinalizarECadastrarCurso = () => {
    const cursoCompleto: Curso = {
      id: Date.now(),
      nome: nomeCurso || 'Novo Curso Docente EFAPP',
      descricao: descricaoCurso || 'Curso elaborado pelo corpo docente especializado da EFAPP.',
      modalidade,
      tipoCurso,
      segmento,
      cargaHorariaHoras: Number(cargaHoraria) || 40,
      notaMinimaAprovacao: 7.0,
      prazoProvaMinutos: 60, // Limite obrigatório de 1 hora
      professorResponsavel: usuarioAtual.nomeCompleto,
      instituicaoSede: 'EFAPP - Polo de Formação Continuada',
      valorInscricao: tipoCurso === 'TIPO1' ? 0.00 : 180.00,
      imagemUrl:
        segmento === 'SAUDE'
          ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      modulos: [
        {
          id: Date.now() + 10,
          ordem: 1,
          titulo: 'Módulo Principal: Conteúdo Programático e Vídeos',
          descricao: 'Material elaborado pelo professor.',
          videoaulas: videoaulas,
          materiaisEscritos: materiais
        }
      ],
      avaliacao: {
        id: Date.now() + 20,
        idCurso: Date.now(),
        titulo: `Avaliação Final Oficial - ${nomeCurso}`,
        instrucoes: 'Prova com 10 questões de múltipla escolha. Duração máxima: 1 hora (60 minutos). Nota de corte: 7,0.',
        tempoLimiteMinutos: 60,
        notaCorte: 7.0,
        questoes: questoes
      }
    };

    cadastrarCurso(cursoCompleto);
    // Limpa os campos e retorna à etapa 1
    setNomeCurso('');
    setDescricaoCurso('');
    setEtapa(1);
  };

  return (
    <div className="space-y-6">
      {/* Banner da Área Docente */}
      <div className="bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-xs font-bold mb-2">
            <BookOpenCheck className="w-3.5 h-3.5 text-cyan-300" />
            <span>Módulo Exclusivo Perfil TIPO 6 (Professores) & TIPO 7</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ambiente de Criação de Cursos e Avaliações
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 max-w-2xl font-light mt-1">
            Professor: cadastre o curso, suba videoaulas e materiais impressos/apostilas, e estruture a prova oficial de 10 questões de múltipla escolha com prazo padrão máximo de 1 hora.
          </p>
        </div>

        <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 text-xs text-cyan-100 shrink-0">
          <p>Docente: <strong>{usuarioAtual.nomeCompleto}</strong></p>
          <p className="font-mono text-[11px] mt-0.5">CPF: {usuarioAtual.cpf}</p>
        </div>
      </div>

      {/* Indicador de Etapas */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto text-xs font-bold gap-2">
        <button
          onClick={() => setEtapa(1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            etapa === 1 ? 'bg-cyan-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">1</span>
          <span>1. Dados do Curso</span>
        </button>

        <button
          onClick={() => setEtapa(2)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            etapa === 2 ? 'bg-cyan-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>2. Videoaulas ({videoaulas.length})</span>
        </button>

        <button
          onClick={() => setEtapa(3)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            etapa === 3 ? 'bg-cyan-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Material Impresso ({materiais.length})</span>
        </button>

        <button
          onClick={() => setEtapa(4)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition shrink-0 ${
            etapa === 4 ? 'bg-cyan-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Prova Oficial (10 Questões • 1h)</span>
        </button>
      </div>

      {/* ETAPA 1: DADOS DO CURSO */}
      {etapa === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-900 text-base">Identificação do Curso</h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Nome do Curso
            </label>
            <input
              type="text"
              required
              value={nomeCurso}
              onChange={(e) => setNomeCurso(e.target.value)}
              placeholder="Ex: Formação em Vigilância Sanitária e Saúde Coletiva"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-cyan-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Ementa / Descrição
            </label>
            <textarea
              rows={3}
              value={descricaoCurso}
              onChange={(e) => setDescricaoCurso(e.target.value)}
              placeholder="Objetivos de aprendizagem e competências a serem desenvolvidas..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-sm focus:border-cyan-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Modalidade
              </label>
              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
              >
                <option value="EAD">EAD (A Distância)</option>
                <option value="PRESENCIAL">Presencial</option>
                <option value="HIBRIDO">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tipo do Curso
              </label>
              <select
                value={tipoCurso}
                onChange={(e) => setTipoCurso(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
              >
                <option value="TIPO1">TIPO 1 (Acesso Cidadão/Geral)</option>
                <option value="TIPO2">TIPO 2 (Agente Especializado)</option>
                <option value="TIPO3">TIPO 3 (Alta Gestão)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Segmento
              </label>
              <select
                value={segmento}
                onChange={(e) => setSegmento(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
              >
                <option value="SAUDE">Saúde Pública / Privada</option>
                <option value="EDUCACAO">Educação Básica / Superior</option>
                <option value="GESTAO_PUBLICA">Gestão Pública Integrada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Carga Horária (Horas)
              </label>
              <input
                type="number"
                value={cargaHoraria}
                onChange={(e) => setCargaHoraria(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 font-bold text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setEtapa(2)}
              disabled={!nomeCurso}
              className="px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Avançar para Videoaulas →
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 2: SUBIR VÍDEOS */}
      {etapa === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Upload e Cadastro de Videoaulas</h3>
            <p className="text-xs text-slate-500 mb-4">
              Todas as videoaulas receberão automaticamente a marca d'água dinâmica do CPF do aluno durante a exibição.
            </p>

            <form onSubmit={handleAdicionarVideo} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Título da Videoaula</label>
                <input
                  type="text"
                  required
                  value={novoVideoTitulo}
                  onChange={(e) => setNovoVideoTitulo(e.target.value)}
                  placeholder="Ex: Aula 2: Vigilância Epidemiológica de Campo"
                  className="w-full p-2 rounded-xl border"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Duração (minutos)</label>
                <input
                  type="number"
                  required
                  value={novoVideoDuracao}
                  onChange={(e) => setNovoVideoDuracao(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border font-mono font-bold"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="font-bold text-slate-700 block mb-1">URL do Vídeo (MP4 / Streaming Seguro)</label>
                <input
                  type="text"
                  value={novoVideoUrl}
                  onChange={(e) => setNovoVideoUrl(e.target.value)}
                  className="w-full p-2 rounded-xl border font-mono"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Adicionar Aula à Grade</span>
                </button>
              </div>
            </form>
          </div>

          {/* Lista de Videoaulas Cadastradas */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-800 text-sm">Videoaulas Inseridas ({videoaulas.length})</h4>
            <div className="space-y-2">
              {videoaulas.map((v, i) => (
                <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-[10px]">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{v.titulo}</p>
                      <span className="text-[11px] text-slate-500 font-mono">Duração: {v.duracaoMinutos} min • Proteção por CPF Ativa</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setVideoaulas(prev => prev.filter(x => x.id !== v.id))}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setEtapa(1)}
                className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                ← Voltar
              </button>
              <button
                onClick={() => setEtapa(3)}
                className="px-6 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-xl shadow"
              >
                Avançar para Materiais Impressos →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ETAPA 3: SUBIR MATERIAL IMPRESSO E APOSTILAS */}
      {etapa === 3 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="font-bold text-slate-900 text-base mb-1">Upload de Materiais Impressos e Apostilas</h3>
            <p className="text-xs text-slate-500 mb-4">
              Os textos e apostilas ficam blindados contra cópia, sem permissão de seleção ou clique direito, e com marca d'água de CPF repetida.
            </p>

            <form onSubmit={handleAdicionarMaterial} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Título do Material</label>
                  <input
                    type="text"
                    required
                    value={novoMatTitulo}
                    onChange={(e) => setNovoMatTitulo(e.target.value)}
                    placeholder="Ex: Caderno de Protocolos do SUS 2026"
                    className="w-full p-2 rounded-xl border"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo</label>
                  <select
                    value={novoMatTipo}
                    onChange={(e) => setNovoMatTipo(e.target.value as any)}
                    className="w-full p-2 rounded-xl border bg-white font-bold"
                  >
                    <option value="APOSTILA">Apostila Completa</option>
                    <option value="ARTIGO">Artigo Científico</option>
                    <option value="LEGISLACAO">Legislação Comentada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Conteúdo Textual da Apostila</label>
                <textarea
                  rows={5}
                  required
                  value={novoMatTexto}
                  onChange={(e) => setNovoMatTexto(e.target.value)}
                  placeholder="Cole aqui o texto didático que será disponibilizado no leitor protegido..."
                  className="w-full p-2.5 rounded-xl border font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Salvar Material no Curso</span>
              </button>
            </form>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setEtapa(2)}
              className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              ← Voltar
            </button>
            <button
              onClick={() => setEtapa(4)}
              className="px-6 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs rounded-xl shadow"
            >
              Avançar para Prova de 10 Questões →
            </button>
          </div>
        </div>
      )}

      {/* ETAPA 4: PROVA DE 10 QUESTÕES DE MÚLTIPLA ESCOLHA (1 HORA MÁXIMO) */}
      {etapa === 4 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                  Regulamentação EFAPP
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  Padrão Obrigatório: 10 Questões de Múltipla Escolha
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base mt-1">
                Elaboração da Avaliação Final do Curso
              </h3>
              <p className="text-xs text-slate-500">
                O aluno terá o prazo máximo de <strong>1 hora (60 minutos)</strong> para responder às 10 questões e receber o certificado.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Limite: 60 minutos</span>
            </div>
          </div>

          {/* Lista das 10 Questões Editáveis */}
          <div className="space-y-4">
            {questoes.map((q, qIdx) => (
              <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-700 uppercase tracking-wider">
                    Questão {q.numero} de 10
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    Alternativa Correta: A
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enunciado</label>
                  <textarea
                    rows={2}
                    value={q.enunciado}
                    onChange={(e) => handleEditarEnunciado(qIdx, e.target.value)}
                    className="w-full p-2 rounded-xl border text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.opcoes.map((op, opIdx) => (
                    <div key={op.id} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-[10px]">
                        {op.letra}
                      </span>
                      <input
                        type="text"
                        value={op.texto}
                        onChange={(e) => handleEditarOpcao(qIdx, opIdx, e.target.value)}
                        className={`w-full p-1.5 rounded-lg border text-xs ${
                          op.id === q.opcaoCorretaId ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botão Final de Publicação */}
          <div className="p-6 bg-cyan-50 border border-cyan-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-cyan-950 text-sm">Pronto para Publicar o Curso?</h4>
              <p className="text-xs text-cyan-800">
                O curso ficará disponível imediatamente para os alunos com proteção por CPF e prova de 1 hora configurada.
              </p>
            </div>
            <button
              onClick={handleFinalizarECadastrarCurso}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Publicar Curso na Plataforma EFAPP</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
