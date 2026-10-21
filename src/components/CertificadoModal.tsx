/**
 * EFAPP - Modal de Certificado Oficial de Conclusão de Curso
 * Certificado autêntico emitido após aprovação na prova de 10 questões,
 * com brasão oficial da EFAPP, registro de livro/folha, autenticação e impressão.
 */

import React from 'react';
import { Certificado } from '../types/index.ts';
import { X, Printer, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CertificadoModalProps {
  aberto: boolean;
  onFechar: () => void;
  certificado: Certificado | null;
}

export const CertificadoModal: React.FC<CertificadoModalProps> = ({
  aberto,
  onFechar,
  certificado
}) => {
  if (!aberto || !certificado) return null;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden my-auto print:border-none print:shadow-none">
        {/* Barra superior de ações (ocultada na impressão) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">Certificado Digital Oficial - EFAPP</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImprimir}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              onClick={onFechar}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* DOCUMENTO DO CERTIFICADO OFICIAL */}
        <div className="p-8 sm:p-12 relative bg-[#FCFDF9] text-slate-900 font-serif border-[14px] border-double border-emerald-900/20 m-3 sm:m-5 rounded-lg shadow-inner">
          {/* Marca d'água sutil de fundo no certificado */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <span className="text-9xl font-black tracking-widest text-emerald-950">EFAPP</span>
          </div>

          {/* Cabeçalho */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-16 h-16 bg-emerald-900 text-amber-300 rounded-full mx-auto flex items-center justify-center shadow-md border-2 border-amber-400 mb-3">
              <Award className="w-9 h-9" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-emerald-950 font-sans">
              Escola de Formação de Agentes Públicos e Privados
            </h1>
            <p className="text-xs sm:text-sm font-sans uppercase tracking-widest text-slate-600 font-semibold">
              EFAPP • Formação Continuada em Saúde e Educação
            </p>
            <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full mt-3"></div>
          </div>

          {/* Título do Certificado */}
          <div className="text-center my-6">
            <h2 className="text-xl sm:text-2xl font-bold tracking-widest uppercase text-slate-800">
              Certificado de Conclusão e Qualificação
            </h2>
          </div>

          {/* Texto do Certificado */}
          <div className="space-y-6 text-justify text-base sm:text-lg leading-relaxed text-slate-800 max-w-3xl mx-auto my-8">
            <p>
              Certificamos, para os devidos fins legais de capacitação e qualificação profissional, que
            </p>

            <p className="text-center text-2xl sm:text-3xl font-bold text-emerald-950 underline decoration-amber-500 decoration-2 underline-offset-8 py-2 font-sans">
              {certificado.nomeAluno}
            </p>

            <p className="text-center text-sm font-sans font-semibold text-slate-700">
              Inscrito(a) no Cadastro de Pessoas Físicas sob o CPF nº <span className="font-mono text-emerald-900 font-bold">{certificado.cpfAluno}</span>
            </p>

            <p>
              concluiu com êxito na modalidade <strong>{certificado.modalidade}</strong> o curso de formação e capacitação profissional:
            </p>

            <p className="text-center text-xl sm:text-2xl font-bold text-slate-900 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 font-sans">
              "{certificado.nomeCurso}"
            </p>

            <p className="text-sm sm:text-base leading-relaxed">
              com carga horária total de <strong>{certificado.cargaHoraria} horas</strong>, tendo realizado e obtido aproveitamento satisfatório com nota final <strong>{certificado.notaFinal.toFixed(1)}</strong> na avaliação oficial com duração de 1 hora, cumprindo integralmente as exigências curriculares e pedagógicas estabelecidas pela diretoria acadêmica da EFAPP.
            </p>
          </div>

          {/* Data e Assinaturas */}
          <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center font-sans">
            <div>
              <div className="h-10 border-b border-slate-700 w-56 mx-auto mb-2 flex items-end justify-center">
                <span className="font-cursive italic text-slate-600 text-lg">Valter S. Rocha</span>
              </div>
              <p className="text-xs font-bold text-slate-900 uppercase">Dr. Valter Silveira Rocha</p>
              <p className="text-[11px] text-slate-500">Diretor Geral Executivo • EFAPP</p>
            </div>

            <div>
              <div className="h-10 border-b border-slate-700 w-56 mx-auto mb-2 flex items-end justify-center">
                <span className="font-cursive italic text-slate-600 text-lg">Patrícia G. Siqueira</span>
              </div>
              <p className="text-xs font-bold text-slate-900 uppercase">Profa. Patrícia Guimarães Siqueira</p>
              <p className="text-[11px] text-slate-500">Coordenação Pedagógica e Avaliação</p>
            </div>
          </div>

          {/* Autenticação e Registro no Rodapé */}
          <div className="mt-10 pt-4 border-t border-dashed border-slate-300 flex flex-col sm:flex-row items-center justify-between text-xs font-sans text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <p className="font-bold text-slate-700">Autenticidade Verificável:</p>
                <p className="font-mono text-emerald-900 font-semibold">{certificado.codigoAutenticidade}</p>
              </div>
            </div>

            <div className="text-center sm:text-right text-[11px] space-y-0.5">
              <p>Livro: <strong>{certificado.livroRegistro}</strong> | Folha: <strong>{certificado.folhaRegistro}</strong></p>
              <p>Emitido em: <strong>{certificado.dataEmissao}</strong> • Válido em todo o território nacional</p>
              <p className="text-[10px] text-slate-400">Respaldo: Lei de Diretrizes e Bases da Educação Nacional nº 9.394/96 e Dec. 5.154/04</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
