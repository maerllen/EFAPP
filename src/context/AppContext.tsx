/**
 * EFAPP - Escola de Formação de Agentes Públicos e Privados
 * Contexto Central da Aplicação com Gerenciamento de Estado,
 * Autenticação Gov.br, Perfis TIPO1 a TIPO7, Cursos, Loja e Financeiro
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Usuario,
  CodigoPerfil,
  Curso,
  ProdutoLoja,
  Instituicao,
  Professor,
  CronogramaCurso,
  EscalaProfessor,
  LancamentoFinanceiro,
  Certificado,
  ItemCarrinho,
  RelatorioPagamentoProfessor
} from '../types/index.ts';
import {
  USUARIOS_INICIAIS,
  CURSOS_INICIAIS,
  PRODUTOS_INICIAIS,
  INSTITUICOES_INICIAIS,
  PROFESSORES_INICIAIS,
  CRONOGRAMAS_INICIAIS,
  ESCALAS_INICIAIS,
  LANCAMENTOS_INICIAIS,
  CERTIFICADOS_INICIAIS
} from '../dados/dadosIniciais.ts';

interface AppContextProps {
  usuarioAtual: Usuario;
  trocarPerfilAtivo: (codigo: CodigoPerfil) => void;
  todosUsuarios: Usuario[];
  cadastrarNovoUsuario: (dados: {
    nome: string;
    cpf: string;
    email: string;
    orgao: string;
    cargo: string;
    segmento: 'SAUDE' | 'EDUCACAO' | 'AMBOS';
    codigoPerfilDestino?: CodigoPerfil;
  }) => { sucesso: boolean; mensagem: string };
  realizarLoginEfapp: (credenciais: {
    cpfOuEmail: string;
    senha?: string;
  }) => { sucesso: boolean; mensagem: string };
  fazerLogout: () => void;

  
  // Cursos e Avaliações
  cursos: Curso[];
  cadastrarCurso: (novoCurso: Curso) => void;
  emitirCertificado: (idCurso: number, notaFinal: number) => Certificado;
  certificados: Certificado[];
  
  // Loja Virtual e Carrinho
  produtos: ProdutoLoja[];
  cadastrarProduto: (novoProduto: ProdutoLoja) => void;
  carrinho: ItemCarrinho[];
  adicionarAoCarrinho: (produto: ProdutoLoja) => void;
  removerDoCarrinho: (idProduto: number) => void;
  limparCarrinho: () => void;
  finalizarCompra: (formaPagamento: string) => { sucesso: boolean; mensagem: string };

  // Módulo Pedagógico e Financeiro (TIPO5 e TIPO7)
  instituicoes: Instituicao[];
  cadastrarInstituicao: (nova: Instituicao) => void;
  professores: Professor[];
  cadastrarProfessor: (novo: Professor) => void;
  cronogramas: CronogramaCurso[];
  cadastrarCronograma: (novo: CronogramaCurso) => void;
  escalas: EscalaProfessor[];
  cadastrarEscala: (nova: EscalaProfessor) => void;
  atualizarStatusEscala: (idEscala: number, status: 'AGENDADA' | 'MINISTRADA' | 'CANCELADA') => void;
  lancamentos: LancamentoFinanceiro[];
  lancarTransacaoFinanceira: (transacao: LancamentoFinanceiro) => void;
  obterRelatorioPagamentoProfessores: () => RelatorioPagamentoProfessor[];

  // Notificações / Toasts
  notificacao: { tipo: 'sucesso' | 'erro' | 'info'; texto: string } | null;
  exibirNotificacao: (tipo: 'sucesso' | 'erro' | 'info', texto: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const CHAVE_STORAGE = 'efapp_sistema_dados_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Carrega estado persistido ou inicial
  const carregarDadosSalvos = () => {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) {
        return JSON.parse(salvo);
      }
    } catch (e) {
      console.warn('Erro ao carregar dados salvos do localStorage', e);
    }
    return null;
  };

  const dadosSalvos = carregarDadosSalvos();

  const [usuarioAtual, setUsuarioAtual] = useState<Usuario>(
    dadosSalvos?.usuarioAtual || USUARIOS_INICIAIS[0] // Inicia no TIPO1 por padrão
  );
  const [todosUsuarios, setTodosUsuarios] = useState<Usuario[]>(
    dadosSalvos?.todosUsuarios || USUARIOS_INICIAIS
  );
  const [cursos, setCursos] = useState<Curso[]>(
    dadosSalvos?.cursos || CURSOS_INICIAIS
  );
  const [produtos, setProdutos] = useState<ProdutoLoja[]>(
    dadosSalvos?.produtos || PRODUTOS_INICIAIS
  );
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>(
    dadosSalvos?.instituicoes || INSTITUICOES_INICIAIS
  );
  const [professores, setProfessores] = useState<Professor[]>(
    dadosSalvos?.professores || PROFESSORES_INICIAIS
  );
  const [cronogramas, setCronogramas] = useState<CronogramaCurso[]>(
    dadosSalvos?.cronogramas || CRONOGRAMAS_INICIAIS
  );
  const [escalas, setEscalas] = useState<EscalaProfessor[]>(
    dadosSalvos?.escalas || ESCALAS_INICIAIS
  );
  const [lancamentos, setLancamentos] = useState<LancamentoFinanceiro[]>(
    dadosSalvos?.lancamentos || LANCAMENTOS_INICIAIS
  );
  const [certificados, setCertificados] = useState<Certificado[]>(
    dadosSalvos?.certificados || CERTIFICADOS_INICIAIS
  );
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [notificacao, setNotificacao] = useState<{ tipo: 'sucesso' | 'erro' | 'info'; texto: string } | null>(null);

  // Sincroniza alterações no LocalStorage
  useEffect(() => {
    try {
      const estadoParaSalvar = {
        usuarioAtual,
        todosUsuarios,
        cursos,
        produtos,
        instituicoes,
        professores,
        cronogramas,
        escalas,
        lancamentos,
        certificados
      };
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estadoParaSalvar));
    } catch (e) {
      console.warn('Erro ao salvar dados no localStorage', e);
    }
  }, [usuarioAtual, todosUsuarios, cursos, produtos, instituicoes, professores, cronogramas, escalas, lancamentos, certificados]);

  const exibirNotificacao = (tipo: 'sucesso' | 'erro' | 'info', texto: string) => {
    setNotificacao({ tipo, texto });
    setTimeout(() => {
      setNotificacao(null);
    }, 4500);
  };

  // Troca rápida de perfil (permite testar a experiência de cada um dos 7 tipos de usuário)
  const trocarPerfilAtivo = (codigo: CodigoPerfil) => {
    const usuarioModelo = todosUsuarios.find(u => u.codigoPerfil === codigo) || USUARIOS_INICIAIS.find(u => u.codigoPerfil === codigo);
    if (usuarioModelo) {
      setUsuarioAtual(usuarioModelo);
      exibirNotificacao('info', `Perfil alternado para ${usuarioModelo.codigoPerfil}: ${usuarioModelo.nomeCompleto}`);
    } else {
      // Se não houver prévio, cria ou ajusta
      const novoU: Usuario = {
        id: Date.now(),
        idPerfil: parseInt(codigo.replace('TIPO', '')) || 1,
        codigoPerfil: codigo,
        nomeCompleto: `Usuário ${codigo}`,
        cpf: '000.000.000-00',
        email: `${codigo.toLowerCase()}@efapp.edu.br`,
        orgaoInstituicao: 'EFAPP Formação',
        cargoFuncao: `Agente ${codigo}`,
        segmento: 'AMBOS',
        statusConta: 'ATIVO',
        dataCadastro: new Date().toISOString().split('T')[0]
      };
      setUsuarioAtual(novoU);
      exibirNotificacao('info', `Perfil alternado para ${codigo}`);
    }
  };

  // Login institucional EFAPP: permite entrar com CPF ou E-mail e Senha
  const realizarLoginEfapp = (credenciais: {
    cpfOuEmail: string;
    senha?: string;
  }) => {
    const termo = credenciais.cpfOuEmail.trim().toLowerCase();
    const usuarioEncontrado = todosUsuarios.find(
      (u) =>
        u.cpf.replace(/\D/g, '') === termo.replace(/\D/g, '') ||
        u.cpf === termo ||
        u.email.toLowerCase() === termo
    );

    if (usuarioEncontrado) {
      setUsuarioAtual(usuarioEncontrado);
      exibirNotificacao(
        'sucesso',
        `Bem-vindo(a), ${usuarioEncontrado.nomeCompleto}! Acesso autorizado como ${usuarioEncontrado.codigoPerfil}.`
      );
      return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
    }

    // Se for primeiro acesso via CPF/Email, cria e loga automaticamente com perfil TIPO 1
    const novoUsuarioTipo1: Usuario = {
      id: Date.now(),
      idPerfil: 1,
      codigoPerfil: 'TIPO1',
      nomeCompleto: termo.includes('@') ? termo.split('@')[0].toUpperCase() : 'Agente Inscrito',
      cpf: termo.includes('@') ? '111.222.333-00' : credenciais.cpfOuEmail,
      email: termo.includes('@') ? termo : 'agente@efapp.edu.br',
      orgaoInstituicao: 'Instituição Pública / Privada',
      cargoFuncao: 'Agente Capacitando',
      segmento: 'SAUDE',
      statusConta: 'ATIVO',
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    setTodosUsuarios((prev) => [...prev, novoUsuarioTipo1]);
    setUsuarioAtual(novoUsuarioTipo1);
    exibirNotificacao(
      'sucesso',
      `Cadastro ativado com sucesso! Seu perfil é TIPO 1 com acesso aos cursos TIPO 1.`
    );
    return { sucesso: true, mensagem: 'Primeiro acesso realizado! Perfil TIPO 1 ativado.' };
  };

  // Cadastro de novo usuário
  // "Criando novo usuario, o usuario pode fazer seu cadastro mas ele só terá acesso aos cursos tipo 1"
  // "TIPO3 cadastra TIPO2; TIPO4 cadastra TIPO2 e TIPO3; TIPO7 cadastra todos"
  const cadastrarNovoUsuario = (dados: {
    nome: string;
    cpf: string;
    email: string;
    orgao: string;
    cargo: string;
    segmento: 'SAUDE' | 'EDUCACAO' | 'AMBOS';
    codigoPerfilDestino?: CodigoPerfil;
  }) => {
    let perfilFinal: CodigoPerfil = 'TIPO1'; // Padrão se for autocadastro

    if (dados.codigoPerfilDestino) {
      // Validação das regras de quem pode cadastrar quem
      if (usuarioAtual.codigoPerfil === 'TIPO3' && dados.codigoPerfilDestino !== 'TIPO2') {
        return { sucesso: false, mensagem: 'O perfil TIPO 3 só possui permissão para cadastrar usuários do TIPO 2.' };
      }
      if (usuarioAtual.codigoPerfil === 'TIPO4' && !['TIPO2', 'TIPO3'].includes(dados.codigoPerfilDestino)) {
        return { sucesso: false, mensagem: 'O perfil TIPO 4 só possui permissão para cadastrar usuários do TIPO 2 e TIPO 3.' };
      }
      if (['TIPO3', 'TIPO4', 'TIPO7'].includes(usuarioAtual.codigoPerfil)) {
        perfilFinal = dados.codigoPerfilDestino;
      }
    }

    const novo: Usuario = {
      id: Date.now(),
      idPerfil: parseInt(perfilFinal.replace('TIPO', '')) || 1,
      codigoPerfil: perfilFinal,
      nomeCompleto: dados.nome,
      cpf: dados.cpf,
      email: dados.email,
      orgaoInstituicao: dados.orgao,
      cargoFuncao: dados.cargo,
      segmento: dados.segmento,
      statusConta: 'ATIVO',
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    setTodosUsuarios((prev) => [...prev, novo]);
    exibirNotificacao('sucesso', `Usuário ${novo.nomeCompleto} cadastrado com sucesso com perfil ${perfilFinal}!`);
    return { sucesso: true, mensagem: `Usuário cadastrado com sucesso como ${perfilFinal}` };
  };

  const fazerLogout = () => {
    // Volta para o perfil inicial TIPO1 desautenticado
    trocarPerfilAtivo('TIPO1');
    exibirNotificacao('info', 'Sessão encerrada com sucesso.');
  };

  // Cadastro de Curso (TIPO4, TIPO6 e TIPO7)
  const cadastrarCurso = (novoCurso: Curso) => {
    setCursos(prev => [novoCurso, ...prev]);
    exibirNotificacao('sucesso', `Curso "${novoCurso.nome}" publicado com sucesso!`);
  };

  // Emissão de Certificado após aprovação na prova
  const emitirCertificado = (idCurso: number, notaFinal: number): Certificado => {
    const curso = cursos.find(c => c.id === idCurso);
    const codigoHash = `EFAPP-CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const novoCertificado: Certificado = {
      id: Date.now(),
      codigoAutenticidade: codigoHash,
      idUsuario: usuarioAtual.id,
      idCurso: idCurso,
      nomeAluno: usuarioAtual.nomeCompleto,
      cpfAluno: usuarioAtual.cpf,
      nomeCurso: curso?.nome || 'Capacitação EFAPP',
      modalidade: curso?.modalidade || 'EAD',
      cargaHoraria: curso?.cargaHorariaHoras || 40,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      notaFinal: notaFinal,
      livroRegistro: `LIVRO-${new Date().getFullYear()}-03`,
      folhaRegistro: `FL-${Math.floor(Math.random() * 900 + 100)}`
    };

    setCertificados(prev => [novoCertificado, ...prev]);
    exibirNotificacao('sucesso', `Parabéns! Certificado oficial emitido com nota ${notaFinal.toFixed(1)}!`);
    return novoCertificado;
  };

  // Produtos e Loja Virtual
  const cadastrarProduto = (novoProduto: ProdutoLoja) => {
    setProdutos(prev => [novoProduto, ...prev]);
    exibirNotificacao('sucesso', `Produto "${novoProduto.nome}" cadastrado na loja!`);
  };

  const adicionarAoCarrinho = (produto: ProdutoLoja) => {
    setCarrinho(prev => {
      const existente = prev.find(item => item.produto.id === produto.id);
      if (existente) {
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
    exibirNotificacao('sucesso', `"${produto.nome}" adicionado ao carrinho!`);
  };

  const removerDoCarrinho = (idProduto: number) => {
    setCarrinho(prev => prev.filter(item => item.produto.id !== idProduto));
  };

  const limparCarrinho = () => setCarrinho([]);

  const finalizarCompra = (formaPagamento: string) => {
    if (carrinho.length === 0) {
      return { sucesso: false, mensagem: 'O carrinho está vazio.' };
    }

    const totalVenda = carrinho.reduce((acc, curr) => acc + (curr.produto.preco * curr.quantidade), 0);

    // Registra a receita na gestão financeira do TIPO5
    const lancamentoReceita: LancamentoFinanceiro = {
      id: Date.now(),
      tipoOperacao: 'RECEITA',
      subcategoria: 'VENDA_LOJA',
      descricao: `Venda na loja online: ${carrinho.map(c => `${c.quantidade}x ${c.produto.nome}`).join(', ')} - Cliente: ${usuarioAtual.nomeCompleto} (${usuarioAtual.cpf})`,
      valor: totalVenda,
      dataCompetencia: new Date().toISOString().split('T')[0],
      dataPagamento: new Date().toISOString().split('T')[0],
      status: 'PAGO'
    };

    setLancamentos(prev => [lancamentoReceita, ...prev]);
    limparCarrinho();
    exibirNotificacao('sucesso', `Pedido finalizado com sucesso via ${formaPagamento}! Total: R$ ${totalVenda.toFixed(2)}`);
    return { sucesso: true, mensagem: 'Compra efetuada com sucesso!' };
  };

  // Funções Pedagógicas e Financeiras (TIPO5 e TIPO7)
  const cadastrarInstituicao = (nova: Instituicao) => {
    setInstituicoes(prev => [...prev, nova]);
    exibirNotificacao('sucesso', `Instituição parceira "${nova.nome}" cadastrada!`);
  };

  const cadastrarProfessor = (novo: Professor) => {
    setProfessores(prev => [...prev, novo]);
    exibirNotificacao('sucesso', `Professor(a) "${novo.nome}" cadastrado(a) no corpo docente!`);
  };

  const cadastrarCronograma = (novo: CronogramaCurso) => {
    setCronogramas(prev => [...prev, novo]);
    exibirNotificacao('sucesso', `Cronograma para o curso "${novo.nomeCurso}" adicionado ao calendário!`);
  };

  const cadastrarEscala = (nova: EscalaProfessor) => {
    setEscalas(prev => [...prev, nova]);
    exibirNotificacao('sucesso', `Escala agendada para ${nova.nomeProfessor} no dia ${nova.dataAula}!`);
  };

  const atualizarStatusEscala = (idEscala: number, status: 'AGENDADA' | 'MINISTRADA' | 'CANCELADA') => {
    setEscalas(prev => prev.map(e => e.id === idEscala ? { ...e, status } : e));
    exibirNotificacao('info', `Status da aula atualizado para ${status}`);
  };

  const lancarTransacaoFinanceira = (transacao: LancamentoFinanceiro) => {
    setLancamentos(prev => [transacao, ...prev]);
    exibirNotificacao('sucesso', `Lançamento de ${transacao.tipoOperacao} registrado com sucesso!`);
  };

  // Relatório de Pagamentos a Professores com base nas escalas ministradas
  const obterRelatorioPagamentoProfessores = (): RelatorioPagamentoProfessor[] => {
    return professores.map(prof => {
      // Filtra as aulas ministradas por esse professor
      const aulasMinistradas = escalas.filter(e => e.idProfessor === prof.id && e.status === 'MINISTRADA');
      const totalHoras = aulasMinistradas.reduce((acc, a) => acc + a.totalHoras, 0);
      const bruto = totalHoras * prof.valorHoraAula;
      const descontos = bruto * 0.11; // 11% retenção INSS padrão
      const liquido = bruto - descontos;

      return {
        idProfessor: prof.id,
        nomeProfessor: prof.nome,
        titulacao: prof.titulacao,
        horasMinistradas: totalHoras,
        valorHora: prof.valorHoraAula,
        totalBruto: bruto,
        descontos: descontos,
        totalLiquido: liquido,
        chavePix: prof.chavePix
      };
    });
  };

  return (
    <AppContext.Provider
      value={{
        usuarioAtual,
        trocarPerfilAtivo,
        todosUsuarios,
        cadastrarNovoUsuario,
        realizarLoginEfapp,
        fazerLogout,
        cursos,
        cadastrarCurso,
        emitirCertificado,
        certificados,
        produtos,
        cadastrarProduto,
        carrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        limparCarrinho,
        finalizarCompra,
        instituicoes,
        cadastrarInstituicao,
        professores,
        cadastrarProfessor,
        cronogramas,
        cadastrarCronograma,
        escalas,
        cadastrarEscala,
        atualizarStatusEscala,
        lancamentos,
        lancarTransacaoFinanceira,
        obterRelatorioPagamentoProfessores,
        notificacao,
        exibirNotificacao
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
};
