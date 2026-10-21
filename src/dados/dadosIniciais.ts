/**
 * EFAPP - Escola de Formação de Agentes Públicos e Privados
 * Base de Dados Inicial (Seed Data) com Cursos de Saúde e Educação,
 * Perfis TIPO1 a TIPO7, Loja Virtual, Cronogramas e Módulo Financeiro
 */

import {
  Curso,
  ProdutoLoja,
  Instituicao,
  Professor,
  CronogramaCurso,
  EscalaProfessor,
  LancamentoFinanceiro,
  Usuario,
  Certificado
} from '../types/index.ts';

// 1. USUÁRIOS DE MODELO PARA CADA UM DOS PERFIS (TIPO1 ATÉ TIPO7)
export const USUARIOS_INICIAIS: Usuario[] = [
  {
    id: 1,
    idPerfil: 1,
    codigoPerfil: 'TIPO1',
    nomeCompleto: 'Carlos Eduardo Santos',
    cpf: '123.456.789-01',
    email: 'carlos.eduardo@saude.com.br',
    orgaoInstituicao: 'Unidade Básica de Saúde Central',
    cargoFuncao: 'Agente Comunitário de Saúde',
    segmento: 'SAUDE',
    statusConta: 'ATIVO',
    dataCadastro: '2026-01-15'
  },
  {
    id: 2,
    idPerfil: 2,
    codigoPerfil: 'TIPO2',
    nomeCompleto: 'Dra. Beatriz Mendes Fagundes',
    cpf: '234.567.890-12',
    email: 'beatriz.fagundes@hospitalregional.org',
    orgaoInstituicao: 'Complexo Hospitalar Estadual',
    cargoFuncao: 'Coordenadora de Vigilância Epidemiológica',
    segmento: 'SAUDE',
    statusConta: 'ATIVO',
    dataCadastro: '2026-02-01'
  },
  {
    id: 3,
    idPerfil: 3,
    codigoPerfil: 'TIPO3',
    nomeCompleto: 'Juliana Nogueira Alencar',
    cpf: '345.678.901-23',
    email: 'juliana.nogueira@efapp.edu.br',
    orgaoInstituicao: 'EFAPP - Gestão de Matrículas e Produtos',
    cargoFuncao: 'Gestora Operacional de Agentes',
    segmento: 'AMBOS',
    statusConta: 'ATIVO',
    dataCadastro: '2026-02-10'
  },
  {
    id: 4,
    idPerfil: 4,
    codigoPerfil: 'TIPO4',
    nomeCompleto: 'Marcos Vinícius Prado',
    cpf: '456.789.012-34',
    email: 'marcos.prado@efapp.edu.br',
    orgaoInstituicao: 'EFAPP - Editoria Acadêmica e Catálogo',
    cargoFuncao: 'Administrador de Conteúdo e Cursos',
    segmento: 'AMBOS',
    statusConta: 'ATIVO',
    dataCadastro: '2026-01-05'
  },
  {
    id: 5,
    idPerfil: 5,
    codigoPerfil: 'TIPO5',
    nomeCompleto: 'Patrícia Guimarães Siqueira',
    cpf: '567.890.123-45',
    email: 'patricia.siqueira@efapp.edu.br',
    orgaoInstituicao: 'EFAPP - Coordenação Pedagógica e Financeira',
    cargoFuncao: 'Diretora Pedagógica e Controladora Financeira',
    segmento: 'AMBOS',
    statusConta: 'ATIVO',
    dataCadastro: '2025-12-01'
  },
  {
    id: 6,
    idPerfil: 6,
    codigoPerfil: 'TIPO6',
    nomeCompleto: 'Prof. Dr. Ricardo Barros Albuquerque',
    cpf: '222.333.444-55',
    email: 'ricardo.barros@efapp.edu.br',
    orgaoInstituicao: 'EFAPP - Corpo Docente Especializado',
    cargoFuncao: 'Professor Titular de Políticas Públicas',
    segmento: 'EDUCACAO',
    statusConta: 'ATIVO',
    dataCadastro: '2026-01-02'
  },
  {
    id: 7,
    idPerfil: 7,
    codigoPerfil: 'TIPO7',
    nomeCompleto: 'Dr. Valter Silveira Rocha',
    cpf: '789.012.345-67',
    email: 'diretoria.geral@efapp.edu.br',
    orgaoInstituicao: 'EFAPP - Direção Geral',
    cargoFuncao: 'Super Administrador / Diretor Executivo',
    segmento: 'AMBOS',
    statusConta: 'ATIVO',
    dataCadastro: '2025-11-15'
  }
];

// 2. INSTITUIÇÕES PARCEIRAS (SAÚDE E EDUCAÇÃO PÚBLICA E PRIVADA)
export const INSTITUICOES_INICIAIS: Instituicao[] = [
  {
    id: 1,
    nome: 'Secretaria Municipal de Saúde (SMS - Polo Formador)',
    cnpj: '46.392.130/0001-18',
    esfera: 'PUBLICA_MUNICIPAL',
    areaFoco: 'SAUDE',
    cidade: 'São Paulo',
    estado: 'SP',
    responsavel: 'Dra. Helena Martins de Carvalho',
    telefone: '(11) 3222-1000',
    email: 'capacitacao.saude@prefeitura.sp.gov.br'
  },
  {
    id: 2,
    nome: 'Secretaria de Estado de Educação de Minas Gerais',
    cnpj: '18.715.532/0001-90',
    esfera: 'PUBLICA_ESTADUAL',
    areaFoco: 'EDUCACAO',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    responsavel: 'Prof. Cláudio Drummond Andrade',
    telefone: '(31) 3915-3000',
    email: 'escola.formacao@educacao.mg.gov.br'
  },
  {
    id: 3,
    nome: 'Hospital e Maternidade São Lucas (Rede Privada Conveniada)',
    cnpj: '03.882.110/0001-45',
    esfera: 'PRIVADA',
    areaFoco: 'SAUDE',
    cidade: 'Curitiba',
    estado: 'PR',
    responsavel: 'Dr. Roberto Silveira Filho',
    telefone: '(41) 3045-8000',
    email: 'educacao.corporativa@saolucas.com.br'
  },
  {
    id: 4,
    nome: 'Faculdade Integrada de Ensino e Saúde do Brasil (FIESB)',
    cnpj: '12.445.678/0001-22',
    esfera: 'PRIVADA',
    areaFoco: 'MISTA',
    cidade: 'Brasília',
    estado: 'DF',
    responsavel: 'Profa. Dra. Carmen Lúcia Viana',
    telefone: '(61) 3321-9900',
    email: 'extensao@fiesb.edu.br'
  }
];

// 3. PROFESSORES / CORPO DOCENTE
export const PROFESSORES_INICIAIS: Professor[] = [
  {
    id: 1,
    nome: 'Dra. Mariana Costa Pereira',
    cpf: '111.222.333-44',
    email: 'mariana.costa@efapp.edu.br',
    titulacao: 'DOUTOR',
    areaAtuacao: 'Saúde Coletiva, Epidemiologia e SUS',
    valorHoraAula: 160.00,
    chavePix: 'mariana.costa@efapp.edu.br'
  },
  {
    id: 2,
    nome: 'Prof. Dr. Ricardo Barros Albuquerque',
    cpf: '222.333.444-55',
    email: 'ricardo.barros@efapp.edu.br',
    titulacao: 'DOUTOR',
    areaAtuacao: 'Legislação Educacional, LDB e Gestão Democrática',
    valorHoraAula: 150.00,
    chavePix: '22233344455'
  },
  {
    id: 3,
    nome: 'Me. Fernanda Albuquerque Torres',
    cpf: '333.444.555-66',
    email: 'fernanda.albuquerque@efapp.edu.br',
    titulacao: 'MESTRE',
    areaAtuacao: 'Biossegurança, Controle de Infecções e Vigilância Sanitária',
    valorHoraAula: 135.00,
    chavePix: 'fernanda.torres@gmail.com'
  },
  {
    id: 4,
    nome: 'Esp. André Luiz de Souza',
    cpf: '444.555.666-77',
    email: 'andre.souza@efapp.edu.br',
    titulacao: 'ESPECIALISTA',
    areaAtuacao: 'Tecnologia Educacional e Metodologias Ativas',
    valorHoraAula: 120.00,
    chavePix: 'andre.souza.pix@gmail.com'
  }
];

// 4. CURSOS DA EFAPP COM AVALIAÇÃO DE 10 QUESTÕES E 1 HORA (60 MINUTOS)
export const CURSOS_INICIAIS: Curso[] = [
  {
    id: 1,
    nome: 'Fundamentos do SUS, Legislação Sanitária e Humanização',
    descricao: 'Capacitação completa para agentes públicos e privados da saúde sobre a doutrina do SUS, Lei Orgânica 8.080/90, acolhimento com classificação de risco e biossegurança ambulatorial.',
    modalidade: 'EAD',
    tipoCurso: 'TIPO1',
    segmento: 'SAUDE',
    cargaHorariaHoras: 40,
    notaMinimaAprovacao: 7.0,
    prazoProvaMinutos: 60,
    professorResponsavel: 'Dra. Mariana Costa Pereira',
    idProfessor: 1,
    instituicaoSede: 'Secretaria Municipal de Saúde (SMS - Polo Formador)',
    idInstituicao: 1,
    valorInscricao: 0.00,
    imagemUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    modulos: [
      {
        id: 101,
        ordem: 1,
        titulo: 'Módulo 1: Princípios Doutrinários e Organizativos do SUS',
        descricao: 'Universalidade, integralidade, equidade, descentralização e participação da comunidade.',
        videoaulas: [
          {
            id: 1001,
            titulo: 'Aula 1: A Lei 8.080 e os Marcos da Saúde no Brasil',
            duracaoMinutos: 24,
            urlVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resumo: 'Análise histórica da Reforma Sanitária brasileira, criação do SUS e divisão federativa de competências entre União, Estados e Municípios.'
          },
          {
            id: 1002,
            titulo: 'Aula 2: Redes de Atenção à Saúde (RAS) e Atenção Primária',
            duracaoMinutos: 30,
            urlVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resumo: 'A ordenação do cuidado pela Atenção Básica, fluxo de referência e contrarreferência no sistema de saúde.'
          }
        ],
        materiaisEscritos: [
          {
            id: 2001,
            titulo: 'Apostila Oficial: Guia do Agente no SUS Humanizado',
            tipo: 'APOSTILA',
            paginasEstimadas: 18,
            conteudoTexto: `DIRETRIZES DA POLÍTICA NACIONAL DE HUMANIZAÇÃO (HUMANIZASUS)

1. INTRODUÇÃO
O Sistema Único de Saúde (SUS) consagra em sua base a saúde como direito fundamental de todo cidadão e dever inalienável do Estado. A atuação dos agentes públicos e colaboradores privados credenciados deve observar os princípios da dignidade humana, do acolhimento resolutivo e da corresponsabilização no cuidado integral.

2. OS TRÊS PRINCÍPIOS DOUTRINÁRIOS FUNDAMENTAIS
- UNIVERSALIDADE: Todo e qualquer cidadão em território nacional tem direito irrevogável ao acesso aos serviços de saúde, sem exigência de qualquer contrapartida financeira ou cadastral excludente.
- INTEGRALIDADE: O indivíduo deve ser assistido em sua totalidade biopsicossocial, articulando ações preventivas, curativas e de reabilitação.
- EQUIDADE: Tratar desigualmente os desiguais, direcionando maiores esforços e recursos para as populações e comunidades em situação de maior vulnerabilidade social e sanitária.

3. PROTOCOLO DE ACOLHIMENTO E ESCUTA QUALIFICADA
O acolhimento não se restringe a uma triagem burocrática na recepção. Constitui postura ética e procedimento técnico onde todo agente deve escutar com atenção a queixa do usuário, classificar o grau de urgência sem julgamento moral e assegurar o encaminhamento responsável na rede assistencial.

4. DEVERES DO AGENTE PÚBLICO E PRIVADO CONVENIADO
- Manter o sigilo ético absoluto sobre prontuários e dados de saúde dos pacientes (LGPD na Saúde).
- Assegurar a transparência das filas reguladas e do agendamento de exames.
- Promover ações de combate à discriminação institucional nas unidades de atendimento.`
          },
          {
            id: 2002,
            titulo: 'Artigo Técnico: Biossegurança Básica e Notificação Compulsória',
            tipo: 'ARTIGO',
            paginasEstimadas: 12,
            conteudoTexto: `PROTOCOLOS DE BIOSSEGURANÇA E VIGILÂNCIA EPIDEMIOLÓGICA NO AMBIENTE DE TRABALHO

1. PRECAUÇÕES-PADRÃO NO ATENDIMENTO EM SAÚDE
Todo profissional atuante em unidades de saúde ou postos educacionais deve adotar rigorosamente as medidas preventivas universais:
a) Higienização constante das mãos com água e sabão líquido ou fricção com preparação alcoólica a 70%;
b) Uso de Equipamentos de Proteção Individual (EPIs): luvas de procedimento, máscara cirúrgica ou PFF2/N95 conforme indicação de risco de aerossóis;
c) Descarte correto de pérfuro-cortantes em caixas amarelas rígidas específicas, nunca ultrapassando o limite pontilhado de preenchimento.

2. DOENÇAS DE NOTIFICAÇÃO COMPULSÓRIA IMEDIATA
O agente que suspeitar de agravos de risco à saúde pública coletiva (ex: Meningites, Sarampo, Febre Amarela, Dengue com sinais de alarme) deve comunicar imediatamente a equipe de Vigilância Epidemiológica para início imediato das ações de bloqueio em até 24 horas.`
          }
        ]
      }
    ],
    avaliacao: {
      id: 501,
      idCurso: 1,
      titulo: 'Avaliação Final Oficial - Fundamentos do SUS (10 Questões)',
      instrucoes: 'Esta avaliação contém exatamente 10 questões de múltipla escolha com 4 alternativas cada. Você possui o prazo máximo estrito de 1 hora (60 minutos) para concluir e enviar o teste. A nota mínima para aprovação e emissão imediata do certificado é 7,0 (7 acertos).',
      tempoLimiteMinutos: 60,
      notaCorte: 7.0,
      questoes: [
        {
          id: 1,
          numero: 1,
          enunciado: 'Qual é o princípio doutrinário do SUS que preceitua que a saúde é direito de todos os cidadãos sem qualquer distinção ou discriminação?',
          opcoes: [
            { id: 11, letra: 'A', texto: 'Universalidade' },
            { id: 12, letra: 'B', texto: 'Descentralização' },
            { id: 13, letra: 'C', texto: 'Regionalização' },
            { id: 14, letra: 'D', texto: 'Hierarquização' }
          ],
          opcaoCorretaId: 11,
          justificativaPedagogica: 'A Universalidade assegura o acesso irrestrito a todos os cidadãos em território brasileiro.'
        },
        {
          id: 2,
          numero: 2,
          enunciado: 'Qual lei ordinária federal disciplina as condições para a promoção, proteção e recuperação da saúde, a organização e o funcionamento dos serviços no Brasil?',
          opcoes: [
            { id: 21, letra: 'A', texto: 'Lei Federal nº 9.394/96' },
            { id: 22, letra: 'B', texto: 'Lei Federal nº 8.080/90' },
            { id: 23, letra: 'C', texto: 'Lei Federal nº 8.666/93' },
            { id: 24, letra: 'D', texto: 'Lei Federal nº 14.133/21' }
          ],
          opcaoCorretaId: 22,
          justificativaPedagogica: 'A Lei nº 8.080/1990 é a Lei Orgânica da Saúde que organiza o SUS.'
        },
        {
          id: 3,
          numero: 3,
          enunciado: 'O princípio que busca reduzir as desigualdades sociais e regionais, oferecendo mais atenção a quem mais necessita, denomina-se:',
          opcoes: [
            { id: 31, letra: 'A', texto: 'Integralidade estrita' },
            { id: 32, letra: 'B', texto: 'Equidade' },
            { id: 33, letra: 'C', texto: 'Centralização de recursos' },
            { id: 34, letra: 'D', texto: 'Hierarquia orçamentária' }
          ],
          opcaoCorretaId: 32,
          justificativaPedagogica: 'A Equidade reconhece as diferenças de vulnerabilidade e distribui os cuidados proporcionalmente às necessidades.'
        },
        {
          id: 4,
          numero: 4,
          enunciado: 'A participação da comunidade na gestão do SUS é assegurada formalmente por meio de qual legislação complementar?',
          opcoes: [
            { id: 41, letra: 'A', texto: 'Lei Federal nº 8.142/90 através dos Conselhos e Conferências de Saúde' },
            { id: 42, letra: 'B', texto: 'Decreto Executivo 7.508 exclusivamente' },
            { id: 43, letra: 'C', texto: 'Portaria Municipal individual' },
            { id: 44, letra: 'D', texto: 'Norma Técnica da ANVISA sem consulta popular' }
          ],
          opcaoCorretaId: 41,
          justificativaPedagogica: 'A Lei nº 8.142/90 institui a participação popular paritária nos Conselhos e Conferências.'
        },
        {
          id: 5,
          numero: 5,
          enunciado: 'Na Política Nacional de Humanização (HumanizaSUS), o acolhimento nas unidades de saúde deve ser entendido como:',
          opcoes: [
            { id: 51, letra: 'A', texto: 'Um processo meramente burocrático de entrega de senhas numeradas' },
            { id: 52, letra: 'B', texto: 'Uma postura ética de escuta qualificada e corresponsabilidade no cuidado' },
            { id: 53, letra: 'C', texto: 'Uma triagem excludente para dispensar pacientes sem agravos urgentes' },
            { id: 54, letra: 'D', texto: 'Uma ação de competência exclusiva do corpo médico' }
          ],
          opcaoCorretaId: 52,
          justificativaPedagogica: 'O acolhimento é postura relacional e ética compartilhada por toda a equipe de saúde.'
        },
        {
          id: 6,
          numero: 6,
          enunciado: 'Qual é o nível de atenção responsável por ordenar as redes e resolver até 85% das demandas rotineiras da população?',
          opcoes: [
            { id: 61, letra: 'A', texto: 'Atenção Primária / Básica à Saúde (UBS e ESF)' },
            { id: 62, letra: 'B', texto: 'Atenção Terciária e Hospitais de Alta Complexidade' },
            { id: 63, letra: 'C', texto: 'Unidades de Tratamento Intensivo (UTI)' },
            { id: 64, letra: 'D', texto: 'Ambulatórios cirúrgicos de transplante' }
          ],
          opcaoCorretaId: 61,
          justificativaPedagogica: 'A Atenção Primária é a porta de entrada preferencial e ordenadora da Rede de Atenção à Saúde.'
        },
        {
          id: 7,
          numero: 7,
          enunciado: 'Em relação ao descarte de materiais perfurocortantes (agulhas, bisturis e ampolas), qual é a recomendação de biossegurança?',
          opcoes: [
            { id: 71, letra: 'A', texto: 'Devem ser reencapadas com as duas mãos antes de ir para o lixo comum' },
            { id: 72, letra: 'B', texto: 'Devem ser descartadas imediatamente sem reencapar em coletor rígido e resistente' },
            { id: 73, letra: 'C', texto: 'Devem ser lavadas e reutilizadas após secagem' },
            { id: 74, letra: 'D', texto: 'Devem ser colocadas em saco plástico preto hospitalar sem caixa' }
          ],
          opcaoCorretaId: 72,
          justificativaPedagogica: 'Nunca se deve reencapar agulhas usadas; o descarte direto no coletor rígido previne acidentes biológicos.'
        },
        {
          id: 8,
          numero: 8,
          enunciado: 'A notificação compulsória de doenças e agravos constitui instrumento essencial de qual área da saúde?',
          opcoes: [
            { id: 81, letra: 'A', texto: 'Vigilância Epidemiológica' },
            { id: 82, letra: 'B', texto: 'Setor de Almoxarifado Administrativo' },
            { id: 83, letra: 'C', texto: 'Gestão de Recursos Humanos apenas' },
            { id: 84, letra: 'D', texto: 'Contabilidade e Auditoria Fiscal' }
          ],
          opcaoCorretaId: 81,
          justificativaPedagogica: 'A notificação permite o monitoramento contínuo e o bloqueio de surtos epidemiológicos.'
        },
        {
          id: 9,
          numero: 9,
          enunciado: 'Qual diretriz assegura que o atendimento de saúde deve articular prevenção de doenças, promoção da saúde e tratamento curativo?',
          opcoes: [
            { id: 91, letra: 'A', texto: 'Integralidade da atenção' },
            { id: 92, letra: 'B', texto: 'Fragmentação departamental' },
            { id: 93, letra: 'C', texto: 'Monopólio farmacêutico' },
            { id: 94, letra: 'D', texto: 'Privatização dos leitos básicos' }
          ],
          opcaoCorretaId: 91,
          justificativaPedagogica: 'A Integralidade preconiza a visão completa do sujeito com ações integradas de prevenção e cura.'
        },
        {
          id: 10,
          numero: 10,
          enunciado: 'De acordo com a Lei Geral de Proteção de Dados (LGPD) e o sigilo profissional, dados relativos à saúde de pacientes são classificados como:',
          opcoes: [
            { id: 101, letra: 'A', texto: 'Dados públicos de livre divulgação nas redes sociais' },
            { id: 102, letra: 'B', texto: 'Dados pessoais sensíveis com regime especial de proteção e confidencialidade' },
            { id: 103, letra: 'C', texto: 'Informações comerciais para propaganda' },
            { id: 104, letra: 'D', texto: 'Dados descartáveis sem necessidade de segurança técnica' }
          ],
          opcaoCorretaId: 102,
          justificativaPedagogica: 'Dados de saúde e biométricos são dados sensíveis pela LGPD e exigem proteção técnica e sigilo absoluto.'
        }
      ]
    }
  },
  {
    id: 2,
    nome: 'Práticas Pedagógicas Inclusivas e Gestão Democrática na Educação Básica',
    descricao: 'Formação para professores e gestores educacionais públicos e privados com foco na LDB 9.394/96, Plano de Desenvolvimento Individual (PDI) e metodologias ativas para salas inclusivas.',
    modalidade: 'EAD',
    tipoCurso: 'TIPO1',
    segmento: 'EDUCACAO',
    cargaHorariaHoras: 40,
    notaMinimaAprovacao: 7.0,
    prazoProvaMinutos: 60,
    professorResponsavel: 'Prof. Dr. Ricardo Barros Albuquerque',
    idProfessor: 2,
    instituicaoSede: 'Secretaria de Estado de Educação de Minas Gerais',
    idInstituicao: 2,
    valorInscricao: 0.00,
    imagemUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    modulos: [
      {
        id: 102,
        ordem: 1,
        titulo: 'Módulo 1: Legislação Educacional e Inclusão Escolar',
        descricao: 'Diretrizes curriculares, atendimento educacional especializado (AEE) e papel dos conselhos escolares.',
        videoaulas: [
          {
            id: 1003,
            titulo: 'Aula 1: A LDB e o Direito Inalienável à Educação de Qualidade',
            duracaoMinutos: 28,
            urlVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resumo: 'Fundamentos constitucionais do ensino público e privado, dever da família e do Estado e garantia de padrões de qualidade.'
          }
        ],
        materiaisEscritos: [
          {
            id: 2003,
            titulo: 'Apostila: Desenho Universal para a Aprendizagem (DUA) na Prática',
            tipo: 'APOSTILA',
            paginasEstimadas: 22,
            conteudoTexto: `MANUAL DE INCLUSÃO E DESENHO UNIVERSAL PARA A APRENDIZAGEM (DUA)

1. MARCO LEGAL DA EDUCAÇÃO INCLUSIVA
A Lei Brasileira de Inclusão (Lei nº 13.146/2015) assegura sistema educacional inclusivo em todos os níveis e modalidades, bem como aprendizado ao longo de toda a vida. As instituições públicas e privadas têm o dever de oferecer atendimento educacional especializado (AEE) sem repasse de cobrança adicional aos responsáveis.

2. OS TRÊS PILARES DO DESENHO UNIVERSAL PARA A APRENDIZAGEM:
- Múltiplas formas de engajamento (o "porquê" do aprendizado);
- Múltiplas formas de representação do conteúdo (o "o quê" do aprendizado: visual, auditivo, cinestésico);
- Múltiplas formas de ação e expressão (o "como" o aluno demonstra seu conhecimento).

3. PLANO DE DESENVOLVIMENTO INDIVIDUALIZADO (PDI)
O PDI deve ser construído colaborativamente entre o professor regente, o professor do AEE e a equipe pedagógica, contemplando metas realistas, recursos de tecnologia assistiva e avaliações processuais contínuas.`
          }
        ]
      }
    ],
    avaliacao: {
      id: 502,
      idCurso: 2,
      titulo: 'Avaliação Final - Práticas Pedagógicas Inclusivas (10 Questões)',
      instrucoes: 'Prova com 10 questões de múltipla escolha. Duração máxima de 60 minutos (1 hora). Nota de corte: 7,0.',
      tempoLimiteMinutos: 60,
      notaCorte: 7.0,
      questoes: [
        {
          id: 1,
          numero: 1,
          enunciado: 'Segundo a Lei de Diretrizes e Bases da Educação Nacional (LDB nº 9.394/96), a educação básica é formada por quais etapas?',
          opcoes: [
            { id: 1, letra: 'A', texto: 'Educação Infantil, Ensino Fundamental e Ensino Médio' },
            { id: 2, letra: 'B', texto: 'Ensino Fundamental e Ensino Superior' },
            { id: 3, letra: 'C', texto: 'Apenas Ensino Médio e Técnico' },
            { id: 4, letra: 'D', texto: 'Educação Pré-escolar e Faculdade' }
          ],
          opcaoCorretaId: 1,
          justificativaPedagogica: 'A Educação Básica engloba a Educação Infantil, o Ensino Fundamental e o Ensino Médio.'
        },
        {
          id: 2,
          numero: 2,
          enunciado: 'A Lei Brasileira de Inclusão (Lei nº 13.146/2015) proíbe expressamente qual das seguintes condutas por escolas privadas?',
          opcoes: [
            { id: 5, letra: 'A', texto: 'Cobrança de valores adicionais em mensalidades para alunos com deficiência' },
            { id: 6, letra: 'B', texto: 'Criação de salas de recursos multifuncionais' },
            { id: 7, letra: 'C', texto: 'Contratação de profissionais de apoio escolar' },
            { id: 8, letra: 'D', texto: 'Elaboração de planos pedagógicos individualizados' }
          ],
          opcaoCorretaId: 5,
          justificativaPedagogica: 'É vedada qualquer taxa adicional ou sobretaxa nas mensalidades de alunos com deficiência.'
        },
        {
          id: 3,
          numero: 3,
          enunciado: 'O princípio da gestão democrática do ensino público nas escolas é exercido primordialmente por meio de:',
          opcoes: [
            { id: 9, letra: 'A', texto: 'Conselhos escolares com participação de pais, alunos, professores e funcionários' },
            { id: 10, letra: 'B', texto: 'Decisões monocráticas da diretoria sem consulta' },
            { id: 11, letra: 'C', texto: 'Votações secretas exclusivas da secretaria de finanças' },
            { id: 12, letra: 'D', texto: 'Sorteios aleatórios anuais' }
          ],
          opcaoCorretaId: 9,
          justificativaPedagogica: 'A gestão democrática baseia-se na atuação colegiada do Conselho Escolar e Grêmio Estudantil.'
        },
        {
          id: 4,
          numero: 4,
          enunciado: 'O Desenho Universal para a Aprendizagem (DUA) orienta os educadores a:',
          opcoes: [
            { id: 13, letra: 'A', texto: 'Oferecer múltiplas formas de apresentação, engajamento e expressão dos conteúdos' },
            { id: 14, letra: 'B', texto: 'Aplicar provas padronizadas exclusivamente escritas' },
            { id: 15, letra: 'C', texto: 'Segregar os estudantes em salas separadas de acordo com o ritmo' },
            { id: 16, letra: 'D', texto: 'Eliminar qualquer tipo de avaliação no ano letivo' }
          ],
          opcaoCorretaId: 13,
          justificativaPedagogica: 'O DUA visa tornar o currículo acessível desde a sua concepção para toda a diversidade de alunos.'
        },
        {
          id: 5,
          numero: 5,
          enunciado: 'O Atendimento Educacional Especializado (AEE) deve ocorrer prioritariamente:',
          opcoes: [
            { id: 17, letra: 'A', texto: 'No turno inverso ao da classe comum, em salas de recursos multifuncionais' },
            { id: 18, letra: 'B', texto: 'Em substituição total à matrícula no ensino regular' },
            { id: 19, letra: 'C', texto: 'Apenas nos finais de semana e feriados nacionais' },
            { id: 20, letra: 'D', texto: 'Exclusivamente por correspondência impressa' }
          ],
          opcaoCorretaId: 17,
          justificativaPedagogica: 'O AEE é complementar e suplementar, devendo ser ofertado no contraturno escolar.'
        },
        {
          id: 6,
          numero: 6,
          enunciado: 'O Projeto Político Pedagógico (PPP) de uma instituição de ensino representa:',
          opcoes: [
            { id: 21, letra: 'A', texto: 'A identidade, missão, metas pedagógicas e diretrizes formativas da comunidade escolar' },
            { id: 22, letra: 'B', texto: 'Uma planilha estritamente financeira para pagamento de contas de água' },
            { id: 23, letra: 'C', texto: 'Um formulário do departamento de trânsito' },
            { id: 24, letra: 'D', texto: 'A lista de compras do refeitório escolar' }
          ],
          opcaoCorretaId: 21,
          justificativaPedagogica: 'O PPP é o documento norteador da práxis educativa e social da escola.'
        },
        {
          id: 7,
          numero: 7,
          enunciado: 'A Base Nacional Comum Curricular (BNCC) estabelece:',
          opcoes: [
            { id: 25, letra: 'A', texto: 'As aprendizagens essenciais que todos os estudantes têm direito de desenvolver' },
            { id: 26, letra: 'B', texto: 'O modelo de uniforme obrigatório em todas as cidades' },
            { id: 27, letra: 'C', texto: 'O cardápio fixo da merenda de cada região' },
            { id: 28, letra: 'D', texto: 'A marca dos computadores a serem adquiridos' }
          ],
          opcaoCorretaId: 25,
          justificativaPedagogica: 'A BNCC define o conjunto orgânico e progressivo de competências e habilidades fundamentais.'
        },
        {
          id: 8,
          numero: 8,
          enunciado: 'O Plano de Desenvolvimento Individualizado (PDI) é uma ferramenta pedagógica que visa:',
          opcoes: [
            { id: 29, letra: 'A', texto: 'Mapear as potencialidades e planejar as adaptações curriculares necessárias ao estudante' },
            { id: 30, letra: 'B', texto: 'Punir comportamentos indisciplinados com suspensões' },
            { id: 31, letra: 'C', texto: 'Determinar a reprovação precoce no início do ano' },
            { id: 32, letra: 'D', texto: 'Cobrar taxas extras dos familiares' }
          ],
          opcaoCorretaId: 29,
          justificativaPedagogica: 'O PDI orienta a mediação docente personalizada para o sucesso do aluno com necessidades especiais.'
        },
        {
          id: 9,
          numero: 9,
          enunciado: 'A avaliação formativa e processual tem como objetivo central:',
          opcoes: [
            { id: 33, letra: 'A', texto: 'Identificar avanços e dificuldades para reorientar a prática pedagógica do professor' },
            { id: 34, letra: 'B', texto: 'Apenas classificar e ranquear os estudantes do melhor ao pior' },
            { id: 35, letra: 'C', texto: 'Atribuir notas punitivas para gerar medo nos educandos' },
            { id: 36, letra: 'D', texto: 'Dispensar o acompanhamento do plano de aula' }
          ],
          opcaoCorretaId: 33,
          justificativaPedagogica: 'A avaliação formativa é contínua e diagnóstica, subsidiando intervenções pedagógicas oportunas.'
        },
        {
          id: 10,
          numero: 10,
          enunciado: 'A mediação pedagógica em salas inclusivas requer do educador:',
          opcoes: [
            { id: 37, letra: 'A', texto: 'Sensibilidade, adaptação de recursos didáticos e crença na capacidade de aprender de todos' },
            { id: 38, letra: 'B', texto: 'Exclusão dos estudantes que não dominam a escrita no mesmo tempo dos demais' },
            { id: 39, letra: 'C', texto: 'Aplicação mecânica de exercícios repetitivos sem reflexão' },
            { id: 40, letra: 'D', texto: 'Transferência de toda a responsabilidade de ensino para a família' }
          ],
          opcaoCorretaId: 37,
          justificativaPedagogica: 'A mediação humanizada e inclusiva parte do princípio de que todos os alunos são capazes de aprender.'
        }
      ]
    }
  },
  {
    id: 3,
    nome: 'Vigilância Epidemiológica Avançada e Gestão Hospitalar de Crises',
    descricao: 'Curso especializado para agentes do TIPO2: análise de dados epidemiológicos do SINAN/SIM, contenção de surtos hospitalares, protocolos de isolamento e plano de contingência.',
    modalidade: 'EAD',
    tipoCurso: 'TIPO2',
    segmento: 'SAUDE',
    cargaHorariaHoras: 80,
    notaMinimaAprovacao: 7.0,
    prazoProvaMinutos: 60,
    professorResponsavel: 'Me. Fernanda Albuquerque Torres',
    idProfessor: 3,
    instituicaoSede: 'Hospital e Maternidade São Lucas (Rede Privada Conveniada)',
    idInstituicao: 3,
    valorInscricao: 199.00,
    imagemUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    modulos: [
      {
        id: 103,
        ordem: 1,
        titulo: 'Módulo 1: Gestão de Crises Sanitárias e Indicadores de Saúde',
        descricao: 'Investigação de surtos, isolamento por contato/gotículas e comitês de infecção hospitalar (CCIH).',
        videoaulas: [
          {
            id: 1004,
            titulo: 'Aula 1: Indicadores Críticos e Cadeia de Transmissão Hospitalar',
            duracaoMinutos: 35,
            urlVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resumo: 'Cálculo de taxas de ataque, índice de letalidade, R0 e manejo rápido de isolamento microbiológico.'
          }
        ],
        materiaisEscritos: [
          {
            id: 2004,
            titulo: 'Manual de Contingência Hospitalar e Segurança do Paciente',
            tipo: 'APOSTILA',
            paginasEstimadas: 30,
            conteudoTexto: `PROTOCOLOS DE CONTINGÊNCIA HOSPITALAR E GESTÃO DE LEITOS (TIPO 2)

1. COMISSÃO DE CONTROLE DE INFECÇÃO HOSPITALAR (CCIH)
Toda unidade hospitalar pública ou privada com mais de 30 leitos deve estruturar Serviço de Controle de Infecção Hospitalar (SCIH) ativo, responsável pela busca ativa de germes multirresistentes, auditoria de uso racional de antimicrobianos e vigilância pós-alta.

2. FLUXO DE ISOLAMENTO E PRECAUÇÕES ESPECIAIS:
- Precauções por Contato: leito privativo ou coorte, luvas e avental obrigatórios antes do contato com paciente ou fômites.
- Precauções por Gotículas: máscara cirúrgica pelo profissional ao entrar a menos de 1 metro do paciente; máscara no paciente durante transporte.
- Precauções por Aerossóis: uso indispensável de respirador PFF2/N95 com ajuste facial hermético, quarto com pressão negativa e filtro HEPA.

3. VIGILÂNCIA DE EVENTOS ADVERSOS E NOTIFICAÇÃO AO NOTIVISA
A cultura de segurança do paciente prioriza a notificação não-punitiva de quase-falhas (near miss), incidentes sem dano e eventos sentinela para redesenho sistêmico dos processos assistenciais.`
          }
        ]
      }
    ],
    avaliacao: {
      id: 503,
      idCurso: 3,
      titulo: 'Avaliação Técnica Especializada - Vigilância Hospitalar (10 Questões)',
      instrucoes: 'Avaliação exclusiva para o perfil TIPO2 com 10 questões técnicas. Prazo de 60 minutos.',
      tempoLimiteMinutos: 60,
      notaCorte: 7.0,
      questoes: [
        {
          id: 1,
          numero: 1,
          enunciado: 'Qual indicador quantitativo mede a gravidade de uma doença relacionando o número de óbitos pelo número de pessoas doentes?',
          opcoes: [
            { id: 1, letra: 'A', texto: 'Taxa de Letalidade' },
            { id: 2, letra: 'B', texto: 'Taxa de Incidência' },
            { id: 3, letra: 'C', texto: 'Taxa de Prevalência' },
            { id: 4, letra: 'D', texto: 'Taxa de Natalidade' }
          ],
          opcaoCorretaId: 1,
          justificativaPedagogica: 'A letalidade calcula a proporção de mortes entre os indivíduos acometidos pelo agravo.'
        },
        {
          id: 2,
          numero: 2,
          enunciado: 'Para pacientes com tuberculose pulmonar bacilífera ou sarampo, qual precaução deve ser adotada rigorosamente?',
          opcoes: [
            { id: 5, letra: 'A', texto: 'Precaução para aerossóis com máscara PFF2/N95 e quarto com pressão negativa' },
            { id: 6, letra: 'B', texto: 'Apenas luvas de procedimento simples' },
            { id: 7, letra: 'C', texto: 'Nenhuma medida especial além de ventilação natural comum' },
            { id: 8, letra: 'D', texto: 'Precaução alimentar sem barreira respiratória' }
          ],
          opcaoCorretaId: 5,
          justificativaPedagogica: 'Patógenos transmitidos por aerossóis exigem filtragem de alta eficiência (PFF2) e pressão negativa.'
        },
        {
          id: 3,
          numero: 3,
          enunciado: 'A notificação de eventos adversos graves em serviços de saúde públicos e privados no Brasil é efetuada no sistema:',
          opcoes: [
            { id: 9, letra: 'A', texto: 'NOTIVISA / ANVISA' },
            { id: 10, letra: 'B', texto: 'ReceitaNet' },
            { id: 11, letra: 'C', texto: 'SICONV' },
            { id: 12, letra: 'D', texto: 'CADÚNICO' }
          ],
          opcaoCorretaId: 9,
          justificativaPedagogica: 'O Notivisa é o sistema nacional de notificação para a vigilância sanitária.'
        },
        {
          id: 4,
          numero: 4,
          enunciado: 'A técnica dos "Cinco Momentos para a Higiene das Mãos" da Organização Mundial da Saúde (OMS) inclui:',
          opcoes: [
            { id: 13, letra: 'A', texto: 'Antes de tocar o paciente, antes de procedimento limpo/asséptico e após tocar o paciente' },
            { id: 14, letra: 'B', texto: 'Apenas no início e término do plantão de 12 horas' },
            { id: 15, letra: 'C', texto: 'Exclusivamente após o almoço no refeitório' },
            { id: 16, letra: 'D', texto: 'Apenas quando as mãos estiverem visivelmente sujas com sangue' }
          ],
          opcaoCorretaId: 13,
          justificativaPedagogica: 'Os 5 momentos cobrem antes/depois do paciente, procedimentos assépticos e contato com fômites.'
        },
        {
          id: 5,
          numero: 5,
          enunciado: 'O que caracteriza um evento classificado como "Near Miss" (Quase-falha)?',
          opcoes: [
            { id: 17, letra: 'A', texto: 'Um incidente que não atingiu o paciente devido a uma barreira ou interceptação a tempo' },
            { id: 18, letra: 'B', texto: 'Um evento que resultou em óbito inevitável' },
            { id: 19, letra: 'C', texto: 'Uma cirurgia eletiva cancelada por falta de energia' },
            { id: 20, letra: 'D', texto: 'Uma reclamação na ouvidoria sobre a comida' }
          ],
          opcaoCorretaId: 17,
          justificativaPedagogica: 'O Near Miss é uma falha potencial interceptada antes de produzir dano ao paciente.'
        },
        {
          id: 6,
          numero: 6,
          enunciado: 'Na gestão de leitos hospitalares, o conceito de "Lean Healthcare" foca em:',
          opcoes: [
            { id: 21, letra: 'A', texto: 'Redução de desperdícios, otimização de fluxos e diminuição do tempo de internação desnecessário' },
            { id: 22, letra: 'B', texto: 'Aumento do custo com mais burocracia em papel' },
            { id: 23, letra: 'C', texto: 'Cobrança antecipada em dinheiro vivo' },
            { id: 24, letra: 'D', texto: 'Substituição de todos os médicos por atendentes virtuais' }
          ],
          opcaoCorretaId: 21,
          justificativaPedagogica: 'A metodologia Lean elimina gargalos e maximiza o valor assistencial direto ao paciente.'
        },
        {
          id: 7,
          numero: 7,
          enunciado: 'A busca ativa de infecções hospitalares realizada pela CCIH consiste em:',
          opcoes: [
            { id: 25, letra: 'A', texto: 'Visitas técnicas diárias nos setores, análise de prontuários e culturas laboratoriais' },
            { id: 26, letra: 'B', texto: 'Esperar telefonema do paciente após 6 meses da alta' },
            { id: 27, letra: 'C', texto: 'Fiscalização de recibos de estacionamento' },
            { id: 28, letra: 'D', texto: 'Pesquisa de opinião sobre o uniforme dos enfermeiros' }
          ],
          opcaoCorretaId: 25,
          justificativaPedagogica: 'A busca ativa identifica infecções precocemente através de dados clínicos e microbiológicos.'
        },
        {
          id: 8,
          numero: 8,
          enunciado: 'Um surto hospitalar por bactéria produtora de carbapenemase (KPC) requer como conduta prioritária:',
          opcoes: [
            { id: 29, letra: 'A', texto: 'Isolamento de contato estrito, coorte de pacientes e reforço na desinfecção ambiental' },
            { id: 30, letra: 'B', texto: 'Transferência imediata de todos os pacientes para outro hospital sem aviso' },
            { id: 31, letra: 'C', texto: 'Ocultação do caso para evitar alarme na mídia' },
            { id: 32, letra: 'D', texto: 'Administração indiscriminada de antibióticos a toda a equipe' }
          ],
          opcaoCorretaId: 29,
          justificativaPedagogica: 'Contenção rigorosa de contato e higienização são essenciais para bloquear bactérias resistentes.'
        },
        {
          id: 9,
          numero: 9,
          enunciado: 'O plano de contingência hospitalar para catástrofes ou desastres em massa deve definir previamente:',
          opcoes: [
            { id: 33, letra: 'A', texto: 'Cadeia de comando, triagem START, expansão de leitos e comunicação institucional' },
            { id: 34, letra: 'B', texto: 'Aumento imediato de salários durante a crise' },
            { id: 35, letra: 'C', texto: 'Fechamento dos portões para não atender feridos' },
            { id: 36, letra: 'D', texto: 'Venda de medicamentos excedentes no varejo' }
          ],
          opcaoCorretaId: 33,
          justificativaPedagogica: 'O plano de contingência organiza triagem ágil e mobilização coordenada de recursos vitais.'
        },
        {
          id: 10,
          numero: 10,
          enunciado: 'A taxa de ocupação ideal recomendada para leitos hospitalares de emergência e UTI, a fim de evitar sobrecarga sistêmica, situa-se em torno de:',
          opcoes: [
            { id: 37, letra: 'A', texto: '75% a 85%' },
            { id: 38, letra: 'B', texto: '100% permanente sem reserva' },
            { id: 39, letra: 'C', texto: '20% apenas' },
            { id: 40, letra: 'D', texto: '99% com pacientes no corredor' }
          ],
          opcaoCorretaId: 37,
          justificativaPedagogica: 'A faixa de 75-85% permite absorver picos de demanda sem colapsar a segurança do cuidado.'
        }
      ]
    }
  },
  {
    id: 4,
    nome: 'Gestão Financeira, Prestação de Contas no FUNDEB e Auditoria na Educação',
    descricao: 'Capacitação presencial/híbrida para gestores escolares (TIPO2): cálculo da complementação VAAT/VAAF, controle social pelo CACS-FUNDEB e regras de piso salarial.',
    modalidade: 'PRESENCIAL',
    tipoCurso: 'TIPO2',
    segmento: 'EDUCACAO',
    cargaHorariaHoras: 60,
    notaMinimaAprovacao: 7.0,
    prazoProvaMinutos: 60,
    professorResponsavel: 'Prof. Dr. Ricardo Barros Albuquerque',
    idProfessor: 2,
    instituicaoSede: 'Faculdade Integrada de Ensino e Saúde do Brasil (FIESB)',
    idInstituicao: 4,
    valorInscricao: 250.00,
    imagemUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    modulos: [
      {
        id: 104,
        ordem: 1,
        titulo: 'Módulo 1: O Novo FUNDEB Permanente e a Lei 14.113/2020',
        descricao: 'Subvinculação de 70% para profissionais da educação, prestação de contas no SIOPE e fiscalização do Tribunal de Contas.',
        videoaulas: [
          {
            id: 1005,
            titulo: 'Aula 1: Estrutura do Novo Fundeb e Indicadores de Equidade',
            duracaoMinutos: 40,
            urlVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
            resumo: 'Detalhamento do VAAF, VAAT e VAAR, metas educacionais e responsabilidade dos ordenadores de despesa.'
          }
        ],
        materiaisEscritos: [
          {
            id: 2005,
            titulo: 'Apostila de Prestação de Contas do FUNDEB e Gestão Contábil',
            tipo: 'APOSTILA',
            paginasEstimadas: 26,
            conteudoTexto: `MANUAL DE APLICAÇÃO E FISCALIZAÇÃO DO FUNDEB (TIPO 2)

1. SUBVINCULAÇÃO OBRIGATÓRIA DE 70%
Conforme a Emenda Constitucional nº 108/2020 e a Lei nº 14.113/2020, no mínimo 70% dos recursos totais anuais do FUNDEB devem ser destinados à remuneração dos profissionais da educação básica em efetivo exercício.

2. CONTROLE SOCIAL PELO CACS-FUNDEB
O Conselho de Acompanhamento e Controle Social do FUNDEB atua como órgão colegiado autônomo com prerrogativa de emitir parecer conclusivo sobre as prestações de contas municipais e estaduais no sistema SIOPE do MEC/FNDE.

3. DESPESAS VEDADAS COM RECURSOS DO FUNDEB:
- Merenda escolar (custeada com recursos do PNAE);
- Transporte de estudantes que não pertençam à rede básica pública sem convênio específico;
- Obras e reformas que não atendam à educação básica.`
          }
        ]
      }
    ],
    avaliacao: {
      id: 504,
      idCurso: 4,
      titulo: 'Avaliação Presencial/EAD - Legislação do FUNDEB (10 Questões)',
      instrucoes: 'Prova com 10 questões de múltipla escolha com prazo limite de 60 minutos (1 hora).',
      tempoLimiteMinutos: 60,
      notaCorte: 7.0,
      questoes: [
        {
          id: 1,
          numero: 1,
          enunciado: 'Qual é a porcentagem mínima obrigatória de aplicação dos recursos anuais do FUNDEB no pagamento dos profissionais da educação básica em efetivo exercício?',
          opcoes: [
            { id: 1, letra: 'A', texto: '70% (setenta por cento)' },
            { id: 2, letra: 'B', texto: '50% (cinquenta por cento)' },
            { id: 3, letra: 'C', texto: '25% (vinte e cinco por cento)' },
            { id: 4, letra: 'D', texto: '100% de forma irrestrita' }
          ],
          opcaoCorretaId: 1,
          justificativaPedagogica: 'O artigo 26 da Lei 14.113/2020 fixou o piso mínimo de 70% para remuneração dos profissionais da educação.'
        },
        {
          id: 2,
          numero: 2,
          enunciado: 'Qual sistema informatizado do FNDE/MEC é obrigatório para a inserção e declaração dos dados orçamentários de saúde e educação pelos entes federados?',
          opcoes: [
            { id: 5, letra: 'A', texto: 'SIOPE (Sistema de Informações sobre Orçamentos Públicos em Educação)' },
            { id: 6, letra: 'B', texto: 'DETRAN Net' },
            { id: 7, letra: 'C', texto: 'SISVAN' },
            { id: 8, letra: 'D', texto: 'SEFAZ Balanço Rápido' }
          ],
          opcaoCorretaId: 5,
          justificativaPedagogica: 'O SIOPE é o sistema público oficial de coleta e processamento das receitas e despesas em educação.'
        },
        {
          id: 3,
          numero: 3,
          enunciado: 'Qual das seguintes despesas NÃO pode ser paga com recursos do FUNDEB?',
          opcoes: [
            { id: 9, letra: 'A', texto: 'Merenda e alimentação escolar dos alunos (custeada com recursos do PNAE)' },
            { id: 10, letra: 'B', texto: 'Salário dos professores em efetivo exercício' },
            { id: 11, letra: 'C', texto: 'Formação continuada do quadro pedagógico' },
            { id: 12, letra: 'D', texto: 'Aquisição de material didático escolar' }
          ],
          opcaoCorretaId: 9,
          justificativaPedagogica: 'A alimentação escolar possui fonte orçamentária própria pelo PNAE e não é admitida no FUNDEB.'
        },
        {
          id: 4,
          numero: 4,
          enunciado: 'O conselho responsável por fiscalizar in loco a aplicação dos recursos do FUNDEB no município ou estado é o:',
          opcoes: [
            { id: 13, letra: 'A', texto: 'CACS-FUNDEB' },
            { id: 14, letra: 'B', texto: 'CONANDA' },
            { id: 15, letra: 'C', texto: 'CREA' },
            { id: 16, letra: 'D', texto: 'PROCON' }
          ],
          opcaoCorretaId: 13,
          justificativaPedagogica: 'O CACS-FUNDEB é a instância de controle social encarregada de acompanhar a distribuição dos recursos.'
        },
        {
          id: 5,
          numero: 5,
          enunciado: 'A complementação da União denominada VAAT no Novo FUNDEB tem como finalidade principal:',
          opcoes: [
            { id: 17, letra: 'A', texto: 'Valor Aluno Ano Total, reduzindo a desigualdade entre redes municipais mais pobres' },
            { id: 18, letra: 'B', texto: 'Comprar veículos de passeio para prefeitos' },
            { id: 19, letra: 'C', texto: 'Financiar faculdades privadas no exterior' },
            { id: 20, letra: 'D', texto: 'Custear juros bancários da dívida externa' }
          ],
          opcaoCorretaId: 17,
          justificativaPedagogica: 'O VAAT considera a capacidade financeira global do ente federado para direcionar socorro aos mais vulneráveis.'
        },
        {
          id: 6,
          numero: 6,
          enunciado: 'No conceito de "profissionais da educação básica em efetivo exercício" para fins do cômputo dos 70%, incluem-se:',
          opcoes: [
            { id: 21, letra: 'A', texto: 'Professores, pedagogos, diretores, coordenadores e profissionais de apoio técnico e administrativo na escola' },
            { id: 22, letra: 'B', texto: 'Apenas os motoristas de caminhão da prefeitura' },
            { id: 23, letra: 'C', texto: 'Servidores aposentados há mais de 10 anos' },
            { id: 24, letra: 'D', texto: 'Assessores de comunicação da câmara de vereadores' }
          ],
          opcaoCorretaId: 21,
          justificativaPedagogica: 'A Lei do Novo Fundeb ampliou o conceito para abranger todo o corpo escolar que atua diretamente nas unidades.'
        },
        {
          id: 7,
          numero: 7,
          enunciado: 'Se o município não atingir os 70% mínimos do FUNDEB na remuneração dos profissionais até o encerramento do exercício, a prática recomendada é:',
          opcoes: [
            { id: 25, letra: 'A', texto: 'Concessão de abono salarial aos profissionais em efetivo exercício após autorização legal' },
            { id: 26, letra: 'B', texto: 'Devolução do dinheiro para contas secretas' },
            { id: 27, letra: 'C', texto: 'Transferência do saldo para asfaltamento de vias urbanas' },
            { id: 28, letra: 'D', texto: 'Ignorar a regra sem prestar contas ao Tribunal de Contas' }
          ],
          opcaoCorretaId: 25,
          justificativaPedagogica: 'O abono salarial é mecanismo legalmente aceito para cumprir a subvinculação constitucional de 70%.'
        },
        {
          id: 8,
          numero: 8,
          enunciado: 'O Piso Salarial Profissional Nacional para os profissionais do magistério público da educação básica é assegurado por:',
          opcoes: [
            { id: 29, letra: 'A', texto: 'Lei Federal nº 11.738/2008' },
            { id: 30, letra: 'B', texto: 'Estatuto de clubes de futebol' },
            { id: 31, letra: 'C', texto: 'Portaria de sindicato internacional' },
            { id: 32, letra: 'D', texto: 'Código Tributário Nacional apenas' }
          ],
          opcaoCorretaId: 29,
          justificativaPedagogica: 'A Lei 11.738/2008 instituiu o piso nacional para a jornada máxima de 40 horas semanais.'
        },
        {
          id: 9,
          numero: 9,
          enunciado: 'Qual percentual da jornada semanal de trabalho do professor do magistério público deve ser reservado para atividades extraclasse (planejamento, correção de provas e estudos)?',
          opcoes: [
            { id: 33, letra: 'A', texto: 'No mínimo 1/3 (um terço) da carga horária semanal' },
            { id: 34, letra: 'B', texto: 'Apenas 5 minutos por semana' },
            { id: 35, letra: 'C', texto: 'Nenhum tempo, toda a jornada deve ser com alunos' },
            { id: 36, letra: 'D', texto: 'Metade do ano letivo de férias' }
          ],
          opcaoCorretaId: 33,
          justificativaPedagogica: 'A Lei do Piso do Magistério estabeleceu o limite máximo de 2/3 da carga horária para interação com educandos, reservando 1/3 para extraclasse.'
        },
        {
          id: 10,
          numero: 10,
          enunciado: 'O parecer emitido anualmente pelo CACS-FUNDEB sobre a prestação de contas deve ser encaminhado para:',
          opcoes: [
            { id: 37, letra: 'A', texto: 'O Tribunal de Contas do Estado/Município e inserido no sistema SIOPE' },
            { id: 38, letra: 'B', texto: 'Guardado em sigilo trancado na gaveta do prefeito' },
            { id: 39, letra: 'C', texto: 'Enviado para a associação de moradores apenas' },
            { id: 40, letra: 'D', texto: 'Descartado após 24 horas' }
          ],
          opcaoCorretaId: 37,
          justificativaPedagogica: 'O parecer do CACS tem força jurídica para subsidiar o julgamento das contas pelos Tribunais de Contas.'
        }
      ]
    }
  }
];

// 5. PRODUTOS DA LOJA VIRTUAL EFAPP (TIPO1, TIPO2 E GERAL)
export const PRODUTOS_INICIAIS: ProdutoLoja[] = [
  {
    id: 1,
    tipoProduto: 'TIPO1',
    nome: 'Manual Prático do Agente Comunitário de Saúde (Edição 2026)',
    categoria: 'LIVRO',
    segmento: 'SAUDE',
    descricao: 'Guia institucional indispensável com fluxogramas de visitas domiciliares, sinais de alerta de urgência e caderneta da família.',
    preco: 45.00,
    estoque: 140,
    imagemUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    destaque: true
  },
  {
    id: 2,
    tipoProduto: 'TIPO1',
    nome: 'Vade Mecum da Legislação Educacional e do SUS Comentado',
    categoria: 'LIVRO',
    segmento: 'EDUCACAO',
    descricao: 'Compilação integral da Lei 8.080/90, LDB 9.394/96, Estatuto da Criança e do Adolescente (ECA) e jurisprudência dos Tribunais.',
    preco: 79.90,
    estoque: 85,
    imagemUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    destaque: true
  },
  {
    id: 3,
    tipoProduto: 'TIPO1',
    nome: 'Caderno de Questões Comentadas: Concursos Públicos em Saúde',
    categoria: 'APOSTILA',
    segmento: 'SAUDE',
    descricao: 'Mais de 600 questões resolvidas e fundamentadas por mestres e doutores da EFAPP com foco em bancas de concursos.',
    preco: 38.00,
    estoque: 210,
    imagemUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    tipoProduto: 'TIPO2',
    nome: 'Software EFAPP-Care: Gestão de Prontuários e Triagem em Saúde (Licença Anual)',
    categoria: 'SOFTWARE',
    segmento: 'SAUDE',
    descricao: 'Sistema em nuvem de alta segurança para unidades públicas e clínicas privadas com módulo de agendamento e indicadores do Previne Brasil.',
    preco: 399.00,
    estoque: 50,
    imagemUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    destaque: true
  },
  {
    id: 5,
    tipoProduto: 'TIPO2',
    nome: 'Maleta Diagnóstica de Avaliação Neuropsicopedagógica Institucional',
    categoria: 'KIT_PRATICO',
    segmento: 'EDUCACAO',
    descricao: 'Kit completo com instrumentos de triagem cognitiva, escala de rastreio de TDAH/Dislexia e fichas de intervenção pedagógica.',
    preco: 280.00,
    estoque: 35,
    imagemUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 6,
    tipoProduto: 'TIPO2',
    nome: 'Plataforma de Simulação de Auditoria e Prestação de Contas FUNDEB',
    categoria: 'SOFTWARE',
    segmento: 'EDUCACAO',
    descricao: 'Ferramenta para cálculo automatizado de coeficientes de remuneração docente, folha de pagamento e conciliação com o SIOPE.',
    preco: 420.00,
    estoque: 40,
    imagemUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 7,
    tipoProduto: 'GERAL',
    nome: 'Jaleco Institucional EFAPP de Alta Proteção Antibacteriana',
    categoria: 'KIT_PRATICO',
    segmento: 'SAUDE',
    descricao: 'Confeccionado em microfibra tecnológica repelente a fluidos corporais, com brasão bordado em alta definição.',
    preco: 89.90,
    estoque: 120,
    imagemUrl: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80'
  }
];

// 6. CRONOGRAMAS E CALENDÁRIOS DE CURSOS (GERIDO PELO TIPO5)
export const CRONOGRAMAS_INICIAIS: CronogramaCurso[] = [
  {
    id: 1,
    idCurso: 1,
    nomeCurso: 'Fundamentos do SUS, Legislação Sanitária e Humanização',
    idInstituicao: 1,
    nomeInstituicao: 'Secretaria Municipal de Saúde (SMS - Polo Formador)',
    idProfessor: 1,
    nomeProfessor: 'Dra. Mariana Costa Pereira',
    dataInicio: '2026-10-01',
    dataTermino: '2026-11-15',
    horarioInicio: '19:00',
    horarioTermino: '21:30',
    diasSemana: 'Terças e Quintas-feiras',
    salaLocal: 'Ambiente Virtual EFAPP (Sala EAD 01)',
    vagasTotais: 150,
    vagasOcupadas: 118,
    status: 'EM_ANDAMENTO'
  },
  {
    id: 2,
    idCurso: 2,
    nomeCurso: 'Práticas Pedagógicas Inclusivas e Gestão Democrática',
    idInstituicao: 2,
    nomeInstituicao: 'Secretaria de Estado de Educação de Minas Gerais',
    idProfessor: 2,
    nomeProfessor: 'Prof. Dr. Ricardo Barros Albuquerque',
    dataInicio: '2026-10-10',
    dataTermino: '2026-11-20',
    horarioInicio: '14:00',
    horarioTermino: '17:00',
    diasSemana: 'Segundas e Quartas-feiras',
    salaLocal: 'Auditório Magno / Transmissão EAD',
    vagasTotais: 100,
    vagasOcupadas: 84,
    status: 'EM_ANDAMENTO'
  },
  {
    id: 3,
    idCurso: 4,
    nomeCurso: 'Gestão Financeira e Prestação de Contas no FUNDEB',
    idInstituicao: 4,
    nomeInstituicao: 'Faculdade Integrada de Ensino e Saúde do Brasil (FIESB)',
    idProfessor: 2,
    nomeProfessor: 'Prof. Dr. Ricardo Barros Albuquerque',
    dataInicio: '2026-11-01',
    dataTermino: '2026-12-10',
    horarioInicio: '08:30',
    horarioTermino: '12:30',
    diasSemana: 'Sábados (Aulas Presenciais)',
    salaLocal: 'Polo Presencial FIESB - Bloco C, Sala 302',
    vagasTotais: 45,
    vagasOcupadas: 32,
    status: 'ABERTA'
  }
];

// 7. ESCALA DE PROFESSORES PARA AS AULAS (GERIDA PELO TIPO5)
export const ESCALAS_INICIAIS: EscalaProfessor[] = [
  {
    id: 1,
    idProfessor: 1,
    nomeProfessor: 'Dra. Mariana Costa Pereira',
    idCurso: 1,
    nomeCurso: 'Fundamentos do SUS e Humanização',
    idInstituicao: 1,
    nomeInstituicao: 'Secretaria Municipal de Saúde (SMS - Polo Formador)',
    dataAula: '2026-10-22',
    horaInicio: '19:00',
    horaFim: '21:30',
    totalHoras: 2.5,
    temaAula: 'Acolhimento com Classificação de Risco na Atenção Básica',
    status: 'AGENDADA'
  },
  {
    id: 2,
    idProfessor: 2,
    nomeProfessor: 'Prof. Dr. Ricardo Barros Albuquerque',
    idCurso: 2,
    nomeCurso: 'Práticas Pedagógicas Inclusivas',
    idInstituicao: 2,
    nomeInstituicao: 'Secretaria de Estado de Educação de Minas Gerais',
    dataAula: '2026-10-24',
    horaInicio: '14:00',
    horaFim: '17:00',
    totalHoras: 3.0,
    temaAula: 'Desenho Universal para Aprendizagem e Recursos Assistivos',
    status: 'AGENDADA'
  },
  {
    id: 3,
    idProfessor: 3,
    nomeProfessor: 'Me. Fernanda Albuquerque Torres',
    idCurso: 3,
    nomeCurso: 'Vigilância Epidemiológica Avançada',
    idInstituicao: 3,
    nomeInstituicao: 'Hospital e Maternidade São Lucas',
    dataAula: '2026-10-25',
    horaInicio: '09:00',
    horaFim: '12:00',
    totalHoras: 3.0,
    temaAula: 'Manejo Clínico de Patógenos Multirresistentes em UTI',
    status: 'AGENDADA'
  },
  {
    id: 4,
    idProfessor: 1,
    nomeProfessor: 'Dra. Mariana Costa Pereira',
    idCurso: 1,
    nomeCurso: 'Fundamentos do SUS e Humanização',
    idInstituicao: 1,
    nomeInstituicao: 'Secretaria Municipal de Saúde',
    dataAula: '2026-10-15',
    horaInicio: '19:00',
    horaFim: '21:30',
    totalHoras: 2.5,
    temaAula: 'Marcos Legais da Reforma Sanitária no Brasil',
    status: 'MINISTRADA'
  }
];

// 8. LANÇAMENTOS FINANCEIROS (DESPESAS FIXAS/VARIÁVEIS E RECEITAS DA LOJA/CURSOS)
export const LANCAMENTOS_INICIAIS: LancamentoFinanceiro[] = [
  {
    id: 1,
    tipoOperacao: 'RECEITA',
    subcategoria: 'VENDA_LOJA',
    descricao: 'Vendas acumuladas na loja online de livros e kits didáticos',
    valor: 8740.00,
    dataCompetencia: '2026-10-10',
    dataPagamento: '2026-10-10',
    status: 'PAGO'
  },
  {
    id: 2,
    tipoOperacao: 'RECEITA',
    subcategoria: 'INSCRICAO_CURSOS',
    descricao: 'Inscrições no curso de Gestão do FUNDEB e Vigilância',
    valor: 14250.00,
    dataCompetencia: '2026-10-08',
    dataPagamento: '2026-10-08',
    status: 'PAGO'
  },
  {
    id: 3,
    tipoOperacao: 'DESPESA',
    categoriaDespesa: 'FIXA',
    subcategoria: 'SERVIDORES_TI',
    descricao: 'Servidores de nuvem para streaming seguro e proteção anticópia',
    valor: 2150.00,
    dataCompetencia: '2026-10-05',
    dataPagamento: '2026-10-05',
    status: 'PAGO'
  },
  {
    id: 4,
    tipoOperacao: 'DESPESA',
    categoriaDespesa: 'FIXA',
    subcategoria: 'ALUGUEL_POLO',
    descricao: 'Aluguel e manutenção do polo presencial de capacitação',
    valor: 4500.00,
    dataCompetencia: '2026-10-05',
    dataPagamento: '2026-10-05',
    status: 'PAGO'
  },
  {
    id: 5,
    tipoOperacao: 'DESPESA',
    categoriaDespesa: 'VARIAVEL',
    subcategoria: 'IMPRESSAO_GRAFICA',
    descricao: 'Produção gráfica de apostilas, crachás e manuais da loja',
    valor: 1980.00,
    dataCompetencia: '2026-10-12',
    dataPagamento: '2026-10-12',
    status: 'PAGO'
  },
  {
    id: 6,
    tipoOperacao: 'DESPESA',
    categoriaDespesa: 'VARIAVEL',
    subcategoria: 'HONORARIOS_PROFESSORES',
    descricao: 'Honorários docentes das aulas ministradas na quinzena',
    valor: 5400.00,
    dataCompetencia: '2026-10-15',
    dataPagamento: '2026-10-15',
    status: 'PAGO'
  }
];

// 9. CERTIFICADOS EMITIDOS INICIALMENTE (EXEMPLO)
export const CERTIFICADOS_INICIAIS: Certificado[] = [
  {
    id: 1,
    codigoAutenticidade: 'EFAPP-2026-A89F-7741',
    idUsuario: 1,
    idCurso: 1,
    nomeAluno: 'Carlos Eduardo Santos',
    cpfAluno: '123.456.789-01',
    nomeCurso: 'Fundamentos do SUS, Legislação Sanitária e Humanização',
    modalidade: 'EAD',
    cargaHoraria: 40,
    dataEmissao: '2026-10-18',
    notaFinal: 9.0,
    livroRegistro: 'LIVRO-EAD-2026',
    folhaRegistro: 'FL-108'
  }
];
