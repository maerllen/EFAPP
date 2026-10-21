/**
 * EFAPP - Componente de Marca d'Água Dinâmica Anticópia
 * Renderiza o CPF e nome do usuário sobreposto em vídeos e apostilas,
 * em padrão diagonal repetido e com elemento flutuante para rastreabilidade
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldAlert } from 'lucide-react';

interface WatermarkOverlayProps {
  modo?: 'completo' | 'sutil';
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({ modo = 'completo' }) => {
  const { usuarioAtual } = useApp();
  const [dataHora, setDataHora] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [posicaoFlutuante, setPosicaoFlutuante] = useState({ top: 20, left: 30 });

  // Atualiza horário e desloca a marca d'água dinâmica levemente para impedir cortes de vídeo
  useEffect(() => {
    const timer = setInterval(() => {
      setDataHora(new Date().toLocaleTimeString('pt-BR'));
      setPosicaoFlutuante({
        top: Math.floor(Math.random() * 70) + 10,
        left: Math.floor(Math.random() * 65) + 10,
      });
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const textoMarcaDagua = `EFAPP • CPF: ${usuarioAtual.cpf} • ${usuarioAtual.nomeCompleto.toUpperCase()}`;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30 overflow-hidden">
      {/* 1. Grade Diagonal Repetida em todo o fundo */}
      <div className="absolute inset-0 flex flex-wrap justify-around items-center opacity-[0.07] gap-16 p-8">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="transform -rotate-25 whitespace-nowrap text-sm font-mono font-bold tracking-widest text-slate-900"
          >
            {textoMarcaDagua} — {dataHora}
          </div>
        ))}
      </div>

      {/* 2. Selo Flutuante Dinâmico com Alerta Institucional */}
      <div
        className="absolute transition-all duration-1000 ease-in-out px-3 py-1.5 rounded bg-black/20 backdrop-blur-[2px] border border-white/20 text-white/70 shadow-sm pointer-events-none text-xs font-mono font-medium flex items-center gap-1.5"
        style={{
          top: `${posicaoFlutuante.top}%`,
          left: `${posicaoFlutuante.left}%`,
        }}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>CONTEÚDO RASTREADO: {usuarioAtual.cpf} ({dataHora})</span>
      </div>

      {/* 3. Rodapé de Segurança Estacionário */}
      {modo === 'completo' && (
        <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/40 text-[10px] font-mono text-white/60">
          Uso Exclusivo e Pessoal: {usuarioAtual.nomeCompleto} | CPF: {usuarioAtual.cpf} | EFAPP Segurança EAD
        </div>
      )}
    </div>
  );
};
