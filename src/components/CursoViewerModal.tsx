/**
 * EFAPP - Sala de Aula Virtual com Proteção Anticópia Rigorosa
 * Exibe videoaulas e materiais escritos/apostilas com marca d'água de CPF,
 * e dá acesso à prova padrão de 10 questões (prazo de 1h) e certificado.
 */

import React, { useState } from 'react';
import { Curso, Videoaula, MaterialEscrito, Certificado } from '../types/index.ts';
import { useApp } from '../context/AppContext.tsx';
import { WatermarkOverlay } from './WatermarkOverlay.tsx';
import { ProtecaoCopiaContainer } from './ProtecaoCopiaContainer.tsx';
import { ProvaModal } from './ProvaModal.tsx';
import { CertificadoModal } from './CertificadoModal.tsx';
import {
  X,
  Play,
  BookOpen,
  FileText,
  Award,
  Shield,
  Clock,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface CursoViewerModalProps {
  aberto: boolean;
  onFechar: () => void;
  curso: Curso | null;
}

export const CursoViewerModal: React.FC<CursoViewerModalProps> = ({
  aberto,
  onFechar,
  curso
}) => {
  const { usuarioAtual, certificados } = useApp();

  const [abaAtiva, setAbaAtiva] = useState<'video' | 'material' | 'avaliacao'>('video');
  const [videoaulaAtivaIndex, setVideoaulaAtivaIndex] = useState(0);
  const [materialAtivoIndex, setMaterialAtivoIndex] = useState(0);
  const [modalProvaAberto, setModalProvaAberto] = useState(false);
  const [modalCertificadoAberto, setModalCertificadoAberto] = useState(false);
  const [ultimoCertificadoEmitido, setUltimoCertificadoEmitido] = useState<Certificado | null>(null);

  if (!aberto || !curso) return null;

  // Encontra certificado já emitido para este curso pelo usuário atual, se houver
  const certificadoExistente =
    certificados.find((c) => c.idCurso === curso.id && c.cpfAluno === usuarioAtual.cpf) ||
    ultimoCertificadoEmitido;

  // Flatten de vídeos e materiais escritos de todos os módulos
  const todasVideoaulas: Videoaula[] = curso.modulos.flatMap((m) => m.videoaulas);
  const todosMateriais: MaterialEscrito[] = curso.modulos.flatMap((m) => m.materiaisEscritos);

  const videoAtual = todasVideoaulas[videoaulaAtivaIndex] || todasVideoaulas[0];
  const materialAtual = todosMateriais[materialAtivoIndex] || todosMateriais[0];

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
          {/* Barra Superior da Sala de Aula */}
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                {curso.tipoCurso} • {curso.modalidade}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {curso.nome}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {certificadoExistente && (
                <button
                  onClick={() => setModalCertificadoAberto(true)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition"
                >
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Ver Certificado</span>
                </button>
              )}

              <button
                onClick={onFechar}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Faixa de Alerta de Proteção por Marca d'Água */}
          <div className="bg-amber-50/90 border-b border-amber-200 px-5 py-2 flex items-center justify-between text-xs text-amber-900 shrink-0">
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-4 h-4 text-amber-700" />
              Conteúdo com Proteção Anticópia: Rastreabilidade ativa no CPF{' '}
              <strong className="font-mono text-amber-950">{usuarioAtual.cpf}</strong>
            </span>
            <span className="text-[11px] text-amber-800 font-semibold hidden sm:inline">
              EFAPP • Direitos Autorais e Sigilo Reservados
            </span>
          </div>

          {/* Abas de Navegação (Vídeos, Materiais Escritos, Avaliação) */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 flex items-center gap-2 shrink-0 overflow-x-auto">
            <button
              onClick={() => setAbaAtiva('video')}
              className={`py-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
                abaAtiva === 'video'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Videoaulas ({todasVideoaulas.length})</span>
            </button>

            <button
              onClick={() => setAbaAtiva('material')}
              className={`py-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
                abaAtiva === 'material'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Apostilas e Textos ({todosMateriais.length})</span>
            </button>

            <button
              onClick={() => setAbaAtiva('avaliacao')}
              className={`py-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
                abaAtiva === 'avaliacao'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Prova Oficial (10 Questões • 1h)</span>
              {certificadoExistente && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 ml-1" />
              )}
            </button>
          </div>

          {/* Área de Conteúdo Principal */}
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* ABA 1: VIDEOAULAS COM MARCA D'ÁGUA DE CPF */}
            {abaAtiva === 'video' && (
              <>
                <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
                  {/* Contêiner de Vídeo Protegido com Marca d'Água Dinâmica */}
                  <ProtecaoCopiaContainer className="w-full h-full relative flex items-center justify-center bg-slate-950">
                    <WatermarkOverlay modo="completo" />

                    {videoAtual ? (
                      <video
                        key={videoAtual.urlVideo}
                        controls
                        controlsList="nodownload noplaybackrate"
                        disablePictureInPicture
                        className="w-full h-full max-h-[60vh] object-contain relative z-10"
                        src={videoAtual.urlVideo}
                      >
                        Seu navegador não suporta reprodução de vídeo.
                      </video>
                    ) : (
                      <div className="text-white text-sm p-6 text-center">
                        Nenhuma videoaula cadastrada neste módulo.
                      </div>
                    )}
                  </ProtecaoCopiaContainer>

                  {/* Resumo da Aula */}
                  {videoAtual && (
                    <div className="bg-slate-900/90 text-white p-4 border-t border-slate-800 shrink-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-emerald-400">
                          {videoAtual.titulo}
                        </h3>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {videoAtual.duracaoMinutos} min
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                        {videoAtual.resumo}
                      </p>
                    </div>
                  )}
                </div>

                {/* Lista Lateral de Videoaulas */}
                <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 overflow-y-auto p-4 shrink-0">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Grade de Videoaulas
                  </h4>
                  <div className="space-y-2">
                    {todasVideoaulas.map((v, idx) => (
                      <button
                        key={v.id}
                        onClick={() => setVideoaulaAtivaIndex(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start gap-2.5 ${
                          idx === videoaulaAtivaIndex
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                            idx === videoaulaAtivaIndex
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="line-clamp-1">{v.titulo}</p>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            Duração: {v.duracaoMinutos} min
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ABA 2: APOSTILAS E MATERIAIS ESCRITOS COM PROTEÇÃO ANTICÓPIA E MARCA D'ÁGUA */}
            {abaAtiva === 'material' && (
              <>
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/60 relative">
                  {/* Marca d'água permanente sobre o texto da apostila */}
                  <WatermarkOverlay modo="completo" />

                  <ProtecaoCopiaContainer className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 relative z-10">
                    {materialAtual ? (
                      <div className="space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                            {materialAtual.tipo} • EFAPP Material Seguro
                          </span>
                          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3">
                            {materialAtual.titulo}
                          </h2>
                          <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                            <span>Estimativa: ~{materialAtual.paginasEstimadas} páginas</span>
                            <span>•</span>
                            <span>Exclusivo para: {usuarioAtual.nomeCompleto}</span>
                          </div>
                        </div>

                        {/* Texto da Apostila com estilo acadêmico nítido */}
                        <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                          {materialAtual.conteudoTexto}
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
                          © EFAPP - Escola de Formação de Agentes Públicos e Privados. Cópia ou reprodução não autorizada sujeita a rastreio pelo CPF {usuarioAtual.cpf}.
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 text-slate-500 text-sm">
                        Nenhum material escrito cadastrado neste curso.
                      </div>
                    )}
                  </ProtecaoCopiaContainer>
                </div>

                {/* Lista Lateral de Materiais */}
                <div className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 overflow-y-auto p-4 shrink-0">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Apostilas e Leituras
                  </h4>
                  <div className="space-y-2">
                    {todosMateriais.map((m, idx) => (
                      <button
                        key={m.id}
                        onClick={() => setMaterialAtivoIndex(idx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start gap-2.5 ${
                          idx === materialAtivoIndex
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="line-clamp-2">{m.titulo}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            Tipo: {m.tipo}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ABA 3: AVALIAÇÃO FINAL (10 QUESTÕES • 1 HORA) E CERTIFICADO */}
            {abaAtiva === 'avaliacao' && (
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-50 flex items-center justify-center">
                <div className="max-w-xl w-full bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200 text-center space-y-6">
                  <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full mx-auto flex items-center justify-center ring-8 ring-blue-50">
                    <Award className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {curso.avaliacao.titulo || 'Avaliação Final de Conclusão'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">
                      Conforme a regulamentação pedagógica da EFAPP, todos os cursos contam com uma prova padrão com exatamente <strong>10 questões de múltipla escolha</strong> e prazo máximo de <strong>1 hora (60 minutos)</strong>.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Quantidade de Questões:</span>
                      <span className="font-bold text-slate-900">10 questões de múltipla escolha</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Tempo Limite:</span>
                      <span className="font-bold text-blue-700 font-mono">60 minutos (1 hora estrita)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Nota Mínima para Aprovação:</span>
                      <span className="font-bold text-emerald-700">7,0 (7 acertos)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Emissão de Certificado:</span>
                      <span className="font-bold text-emerald-800">Imediata após aprovação</span>
                    </div>
                  </div>

                  {certificadoExistente ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <span>Você já concluiu este curso com êxito!</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        Código de Autenticidade: <strong className="font-mono">{certificadoExistente.codigoAutenticidade}</strong>
                      </p>
                      <button
                        onClick={() => setModalCertificadoAberto(true)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        <span>Abrir Certificado Oficial para Impressão</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalProvaAberto(true)}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Clock className="w-5 h-5" />
                      <span>Iniciar Prova Oficial de 10 Questões (1h)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Prova */}
      <ProvaModal
        aberto={modalProvaAberto}
        onFechar={() => setModalProvaAberto(false)}
        avaliacao={curso.avaliacao}
        idCurso={curso.id}
        nomeCurso={curso.nome}
        onCertificadoEmitido={(cert) => {
          setUltimoCertificadoEmitido(cert);
          setModalProvaAberto(false);
          setModalCertificadoAberto(true);
        }}
      />

      {/* Modal de Certificado */}
      <CertificadoModal
        aberto={modalCertificadoAberto}
        onFechar={() => setModalCertificadoAberto(false)}
        certificado={certificadoExistente || ultimoCertificadoEmitido}
      />
    </>
  );
};
