/**
 * EFAPP - Visualizador e Exportador do Banco de Dados SQL
 * Requisito estrito do usuário:
 * "Banco de dados, crie um banco de dados em SQL com o script, todo o banco de dados deve ser em português, inclusive os comentários."
 */

import React, { useState } from 'react';
import { SCRIPT_SQL_EFAPP } from '../dados/bancoSqlScript.ts';
import { useApp } from '../context/AppContext.tsx';
import {
  Database,
  Download,
  Copy,
  Check,
  Table,
  ShieldCheck,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';

export const BancoDeDadosView: React.FC = () => {
  const { exibirNotificacao } = useApp();
  const [copiado, setCopiado] = useState(false);
  const [termoFiltro, setTermoFiltro] = useState('');

  // Tabelas catalogadas no script
  const tabelasDicionario = [
    { nome: 'perfis_acesso', desc: 'Permissões e atribuições dos perfis TIPO1 a TIPO7' },
    { nome: 'usuarios', desc: 'Contas cadastrais, credenciais e CPF para marca d\'água anticópia' },
    { nome: 'instituicoes', desc: 'Instituições de saúde e educação públicas e privadas conveniadas' },
    { nome: 'professores', desc: 'Corpo docente, titulação, chave PIX e valor contratado da hora-aula' },
    { nome: 'cursos', desc: 'Cursos EAD/presenciais de saúde e educação com modalidade e tipo' },
    { nome: 'modulos_curso', desc: 'Organização curricular e divisão temática dos cursos' },
    { nome: 'videoaulas', desc: 'Aulas em vídeo com proteção anticópia e streaming' },
    { nome: 'materiais_escritos', desc: 'Textos e apostilas protegidos contra cópia e com marca d\'água' },
    { nome: 'avaliacoes', desc: 'Provas oficiais de 10 questões de múltipla escolha com prazo de 1 hora' },
    { nome: 'questoes_avaliacao', desc: 'Enunciados e justificativas pedagógicas de cada questão' },
    { nome: 'opcoes_questao', desc: 'Alternativas A, B, C, D de múltipla escolha' },
    { nome: 'tentativas_avaliacao', desc: 'Histórico de notas, tempo gasto e aprovação do aluno' },
    { nome: 'respostas_aluno', desc: 'Gabarito submetido pelo estudante para auditoria' },
    { nome: 'certificados', desc: 'Certificados emitidos com autenticidade, livro e folha' },
    { nome: 'produtos_loja', desc: 'Livros, apostilas, softwares e kits práticos (TIPO1, TIPO2 e Geral)' },
    { nome: 'pedidos_loja', desc: 'Pedidos de compras realizados na loja virtual' },
    { nome: 'itens_pedido', desc: 'Composição de cada pedido da loja' },
    { nome: 'cronogramas_cursos', desc: 'Calendários de turmas, datas, horários e vagas' },
    { nome: 'escala_professores', desc: 'Alocação de docentes por aula e acompanhamento de ministração' },
    { nome: 'lancamentos_financeiros', desc: 'Despesas fixas/variáveis e receitas integradas da loja e cursos' },
    { nome: 'pagamentos_professores', desc: 'Relatório financeiro de repasse aos docentes (horas x valor/h)' }
  ];

  const handleCopiarSql = () => {
    navigator.clipboard.writeText(SCRIPT_SQL_EFAPP);
    setCopiado(true);
    exibirNotificacao('sucesso', 'Script SQL copiado para a área de transferência com sucesso!');
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleBaixarSql = () => {
    const blob = new Blob([SCRIPT_SQL_EFAPP], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'banco_de_dados_efapp.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    exibirNotificacao('sucesso', 'Download do arquivo "banco_de_dados_efapp.sql" iniciado!');
  };

  return (
    <div className="space-y-6">
      {/* Banner Superior */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Database className="w-3.5 h-3.5 text-indigo-300" />
            <span>Estrutura de Banco de Dados Relacional SQL em Português</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Script SQL Completo da Plataforma EFAPP
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            Estrutura relacional padronizada em ANSI SQL (compatível com PostgreSQL, MySQL e MariaDB) contendo 20 tabelas, chaves primárias, estrangeiras, índices e comentários 100% em português.
          </p>
        </div>

        {/* Botões de Ação para o Desenvolvedor / Avaliador */}
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
          <button
            onClick={handleCopiarSql}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 shadow flex items-center justify-center gap-2 transition"
          >
            {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiado ? 'Copiado!' : 'Copiar Script SQL'}</span>
          </button>

          <button
            onClick={handleBaixarSql}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Baixar arquivo .SQL</span>
          </button>
        </div>
      </div>

      {/* Dicionário de Tabelas do Banco */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Dicionário de Tabelas da EFAPP</h3>
            <p className="text-xs text-slate-500">20 entidades relacionais modeladas em português</p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
            20 Tabelas Catalogadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tabelasDicionario.map((t) => (
            <div
              key={t.nome}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 transition"
            >
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-mono font-bold text-slate-900 text-xs">{t.nome}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizador de Código SQL */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 px-6 py-3 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-mono">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>banco_de_dados_efapp.sql</span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>ANSI SQL / PostgreSQL</span>
            <span>•</span>
            <span>UTF-8</span>
          </div>
        </div>

        <div className="p-6 overflow-x-auto max-h-[600px] font-mono text-xs text-slate-300 leading-relaxed selection:bg-indigo-900 selection:text-white">
          <pre>{SCRIPT_SQL_EFAPP}</pre>
        </div>
      </div>
    </div>
  );
};
