/**
 * EFAPP - Modal de Prova Oficial de 10 Questões de Múltipla Escolha
 * Regra obrigatória: Prazo máximo estrito de 1 hora (60 minutos) com cronômetro em tempo real.
 * Ao concluir com nota igual ou superior a 7.0, emite automaticamente o certificado oficial.
 */

import React, { useState, useEffect } from 'react';
import { AvaliacaoCurso, Certificado } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { ProtecaoCopiaContainer } from './ProtecaoCopiaContainer.tsx';
import { WatermarkOverlay } from './WatermarkOverlay.tsx';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  FileCheck
} from 'lucide-react';

interface ProvaModalProps {
  aberto: boolean;
  onFechar: () => void;
  avaliacao: AvaliacaoCurso;
  idCurso: number;
  nomeCurso: string;
  onCertificadoEmitido?: (cert: Certificado) => void;
}

export const ProvaModal: React.FC<ProvaModalProps> = ({
  aberto,
  onFechar,
  avaliacao,
  idCurso,
  nomeCurso,
  onCertificadoEmitido
}) => {
  const { emitirCertificado } = useApp();

  // 1 hora = 3600 segundos
  const [segundosRestantes, setSegundosRestantes] = useState(60 * 60);
  const [questaoAtualIndex, setQuestaoAtualIndex] = useState(0);
  const [respostas, setRespostas] = useState<{ [idQuestao: number]: number }>({});
  const [provaFinalizada, setProvaFinalizada] = useState(false);
  const [resultado, setResultado] = useState<{
    acertos: number;
    total: number;
    nota: number;
    aprovado: boolean;
    certificado?: Certificado;
  } | null>(null);

  // Inicializa cronômetro de 1 hora
  useEffect(() => {
    if (!aberto || provaFinalizada) return;

    setSegundosRestantes(60 * 60);
    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finalizarProva(); // Encerramento automático ao esgotar o prazo de 1 hora
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [aberto, provaFinalizada]);

  if (!aberto) return null;

  const questoes = avaliacao.questoes;
  const questaoAtual = questoes[questaoAtualIndex];

  // Formatação do tempo de 1 hora
  const formatarTempo = (seg: number) => {
    const minutos = Math.floor(seg / 60);
    const s = seg % 60;
    return `${minutos.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelecionarOpcao = (idQuestao: number, idOpcao: number) => {
    if (provaFinalizada) return;
    setRespostas((prev) => ({
      ...prev,
      [idQuestao]: idOpcao
    }));
  };

  const finalizarProva = () => {
    if (provaFinalizada) return;

    let acertos = 0;
    questoes.forEach((q) => {
      if (respostas[q.id] === q.opcaoCorretaId) {
        acertos += 1;
      }
    });

    const nota = (acertos / questoes.length) * 10;
    const aprovado = nota >= (avaliacao.notaCorte || 7.0);

    let certEmitido: Certificado | undefined = undefined;
    if (aprovado) {
      certEmitido = emitirCertificado(idCurso, nota);
      if (onCertificadoEmitido) {
        onCertificadoEmitido(certEmitido);
      }
    }

    setResultado({
      acertos,
      total: questoes.length,
      nota,
      aprovado,
      certificado: certEmitido
    });
    setProvaFinalizada(true);
  };

  const resetarProvaParaRefazer = () => {
    setRespostas({});
    setQuestaoAtualIndex(0);
    setSegundosRestantes(60 * 60);
    setProvaFinalizada(false);
    setResultado(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden relative">
        {/* Marca d'água de proteção contra vazamento da prova */}
        <WatermarkOverlay modo="sutil" />

        {/* Topo Oficial da Avaliação */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                Prova Oficial EFAPP
              </span>
              <span className="text-xs text-slate-400">10 Questões de Múltipla Escolha</span>
            </div>
            <h2 className="text-base font-bold text-white mt-1 line-clamp-1">
              {avaliacao.titulo || `Avaliação Final: ${nomeCurso}`}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Cronômetro Regressivo de 1 Hora */}
            {!provaFinalizada && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  segundosRestantes < 600
                    ? 'bg-rose-950/70 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-emerald-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatarTempo(segundosRestantes)}</span>
              </div>
            )}

            <button
              onClick={onFechar}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              title="Fechar avaliação"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Progresso de Questões */}
        {!provaFinalizada && (
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600 z-10">
            <span className="font-semibold text-slate-800">
              Questão {questaoAtualIndex + 1} de {questoes.length}
            </span>
            <div className="flex items-center gap-1.5">
              {questoes.map((q, idx) => {
                const respondida = respostas[q.id] !== undefined;
                const atual = idx === questaoAtualIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => setQuestaoAtualIndex(idx)}
                    className={`w-6 h-6 rounded-md text-xs font-bold transition flex items-center justify-center ${
                      atual
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : respondida
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Respondidas: {Object.keys(respostas).length} de {questoes.length}
            </span>
          </div>
        )}

        {/* Conteúdo Central da Prova com Proteção Anticópia */}
        <ProtecaoCopiaContainer className="flex-1 overflow-y-auto p-6 sm:p-8 z-10">
          {!provaFinalizada ? (
            <div className="space-y-6">
              {/* Enunciado da Questão */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
                  Questão {questaoAtual.numero}
                </span>
                <p className="text-slate-800 text-base sm:text-lg font-medium leading-relaxed">
                  {questaoAtual.enunciado}
                </p>
              </div>

              {/* Alternativas A, B, C, D */}
              <div className="space-y-3">
                {questaoAtual.opcoes.map((opcao) => {
                  const selecionada = respostas[questaoAtual.id] === opcao.id;
                  return (
                    <button
                      key={opcao.id}
                      type="button"
                      onClick={() => handleSelecionarOpcao(questaoAtual.id, opcao.id)}
                      className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3.5 ${
                        selecionada
                          ? 'bg-blue-50/90 border-blue-600 shadow-sm ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition ${
                          selecionada
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {opcao.letra}
                      </span>
                      <span className="text-sm sm:text-base text-slate-800 font-normal leading-snug pt-0.5">
                        {opcao.texto}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Tela de Resultado Final */
            <div className="py-6 text-center space-y-6">
              <div
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ring-8 ${
                  resultado?.aprovado
                    ? 'bg-emerald-100 text-emerald-600 ring-emerald-50'
                    : 'bg-rose-100 text-rose-600 ring-rose-50'
                }`}
              >
                {resultado?.aprovado ? (
                  <Award className="w-10 h-10" />
                ) : (
                  <AlertTriangle className="w-10 h-10" />
                )}
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  {resultado?.aprovado ? 'Parabéns! Você foi Aprovado(a)!' : 'Aproveitamento Insuficiente'}
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-1">
                  {resultado?.aprovado
                    ? 'Você atingiu o índice satisfatório na avaliação padrão da EFAPP. Seu certificado foi gerado e autenticado.'
                    : 'Para aprovação e emissão do certificado institucional é necessário atingir nota mínima de 7,0.'}
                </p>
              </div>

              {/* Cartão de Notas */}
              <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-3 gap-3 text-center">
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Acertos</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {resultado?.acertos} / {resultado?.total}
                  </span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-xs text-slate-500 font-semibold block">Nota Final</span>
                  <span
                    className={`text-2xl font-extrabold ${
                      resultado?.aprovado ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {resultado?.nota.toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold block">Status</span>
                  <span
                    className={`inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      resultado?.aprovado
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {resultado?.aprovado ? 'APROVADO' : 'REPROVADO'}
                  </span>
                </div>
              </div>

              {/* Botões pós-resultado */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                {resultado?.aprovado ? (
                  <button
                    onClick={onFechar}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Visualizar Certificado Oficial</span>
                  </button>
                ) : (
                  <button
                    onClick={resetarProvaParaRefazer}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
                  >
                    Tentar Novamente (Novo Prazo de 1h)
                  </button>
                )}
                <button
                  onClick={onFechar}
                  className="w-full sm:w-auto px-5 py-3 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold rounded-xl text-sm transition"
                >
                  Voltar ao Curso
                </button>
              </div>
            </div>
          )}
        </ProtecaoCopiaContainer>

        {/* Rodapé de Navegação da Prova */}
        {!provaFinalizada && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between z-10">
            <button
              type="button"
              disabled={questaoAtualIndex === 0}
              onClick={() => setQuestaoAtualIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1.5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {questaoAtualIndex < questoes.length - 1 ? (
              <button
                type="button"
                onClick={() => setQuestaoAtualIndex((prev) => Math.min(questoes.length - 1, prev + 1))}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow transition"
              >
                <span>Próxima</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finalizarProva}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-lg transition"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Finalizar e Entregar Avaliação</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
