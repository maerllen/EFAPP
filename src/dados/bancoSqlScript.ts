/**
 * EFAPP - Script SQL do Banco de Dados
 * Disponibilizado para visualização, cópia e download no painel do sistema
 */

export const SCRIPT_SQL_EFAPP = `-- =====================================================================
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

INSERT INTO perfis_acesso (id_perfil, codigo, nome, descricao, pode_cadastrar_usuarios_tipo2, pode_cadastrar_usuarios_tipo3, pode_cadastrar_cursos, pode_cadastrar_produtos, pode_gerir_financeiro, pode_gerir_professores, acesso_irrestrito)
VALUES
(1, 'TIPO1', 'Cidadão / Agente Inscrito', 'Acesso a cursos e produtos da loja do TIPO 1. Perfil padrão para novos cadastros.', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE),
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
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_perfil INT NOT NULL REFERENCES perfis_acesso(id_perfil),
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,          -- Formato: 000.000.000-00 (usado na marca d'água)
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255),                  -- Hash de autenticação
    telefone VARCHAR(20),
    orgao_instituicao VARCHAR(255),           -- Órgão ou entidade de atuação
    cargo_funcao VARCHAR(150),
    segmento_atuacao VARCHAR(50) DEFAULT 'SAUDE', -- 'SAUDE', 'EDUCACAO', 'AMBOS'
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 3. TABELA DE INSTITUIÇÕES PARCEIRAS (GERIDA PELO TIPO5)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS instituicoes (
    id_instituicao SERIAL PRIMARY KEY,
    nome_instituicao VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    tipo_esfera VARCHAR(50) NOT NULL,         -- 'PUBLICA_MUNICIPAL', 'PUBLICA_ESTADUAL', 'PUBLICA_FEDERAL', 'PRIVADA'
    area_foco VARCHAR(50) NOT NULL,           -- 'SAUDE', 'EDUCACAO', 'MISTA'
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    responsavel_contato VARCHAR(150),
    telefone VARCHAR(20),
    email_contato VARCHAR(255),
    ativa BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 4. TABELA DE PROFESSORES (GERIDA PELO TIPO5)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS professores (
    id_professor SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES usuarios(id_usuario),
    nome_completo VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    titulacao VARCHAR(100) NOT NULL,          -- 'ESPECIALISTA', 'MESTRE', 'DOUTOR', 'POS_DOUTOR'
    area_atuacao VARCHAR(100) NOT NULL,
    valor_hora_aula DECIMAL(10,2) NOT NULL DEFAULT 120.00,
    chave_pix VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 5. TABELA DE CURSOS
-- ---------------------------------------------------------------------
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
    valor_inscricao DECIMAL(10,2) DEFAULT 0.00,
    publicado BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 6. MÓDULOS, VÍDEOS E MATERIAIS ESCRITOS COM PROTEÇÃO ANTICÓPIA
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS modulos_curso (
    id_modulo SERIAL PRIMARY KEY,
    id_curso INT NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
    ordem_modulo INT NOT NULL DEFAULT 1,
    titulo_modulo VARCHAR(255) NOT NULL,
    descricao_modulo TEXT
);

CREATE TABLE IF NOT EXISTS videoaulas (
    id_videoaula SERIAL PRIMARY KEY,
    id_modulo INT NOT NULL REFERENCES modulos_curso(id_modulo) ON DELETE CASCADE,
    ordem_aula INT NOT NULL DEFAULT 1,
    titulo_aula VARCHAR(255) NOT NULL,
    url_video TEXT NOT NULL,
    duracao_minutos INT NOT NULL,
    protecao_anticopia_ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS materiais_escritos (
    id_material SERIAL PRIMARY KEY,
    id_modulo INT NOT NULL REFERENCES modulos_curso(id_modulo) ON DELETE CASCADE,
    titulo_material VARCHAR(255) NOT NULL,
    tipo_material VARCHAR(50) NOT NULL,       -- 'APOSTILA', 'ARTIGO', 'LEGISLACAO'
    conteudo_texto TEXT NOT NULL,
    protecao_anticopia_ativa BOOLEAN DEFAULT TRUE
);

-- ---------------------------------------------------------------------
-- 7. AVALIAÇÕES (10 QUESTÕES DE MÚLTIPLA ESCOLHA COM PRAZO DE 1 HORA)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS avaliacoes (
    id_avaliacao SERIAL PRIMARY KEY,
    id_curso INT NOT NULL REFERENCES cursos(id_curso) ON DELETE CASCADE,
    titulo_avaliacao VARCHAR(255) NOT NULL,
    instrucoes TEXT,
    tempo_limite_minutos INT NOT NULL DEFAULT 60, -- Máximo de 1 hora
    quantidade_questoes INT NOT NULL DEFAULT 10,  -- 10 questões de múltipla escolha
    nota_corte DECIMAL(4,2) NOT NULL DEFAULT 7.00,
    ativa BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS questoes_avaliacao (
    id_questao SERIAL PRIMARY KEY,
    id_avaliacao INT NOT NULL REFERENCES avaliacoes(id_avaliacao) ON DELETE CASCADE,
    numero_questao INT NOT NULL,
    enunciado TEXT NOT NULL,
    explicacao_pedagogica TEXT
);

CREATE TABLE IF NOT EXISTS opcoes_questao (
    id_opcao SERIAL PRIMARY KEY,
    id_questao INT NOT NULL REFERENCES questoes_avaliacao(id_questao) ON DELETE CASCADE,
    letra_opcao CHAR(1) NOT NULL,
    texto_opcao TEXT NOT NULL,
    eh_correta BOOLEAN NOT NULL DEFAULT FALSE
);

-- ---------------------------------------------------------------------
-- 8. CERTIFICADOS EMITIDOS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificados (
    id_certificado SERIAL PRIMARY KEY,
    codigo_autenticidade VARCHAR(50) NOT NULL UNIQUE,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    id_curso INT NOT NULL REFERENCES cursos(id_curso),
    nome_aluno VARCHAR(255) NOT NULL,
    cpf_aluno VARCHAR(14) NOT NULL,
    nome_curso VARCHAR(255) NOT NULL,
    carga_horaria INT NOT NULL,
    data_emissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valido BOOLEAN DEFAULT TRUE
);

-- ---------------------------------------------------------------------
-- 9. PRODUTOS E PEDIDOS DA LOJA ONLINE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS produtos_loja (
    id_produto SERIAL PRIMARY KEY,
    tipo_produto VARCHAR(20) NOT NULL CHECK (tipo_produto IN ('TIPO1', 'TIPO2', 'GERAL')),
    nome_produto VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    segmento VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque_disponivel INT NOT NULL DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pedidos_loja (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario),
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    status_pedido VARCHAR(50) NOT NULL DEFAULT 'PAGO',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 10. CRONOGRAMAS, ESCALA DE PROFESSORES E GESTÃO FINANCEIRA (TIPO5)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cronogramas_cursos (
    id_cronograma SERIAL PRIMARY KEY,
    id_curso INT NOT NULL REFERENCES cursos(id_curso),
    id_instituicao INT REFERENCES instituicoes(id_instituicao),
    id_professor INT REFERENCES professores(id_professor),
    data_inicio DATE NOT NULL,
    data_termino DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_termino TIME NOT NULL,
    dias_semana VARCHAR(100) NOT NULL,
    status_turma VARCHAR(30) DEFAULT 'ABERTA'
);

CREATE TABLE IF NOT EXISTS escala_professores (
    id_escala SERIAL PRIMARY KEY,
    id_professor INT NOT NULL REFERENCES professores(id_professor),
    id_curso INT NOT NULL REFERENCES cursos(id_curso),
    data_aula DATE NOT NULL,
    total_horas DECIMAL(4,2) NOT NULL,
    tema_aula VARCHAR(255) NOT NULL,
    status_execucao VARCHAR(30) DEFAULT 'AGENDADA'
);

CREATE TABLE IF NOT EXISTS lancamentos_financeiros (
    id_lancamento SERIAL PRIMARY KEY,
    tipo_operacao VARCHAR(20) NOT NULL CHECK (tipo_operacao IN ('RECEITA', 'DESPESA')),
    categoria_despesa VARCHAR(50),             -- 'FIXA', 'VARIAVEL'
    subcategoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    data_competencia DATE NOT NULL,
    data_pagamento DATE,
    status_pagamento VARCHAR(30) DEFAULT 'PAGO'
);
`;
