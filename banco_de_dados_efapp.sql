-- =====================================================================
-- ESCOLA DE FORMAÇÃO DE AGENTES PÚBLICOS E PRIVADOS (EFAPP)
-- SISTEMA INTEGRADO DE CURSOS EAD, LOJA VIRTUAL E GESTÃO FINANCEIRA
-- SEGMENTO: SAÚDE E EDUCAÇÃO PÚBLICA E PRIVADA
-- =====================================================================
-- Script SQL Completo de Criação do Banco de Dados Relacional
-- Compatibilidade: PostgreSQL / MySQL / MariaDB (Padrão ANSI SQL)
-- Todos os identificadores, colunas, tabelas e comentários em Português
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABELA DE PERFIS DE ACESSO (PERMISSOES TIPO1 A TIPO7)
-- ---------------------------------------------------------------------
-- Define as categorias de permissões exigidas pela plataforma EFAPP:
-- TIPO1: Usuário comum / Acesso Gov.br (cursos e produtos Tipo 1)
-- TIPO2: Usuário especializado (cursos e produtos Tipo 2)
-- TIPO3: Gestor Operacional (cadastra usuários Tipo 2; produtos Tipo 1 e 2)
-- TIPO4: Administrador de Conteúdo (cadastra usuários Tipo 2 e 3; produtos gerais; cursos Tipo 1 e 2)
-- TIPO5: Coordenador Pedagógico e Financeiro (cronogramas, professores, despesas, financeiro da loja)
-- TIPO6: Professor / Instrutor (criação de cursos, vídeos, materiais e provas de 10 questões com 1 hora)
-- TIPO7: Super Administrador / Direção Geral (acesso irrestrito e configurações)
CREATE TABLE IF NOT EXISTS perfis_acesso (
    id_perfil INT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,       -- Ex: 'TIPO1', 'TIPO2', ..., 'TIPO7'
    nome VARCHAR(100) NOT NULL,               -- Nome descritivo do perfil
    descricao TEXT,                           -- Descrição das permissões e escopo
    pode_cadastrar_usuarios_tipo2 BOOLEAN DEFAULT FALSE,
    pode_cadastrar_usuarios_tipo3 BOOLEAN DEFAULT FALSE,
    pode_cadastrar_cursos BOOLEAN DEFAULT FALSE,
    pode_cadastrar_produtos BOOLEAN DEFAULT FALSE,
    pode_gerir_financeiro BOOLEAN DEFAULT FALSE,
    pode_gerir_professores BOOLEAN DEFAULT FALSE,
    acesso_irrestrito BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção dos 7 perfis padrão conforme especificação
INSERT INTO perfis_acesso (id_perfil, codigo, nome, descricao, pode_cadastrar_usuarios_tipo2, pode_cadastrar_usuarios_tipo3, pode_cadastrar_cursos, pode_cadastrar_produtos, pode_gerir_financeiro, pode_gerir_professores, acesso_irrestrito)
VALUES
(1, 'TIPO1', 'Cidadão / Agente Inscrito', 'Acesso a cursos e produtos da loja do TIPO 1. Perfil padrão do Gov.br e novos cadastros.', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
(2, 'TIPO2', 'Agente Especializado', 'Acesso a cursos e produtos especializados do TIPO 2.', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
(3, 'TIPO3', 'Gestor Operacional', 'Pode cadastrar usuários do TIPO 2 e produtos do TIPO 1 e TIPO 2.', TRUE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE),
(4, 'TIPO4', 'Administrador de Conteúdo', 'Cadastra usuários TIPO 2 e 3, cadastra produtos de todas as naturezas e cursos TIPO 1 e 2.', TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE),
(5, 'TIPO5', 'Coordenador Pedagógico e Financeiro', 'Cria cronogramas, calendários, cadastra instituições, escala de professores, relatórios de pagamentos, despesas fixas/variáveis e financeiro da loja.', FALSE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE),
(6, 'TIPO6', 'Professor / Docente', 'Cria cursos, videoaulas, materiais didáticos e elabora provas com 10 questões de múltipla escolha (tempo máximo de 1 hora).', FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE),
(7, 'TIPO7', 'Super Administrador / Direção', 'Controle total da plataforma EFAPP, relatórios globais e auditoria do banco de dados.', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (id_perfil) DO NOTHING;

-- ---------------------------------------------------------------------
-- 2. TABELA DE USUÁRIOS DO SISTEMA
-- ---------------------------------------------------------------------
-- Armazena os dados cadastrais dos usuários e agentes da EFAPP
-- e proteção de segurança (CPF para marca d'água obrigatória).
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_perfil INT NOT NULL REFERENCES perfis_acesso(id_perfil),
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,          -- Formato: 000.000.000-00 (usado na marca d'água)
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255),                  -- Hash de senha do usuário
    telefone VARCHAR(20),
    orgao_instituicao VARCHAR(255),           -- Órgão público ou instituição privada do agente
    cargo_funcao VARCHAR(150),                -- Cargo ocupado (ex: Enfermeiro, Diretor Escolar, Agente de Endemias)
    segmento_atuacao VARCHAR(50) DEFAULT 'SAUDE', -- 'SAUDE', 'EDUCACAO', 'AMBOS'
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(id_perfil);

-- ---------------------------------------------------------------------
-- 3. TABELA DE INSTITUIÇÕES CONVENIADAS E PARCEIRAS
-- ---------------------------------------------------------------------
-- Gerenciada pelo perfil TIPO5 (Coordenador Pedagógico) para alocação de cursos
CREATE TABLE IF NOT EXISTS instituicoes (
    id_instituicao SERIAL PRIMARY KEY,
    nome_instituicao VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    tipo_esfera VARCHAR(50) NOT NULL,         -- 'PUBLICA_MUNICIPAL', 'PUBLICA_ESTADUAL', 'PUBLICA_FEDERAL', 'PRIVADA'
    area_foco VARCHAR(50) NOT NULL,           -- 'SAUDE', 'EDUCACAO', 'MISTA'
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    endereco TEXT,
    responsavel_contato VARCHAR(150),
    telefone VARCHAR(20),
    email_contato VARCHAR(255),
    ativa BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 4. TABELA DE PROFESSORES / CORPO DOCENTE
-- ---------------------------------------------------------------------
-- Gerenciada pelo perfil TIPO5 e com vínculo ao perfil TIPO6
CREATE TABLE IF NOT EXISTS professores (
    id_professor SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario), -- Vínculo opcional com a conta de usuário
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    titulacao VARCHAR(100) NOT NULL,          -- 'ESPECIALISTA', 'MESTRE', 'DOUTOR', 'POS_DOUTOR'
    area_atuacao VARCHAR(100) NOT NULL,       -- 'SAUDE_COLETIVA', 'PEDAGOGIA', 'GESTAO_PUBLICA', etc.
    valor_hora_aula DECIMAL(10,2) NOT NULL DEFAULT 120.00, -- Base de cálculo para pagamentos
    banco VARCHAR(50),
    agencia VARCHAR(20),
    conta_corrente VARCHAR(30),
    chave_pix VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 5. TABELA DE CURSOS DA EFAPP
-- ---------------------------------------------------------------------
-- Tipos de curso:
-- TIPO1: Cursos básicos/gerais acessíveis pelo TIPO1
-- TIPO2: Cursos de qualificação técnica/avançada acessíveis pelo TIPO2
-- TIPO3: Cursos de alta gestão e liderança
-- Modalidades: 'EAD', 'PRESENCIAL', 'HIBRIDO'
CREATE TABLE IF NOT EXISTS cursos (
    id_curso SERIAL PRIMARY KEY,
    nome_curso VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    modalidade VARCHAR(20) NOT NULL CHECK (modalidade IN ('EAD', 'PRESENCIAL', 'HIBRIDO')),
    tipo_curso VARCHAR(20) NOT NULL CHECK (tipo_curso IN ('TIPO1', 'TIPO2', 'TIPO3')),
    segmento VARCHAR(50) NOT NULL CHECK (segmento IN ('SAUDE', 'EDUCACAO', 'GESTAO_PUBLICA')),
    carga_horaria_horas INT NOT NULL DEFAULT 40,
    nota_minima_aprovacao DECIMAL(4,2) DEFAULT 7.00,
    prazo_prova_minutos INT DEFAULT 60,       -- Padrão obrigatório de 1 hora (60 minutos)
    id_professor_responsavel INT REFERENCES professores(id_professor),
    id_instituicao_sede INT REFERENCES instituicoes(id_instituicao),
    valor_inscricao DECIMAL(10,2) DEFAULT 0.00, -- 0.00 para cursos gratuitos de capacitação pública
    publicado BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 6. TABELA DE MÓDULOS E CONTEÚDOS DOS CURSOS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS modulos_curso (
    id_modulo SERIAL PRIMARY KEY,
    id_curso INT NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
    ordem_modulo INT NOT NULL DEFAULT 1,
    titulo_modulo VARCHAR(255) NOT NULL,
    descricao_modulo TEXT
);

-- ---------------------------------------------------------------------
-- 7. TABELA DE VIDEOAULAS DO CURSO
-- ---------------------------------------------------------------------
-- As videoaulas possuem proteção de marca d'água dinâmica obrigatória
CREATE TABLE IF NOT EXISTS videoaulas (
    id_videoaula SERIAL PRIMARY KEY,
    id_modulo INT NOT NULL REFERENCES modulos_curso(id_modulo) ON DELETE CASCADE,
    ordem_aula INT NOT NULL DEFAULT 1,
    titulo_aula VARCHAR(255) NOT NULL,
    url_video TEXT NOT NULL,
    duracao_minutos INT NOT NULL,
    protecao_anticopia_ativa BOOLEAN DEFAULT TRUE, -- Ativa a marca d'água de CPF
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 8. TABELA DE MATERIAIS ESCRITOS E APOSTILAS
-- ---------------------------------------------------------------------
-- Textos, artigos científicos e apostilas com bloqueio de seleção/cópia e marca d'água
CREATE TABLE IF NOT EXISTS materiais_escritos (
    id_material SERIAL PRIMARY KEY,
    id_modulo INT NOT NULL REFERENCES modulos_curso(id_modulo) ON DELETE CASCADE,
    titulo_material VARCHAR(255) NOT NULL,
    tipo_material VARCHAR(50) NOT NULL,       -- 'APOSTILA', 'ARTIGO', 'LEGISLACAO', 'GUIA_PRATICO'
    conteudo_texto TEXT NOT NULL,             -- Texto formatado protegido contra cópia
    arquivo_anexo_url TEXT,
    protecao_anticopia_ativa BOOLEAN DEFAULT TRUE,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 9. TABELA DE AVALIAÇÕES (PROVAS OFICIAIS DE 10 QUESTÕES COM 1 HORA)
-- ---------------------------------------------------------------------
-- O TIPO6 cria a prova com 10 questões de múltipla escolha e limite de 60 minutos
CREATE TABLE IF NOT EXISTS avaliacoes (
    id_avaliacao SERIAL PRIMARY KEY,
    id_curso INT NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
    titulo_avaliacao VARCHAR(255) NOT NULL,
    instrucoes TEXT,
    tempo_limite_minutos INT NOT NULL DEFAULT 60, -- Prazo máximo estrito de 1 hora
    quantidade_questoes INT NOT NULL DEFAULT 10,  -- Padrão obrigatório de 10 questões
    nota_corte DECIMAL(4,2) NOT NULL DEFAULT 7.00,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 10. TABELA DE QUESTÕES DE MÚLTIPLA ESCOLHA
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questoes_avaliacao (
    id_questao SERIAL PRIMARY KEY,
    id_avaliacao INT NOT NULL REFERENCES avaliacoes(id_avaliacao) ON DELETE CASCADE,
    numero_questao INT NOT NULL,               -- De 1 a 10
    enunciado TEXT NOT NULL,
    explicacao_pedagogica TEXT                 -- Justificativa do gabarito para feedback
);

-- ---------------------------------------------------------------------
-- 11. TABELA DE OPÇÕES DAS QUESTÕES (ALTERNATIVAS A, B, C, D)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS opcoes_questao (
    id_opcao SERIAL PRIMARY KEY,
    id_questao INT NOT NULL REFERENCES questoes_avaliacao(id_questao) ON DELETE CASCADE,
    letra_opcao CHAR(1) NOT NULL,              -- 'A', 'B', 'C', 'D'
    texto_opcao TEXT NOT NULL,
    eh_correta BOOLEAN NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- 12. TABELA DE TENTATIVAS DE PROVA DO ALUNO
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tentativas_avaliacao (
    id_tentativa SERIAL PRIMARY KEY,
    id_avaliacao INT NOT NULL REFERENCES avaliacoes(id_avaliacao),
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    data_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    tempo_gasto_segundos INT,
    acertos INT DEFAULT 0,                     -- Quantidade de questões corretas (0 a 10)
    nota_final DECIMAL(4,2) DEFAULT 0.00,      -- Nota de 0.0 a 10.0
    aprovado BOOLEAN DEFAULT FALSE,
    ip_origem VARCHAR(45)
);

-- ---------------------------------------------------------------------
-- 13. TABELA DE RESPOSTAS SUBMETIDAS PELO ALUNO
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS respostas_aluno (
    id_resposta SERIAL PRIMARY KEY,
    id_tentativa INT NOT NULL REFERENCES tentativas_avaliacao(id_tentativa) ON DELETE CASCADE,
    id_questao INT NOT NULL REFERENCES questoes_avaliacao(id_questao),
    id_opcao_escolhida INT REFERENCES opcoes_questao(id_opcao),
    acertou BOOLEAN NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- 14. TABELA DE CERTIFICADOS DIGITAIS EMITIDOS
-- ---------------------------------------------------------------------
-- Emitido automaticamente após o término e aprovação no curso
CREATE TABLE IF NOT EXISTS certificados (
    id_certificado SERIAL PRIMARY KEY,
    codigo_autenticidade VARCHAR(50) NOT NULL UNIQUE, -- Código alfanumérico para validação pública
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    id_curso INT NOT NULL REFERENCES cursos(id_curso),
    id_tentativa_aprovada INT REFERENCES tentativas_avaliacao(id_tentativa),
    nome_aluno VARCHAR(255) NOT NULL,
    cpf_aluno VARCHAR(14) NOT NULL,
    nome_curso VARCHAR(255) NOT NULL,
    carga_horaria INT NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    qr_code_validacao_url TEXT,
    livro_registro VARCHAR(20) DEFAULT 'EFAPP-LIVRO-2026',
    folha_registro VARCHAR(20) DEFAULT 'FL-042',
    valido BOOLEAN DEFAULT TRUE
);

-- ---------------------------------------------------------------------
-- 15. TABELA DE PRODUTOS DA LOJA VIRTUAL EFAPP
-- ---------------------------------------------------------------------
-- Filtrados por perfil:
-- TIPO1: visualiza e compra produtos do TIPO1
-- TIPO2: visualiza e compra produtos do TIPO2
-- TIPO3: pode cadastrar produtos TIPO1 e TIPO2
-- TIPO4/TIPO7: podem cadastrar produtos de todas as naturezas
CREATE TABLE IF NOT EXISTS produtos_loja (
    id_produto SERIAL PRIMARY KEY,
    tipo_produto VARCHAR(20) NOT NULL CHECK (tipo_produto IN ('TIPO1', 'TIPO2', 'GERAL')),
    nome_produto VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,          -- 'LIVRO', 'APOSTILA', 'SOFTWARE', 'KIT_PRATICO'
    segmento VARCHAR(50) NOT NULL,             -- 'SAUDE', 'EDUCACAO', 'GERAL'
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque_disponivel INT NOT NULL DEFAULT 0,
    imagem_url TEXT,
    id_usuario_cadastro INT REFERENCES usuarios(id_usuario),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 16. TABELA DE PEDIDOS DA LOJA ONLINE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pedidos_loja (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,     -- 'PIX', 'CARTAO_CREDITO', 'BOLETO'
    status_pedido VARCHAR(50) NOT NULL DEFAULT 'PAGO', -- 'PENDENTE', 'PAGO', 'ENVIADO', 'CANCELADO'
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS itens_pedido (
    id_item SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedidos_loja(id_pedido) ON DELETE CASCADE,
    id_produto INT NOT NULL REFERENCES produtos_loja(id_produto),
    quantidade INT NOT NULL DEFAULT 1,
    preco_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- ---------------------------------------------------------------------
-- 17. TABELA DE CRONOGRAMAS E CALENDÁRIOS DE CURSOS
-- ---------------------------------------------------------------------
-- Gerenciada pelo perfil TIPO5 (Coordenador Pedagógico e Financeiro)
CREATE TABLE IF NOT EXISTS cronogramas_cursos (
    id_cronograma SERIAL PRIMARY KEY,
    id_curso INT NOT NULL REFERENCES cursos(id_curso),
    id_instituicao INT REFERENCES instituicoes(id_instituicao),
    id_professor INT REFERENCES professores(id_professor),
    data_inicio DATE NOT NULL,
    data_termino DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_termino TIME NOT NULL,
    dias_semana VARCHAR(100) NOT NULL,         -- Ex: 'Segunda a Sexta', 'Sábados'
    sala_local VARCHAR(100),                   -- Sala presencial ou link de sala EAD
    vagas_totais INT NOT NULL DEFAULT 50,
    vagas_ocupadas INT NOT NULL DEFAULT 0,
    status_turma VARCHAR(30) DEFAULT 'ABERTA'  -- 'ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA'
);

-- ---------------------------------------------------------------------
-- 18. TABELA DE ESCALA DE PROFESSORES PARA AS AULAS
-- ---------------------------------------------------------------------
-- Criada e gerida pelo TIPO5
CREATE TABLE IF NOT EXISTS escala_professores (
    id_escala SERIAL PRIMARY KEY,
    id_professor INT NOT NULL REFERENCES professores(id_professor),
    id_curso INT NOT NULL REFERENCES cursos(id_curso),
    id_instituicao INT REFERENCES instituicoes(id_instituicao),
    data_aula DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    total_horas DECIMAL(4,2) NOT NULL,
    tema_aula VARCHAR(255) NOT NULL,
    status_execucao VARCHAR(30) DEFAULT 'AGENDADA', -- 'AGENDADA', 'MINISTRADA', 'CANCELADA'
    observacoes TEXT
);

-- ---------------------------------------------------------------------
-- 19. TABELA DE LANÇAMENTOS FINANCEIROS
-- ---------------------------------------------------------------------
-- Gerida pelo TIPO5: despesas fixas e variáveis, receitas de loja e cursos
CREATE TABLE IF NOT EXISTS lancamentos_financeiros (
    id_lancamento SERIAL PRIMARY KEY,
    tipo_operacao VARCHAR(20) NOT NULL CHECK (tipo_operacao IN ('RECEITA', 'DESPESA')),
    categoria_despesa VARCHAR(50),             -- 'FIXA', 'VARIAVEL' (caso seja despesa)
    subcategoria VARCHAR(100) NOT NULL,        -- 'SERVIDORES_TI', 'ALUGUEL_SEDE', 'MATERIAL_DIDATICO', 'VENDA_LOJA', etc.
    descricao TEXT NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_competencia DATE NOT NULL,
    data_pagamento DATE,
    status_pagamento VARCHAR(30) DEFAULT 'PAGO', -- 'PENDENTE', 'PAGO', 'CANCELADO'
    comprovante_referencia VARCHAR(100),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 20. TABELA DE RELATÓRIO DE PAGAMENTO A PROFESSORES
-- ---------------------------------------------------------------------
-- Gerida pelo TIPO5 com base nas horas ministradas da escala
CREATE TABLE IF NOT EXISTS pagamentos_professores (
    id_pagamento SERIAL PRIMARY KEY,
    id_professor INT NOT NULL REFERENCES professores(id_professor),
    mes_referencia INT NOT NULL,               -- 1 a 12
    ano_referencia INT NOT NULL,               -- Ex: 2026
    total_horas_ministradas DECIMAL(6,2) NOT NULL,
    valor_hora DECIMAL(10,2) NOT NULL,
    valor_bruto DECIMAL(10,2) NOT NULL,
    descontos_tributarios DECIMAL(10,2) DEFAULT 0.00,
    valor_liquido DECIMAL(10,2) NOT NULL,
    status_pagamento VARCHAR(30) DEFAULT 'PENDENTE', -- 'PENDENTE', 'AUTORIZADO', 'PAGO'
    data_pagamento DATE,
    id_lancamento_financeiro INT REFERENCES lancamentos_financeiros(id_lancamento)
);

-- =====================================================================
-- CARGA DE DADOS INICIAIS (SEEDS PARA TESTE E OPERAÇÃO)
-- =====================================================================

-- Instituições Parceiras
INSERT INTO instituicoes (nome_instituicao, cnpj, tipo_esfera, area_foco, cidade, estado, responsavel_contato, telefone, email_contato)
VALUES
('Secretaria Municipal de Saúde de São Paulo', '46.392.130/0001-18', 'PUBLICA_MUNICIPAL', 'SAUDE', 'São Paulo', 'SP', 'Dra. Helena Martins', '(11) 3222-1000', 'saude.capacitacao@prefeitura.sp.gov.br'),
('Secretaria Estadual de Educação de Minas Gerais', '18.715.532/0001-90', 'PUBLICA_ESTADUAL', 'EDUCACAO', 'Belo Horizonte', 'MG', 'Prof. Carlos Drummond', '(31) 3915-3000', 'formacao@educacao.mg.gov.br'),
('Instituto Privado de Excelência em Saúde Santa Clara', '03.882.110/0001-45', 'PRIVADA', 'SAUDE', 'Curitiba', 'PR', 'Dr. Roberto Silveira', '(41) 3045-8000', 'cursos@santaclara.com.br');

-- Professores
INSERT INTO professores (nome_completo, cpf, email, titulacao, area_atuacao, valor_hora_aula, chave_pix)
VALUES
('Dra. Mariana Costa Pereira', '111.222.333-44', 'mariana.costa@efapp.edu.br', 'DOUTOR', 'Saúde Coletiva e Epidemiologia', 150.00, 'mariana.costa@efapp.edu.br'),
('Prof. Dr. Ricardo Barros', '222.333.444-55', 'ricardo.barros@efapp.edu.br', 'DOUTOR', 'Gestão Escolar e Políticas Públicas', 140.00, '22233344455'),
('Me. Fernanda Albuquerque', '333.444.555-66', 'fernanda.albuquerque@efapp.edu.br', 'MESTRE', 'Biossegurança e Vigilância Sanitária', 130.00, 'fernanda.albuquerque@efapp.edu.br');

-- Usuários Modelo para Teste dos Perfis TIPO1 a TIPO7
INSERT INTO usuarios (id_perfil, nome_completo, cpf, email, orgao_instituicao, cargo_funcao, segmento_atuacao)
VALUES
(1, 'Carlos Eduardo Santos (Aluno Tipo 1)', '123.456.789-01', 'carlos.aluno@gmail.com', 'UBS Central de Saúde', 'Técnico de Enfermagem', 'SAUDE'),
(2, 'Dra. Beatriz Mendes (Aluna Tipo 2)', '234.567.890-12', 'beatriz.mendes@hospital.com', 'Hospital Geral Estadual', 'Médica Sanitarista', 'SAUDE'),
(3, 'Juliana Nogueira (Gestora Operacional)', '345.678.901-23', 'juliana.gestora@efapp.edu.br', 'EFAPP Gestão', 'Coordenadora de Matrículas', 'AMBOS'),
(4, 'Marcos Vinícius Prado (Admin Conteúdo)', '456.789.012-34', 'marcos.conteudo@efapp.edu.br', 'EFAPP Acadêmica', 'Editor Chefe Pedagógico', 'AMBOS'),
(5, 'Patrícia Guimarães (Coord. Financeira)', '567.890.123-45', 'patricia.financeiro@efapp.edu.br', 'EFAPP Diretoria', 'Gerente Financeira e Escalas', 'AMBOS'),
(6, 'Prof. Dr. Ricardo Barros (Docente)', '222.333.444-55', 'ricardo.barros@efapp.edu.br', 'EFAPP Corpo Docente', 'Professor Titular', 'EDUCACAO'),
(7, 'Diretor Geral EFAPP (Super Admin)', '789.012.345-67', 'diretoria@efapp.edu.br', 'EFAPP Presidência', 'Diretor Geral Executivo', 'AMBOS');

-- Cursos Tipo 1, Tipo 2 e Tipo 3
INSERT INTO cursos (nome_curso, descricao, modalidade, tipo_curso, segmento, carga_horaria_horas, id_professor_responsavel, id_instituicao_sede, valor_inscricao)
VALUES
('Fundamentos do SUS e Humanização do Atendimento', 'Capacitação prática sobre a estrutura do Sistema Único de Saúde, diretrizes da Política Nacional de Humanização (HumanizaSUS) e atendimento ao público.', 'EAD', 'TIPO1', 'SAUDE', 40, 1, 1, 0.00),
('Práticas Pedagógicas e Inclusão Escolar na Rede Pública', 'Metodologias de ensino inclusivo, adaptações curriculares e apoio a estudantes com necessidades educacionais especiais.', 'EAD', 'TIPO1', 'EDUCACAO', 40, 2, 2, 0.00),
('Vigilância Epidemiológica Avançada e Gestão Hospitalar', 'Protocolos técnicos de contenção de surtos, controle de infecções hospitalares e gestão de leitos públicos e privados.', 'EAD', 'TIPO2', 'SAUDE', 80, 1, 3, 199.00),
('Gestão Orçamentária e Prestação de Contas no Fundeb', 'Aplicação dos recursos do FUNDEB, controle social pelo CACS e auditoria contábil preventiva na educação.', 'PRESENCIAL', 'TIPO2', 'EDUCACAO', 60, 2, 2, 250.00),
('Masterclass de Liderança Estratégica em Saúde e Educação', 'Formação de alta gestão para secretários municipais, diretores de autarquias e executivos do setor privado.', 'HIBRIDO', 'TIPO3', 'GESTAO_PUBLICA', 120, 2, 1, 890.00);

-- Produtos da Loja (TIPO1, TIPO2, GERAL)
INSERT INTO produtos_loja (tipo_produto, nome_produto, categoria, segmento, descricao, preco, estoque_disponivel)
VALUES
('TIPO1', 'Manual Prático do Agente Comunitário de Saúde (Edição 2026)', 'LIVRO', 'SAUDE', 'Guia indispensável com tabelas de visitas domiciliares, sinais de alerta e protocolos do Ministério da Saúde.', 45.00, 150),
('TIPO1', 'Caderno de Questões Comentadas: Legislação do SUS e LDB', 'APOSTILA', 'EDUCACAO', 'Mais de 500 questões resolvidas e comentadas por especialistas para concursos e formação continuada.', 38.00, 200),
('TIPO2', 'Software de Triagem e Indicadores de Saúde EFAPP-Care (Licença Anual)', 'SOFTWARE', 'SAUDE', 'Plataforma para monitoramento de filas, prontuário simplificado e metas do programa Previne Brasil.', 399.00, 50),
('TIPO2', 'Kit de Avaliação Diagnóstica Neuropsicopedagógica Institucional', 'KIT_PRATICO', 'EDUCACAO', 'Maleta completa com protocolos de triagem de dislexia, TDAH e guia de intervenção em sala de aula.', 280.00, 35),
('GERAL', 'Jaleco Oficial EFAPP com Bordado Institucional', 'KIT_PRATICO', 'SAUDE', 'Jaleco em microfibra de alta durabilidade, antibacteriano, com brasão bordado da EFAPP.', 89.90, 80);

-- Lançamentos Financeiros Iniciais (Despesas Fixas, Variáveis e Receitas)
INSERT INTO lancamentos_financeiros (tipo_operacao, categoria_despesa, subcategoria, descricao, valor, data_competencia, data_pagamento, status_pagamento)
VALUES
('RECEITA', NULL, 'VENDA_LOJA', 'Receita consolidada de vendas da loja virtual EFAPP', 4850.00, '2026-10-01', '2026-10-01', 'PAGO'),
('RECEITA', NULL, 'INSCRICAO_CURSOS', 'Receitas de inscrições de cursos de capacitação especializada', 12400.00, '2026-10-05', '2026-10-05', 'PAGO'),
('DESPESA', 'FIXA', 'SERVIDORES_TI', 'Hospedagem em nuvem de alta segurança e streaming de vídeo EAD', 1850.00, '2026-10-10', '2026-10-10', 'PAGO'),
('DESPESA', 'FIXA', 'ALUGUEL_SEDE', 'Aluguel do polo presencial e salas de aula de capacitação prática', 4200.00, '2026-10-10', '2026-10-10', 'PAGO'),
('DESPESA', 'VARIAVEL', 'MATERIAL_DIDATICO', 'Impressão de apostilas institucionais e kits didáticos da loja', 1620.00, '2026-10-15', '2026-10-15', 'PAGO'),
('DESPESA', 'VARIAVEL', 'HONORARIOS_DOCENTES', 'Pagamentos aos professores referentes ao ciclo de aulas ministradas', 5800.00, '2026-10-20', '2026-10-20', 'PAGO');

-- =====================================================================
-- FIM DO SCRIPT DE CRIAÇÃO DO BANCO DE DADOS DA EFAPP
-- =====================================================================
