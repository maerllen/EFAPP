/**
 * EFAPP - Escola de Formação de Agentes Públicos e Privados
 * Definições de Tipos em TypeScript para todo o ecossistema
 * Cursos EAD/Presenciais, Loja Virtual, Perfis TIPO1 a TIPO7 e Módulo Financeiro
 */

export type CodigoPerfil = 'TIPO1' | 'TIPO2' | 'TIPO3' | 'TIPO4' | 'TIPO5' | 'TIPO6' | 'TIPO7';

export interface PerfilAcesso {
  id: number;
  codigo: CodigoPerfil;
  nome: string;
  descricao: string;
  nivel: number;
}

export interface Usuario {
  id: number;
  idPerfil: number;
  codigoPerfil: CodigoPerfil;
  nomeCompleto: string;
  cpf: string; // Utilizado na marca d'água de proteção
  email: string;
  orgaoInstituicao: string;
  cargoFuncao: string;
  segmento: 'SAUDE' | 'EDUCACAO' | 'AMBOS';
  statusConta?: 'ATIVO' | 'BLOQUEADO' | 'PENDENTE';
  dataCadastro: string;
}


export type ModalidadeCurso = 'EAD' | 'PRESENCIAL' | 'HIBRIDO';
export type TipoCurso = 'TIPO1' | 'TIPO2' | 'TIPO3';
export type SegmentoAtuacao = 'SAUDE' | 'EDUCACAO' | 'GESTAO_PUBLICA';

export interface Videoaula {
  id: number;
  titulo: string;
  duracaoMinutos: number;
  urlVideo: string;
  resumo: string;
}

export interface MaterialEscrito {
  id: number;
  titulo: string;
  tipo: 'APOSTILA' | 'ARTIGO' | 'LEGISLACAO' | 'GUIA_PRATICO';
  conteudoTexto: string;
  paginasEstimadas: number;
}

export interface OpcaoQuestao {
  id: number;
  letra: 'A' | 'B' | 'C' | 'D';
  texto: string;
}

export interface QuestaoAvaliacao {
  id: number;
  numero: number;
  enunciado: string;
  opcoes: OpcaoQuestao[];
  opcaoCorretaId: number;
  justificativaPedagogica: string;
}

export interface AvaliacaoCurso {
  id: number;
  idCurso: number;
  titulo: string;
  instrucoes: string;
  tempoLimiteMinutos: number; // Padrão: 60 minutos (1 hora)
  questoes: QuestaoAvaliacao[]; // Padrão: 10 questões de múltipla escolha
  notaCorte: number; // Padrão: 7.0
}

export interface ModuloCurso {
  id: number;
  ordem: number;
  titulo: string;
  descricao: string;
  videoaulas: Videoaula[];
  materiaisEscritos: MaterialEscrito[];
}

export interface Curso {
  id: number;
  nome: string;
  descricao: string;
  modalidade: ModalidadeCurso;
  tipoCurso: TipoCurso;
  segmento: SegmentoAtuacao;
  cargaHorariaHoras: number;
  notaMinimaAprovacao: number;
  prazoProvaMinutos: number; // 60 minutos
  professorResponsavel: string;
  idProfessor?: number;
  instituicaoSede: string;
  idInstituicao?: number;
  valorInscricao: number;
  imagemUrl: string;
  modulos: ModuloCurso[];
  avaliacao: AvaliacaoCurso;
  concluido?: boolean;
}

export interface Certificado {
  id: number;
  codigoAutenticidade: string;
  idUsuario: number;
  idCurso: number;
  nomeAluno: string;
  cpfAluno: string;
  nomeCurso: string;
  modalidade: ModalidadeCurso;
  cargaHoraria: number;
  dataEmissao: string;
  notaFinal: number;
  livroRegistro: string;
  folhaRegistro: string;
}

export type TipoProduto = 'TIPO1' | 'TIPO2' | 'GERAL';
export type CategoriaProduto = 'LIVRO' | 'APOSTILA' | 'SOFTWARE' | 'KIT_PRATICO';

export interface ProdutoLoja {
  id: number;
  tipoProduto: TipoProduto;
  nome: string;
  categoria: CategoriaProduto;
  segmento: SegmentoAtuacao;
  descricao: string;
  preco: number;
  estoque: number;
  imagemUrl: string;
  destaque?: boolean;
}

export interface ItemCarrinho {
  produto: ProdutoLoja;
  quantidade: number;
}

export interface Instituicao {
  id: number;
  nome: string;
  cnpj: string;
  esfera: 'PUBLICA_MUNICIPAL' | 'PUBLICA_ESTADUAL' | 'PUBLICA_FEDERAL' | 'PRIVADA';
  areaFoco: 'SAUDE' | 'EDUCACAO' | 'MISTA';
  cidade: string;
  estado: string;
  responsavel: string;
  telefone: string;
  email: string;
}

export interface Professor {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  titulacao: 'ESPECIALISTA' | 'MESTRE' | 'DOUTOR' | 'POS_DOUTOR';
  areaAtuacao: string;
  valorHoraAula: number;
  chavePix: string;
}

export interface CronogramaCurso {
  id: number;
  idCurso: number;
  nomeCurso: string;
  idInstituicao: number;
  nomeInstituicao: string;
  idProfessor: number;
  nomeProfessor: string;
  dataInicio: string;
  dataTermino: string;
  horarioInicio: string;
  horarioTermino: string;
  diasSemana: string;
  salaLocal: string;
  vagasTotais: number;
  vagasOcupadas: number;
  status: 'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA';
}

export interface EscalaProfessor {
  id: number;
  idProfessor: number;
  nomeProfessor: string;
  idCurso: number;
  nomeCurso: string;
  idInstituicao: number;
  nomeInstituicao: string;
  dataAula: string;
  horaInicio: string;
  horaFim: string;
  totalHoras: number;
  temaAula: string;
  status: 'AGENDADA' | 'MINISTRADA' | 'CANCELADA';
}

export interface LancamentoFinanceiro {
  id: number;
  tipoOperacao: 'RECEITA' | 'DESPESA';
  categoriaDespesa?: 'FIXA' | 'VARIAVEL';
  subcategoria: string;
  descricao: string;
  valor: number;
  dataCompetencia: string;
  dataPagamento: string;
  status: 'PAGO' | 'PENDENTE';
}

export interface RelatorioPagamentoProfessor {
  idProfessor: number;
  nomeProfessor: string;
  titulacao: string;
  horasMinistradas: number;
  valorHora: number;
  totalBruto: number;
  descontos: number;
  totalLiquido: number;
  chavePix: string;
}
