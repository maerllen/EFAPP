/**
 * EFAPP - Contêiner de Proteção Anticópia Institucional
 * Desativa clique direito, seleção de texto, atalhos de cópia (Ctrl+C, Ctrl+P, PrintScreen)
 * e exibe aviso de segurança caso o usuário tente copiar o conteúdo
 */

import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface ProtecaoCopiaContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ProtecaoCopiaContainer: React.FC<ProtecaoCopiaContainerProps> = ({
  children,
  className = ''
}) => {
  const { exibirNotificacao, usuarioAtual } = useApp();

  // Bloqueio de clique direito
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    exibirNotificacao(
      'info',
      `Ação bloqueada: Conteúdo protegido da EFAPP com rastreabilidade via CPF (${usuarioAtual.cpf}). O clique direito está desativado.`
    );
  };

  // Bloqueio de evento de cópia
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    exibirNotificacao(
      'erro',
      'Cópia de conteúdo não permitida. Todos os materiais escritos e apostilas são de uso exclusivo e rastreados pelo seu CPF.'
    );
  };

  // Interceptação de atalhos comuns de teclado (Ctrl+C, Ctrl+A, Ctrl+P, Ctrl+S, Ctrl+U, PrintScreen)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
    if (
      (isCtrlOrMeta && ['c', 'p', 's', 'u', 'a'].includes(e.key.toLowerCase())) ||
      e.key === 'PrintScreen'
    ) {
      e.preventDefault();
      exibirNotificacao(
        'erro',
        `Atalho [${e.key.toUpperCase()}] desativado. Material didático registrado em nome de ${usuarioAtual.nomeCompleto} (CPF: ${usuarioAtual.cpf}).`
      );
    }
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      onCopy={handleCopy}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={`select-none focus:outline-none relative ${className}`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};
