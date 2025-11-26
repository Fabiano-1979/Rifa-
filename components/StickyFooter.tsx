import React from 'react';
import { RAFFLE_CONFIG } from '../constants';
import { ShoppingCart } from 'lucide-react';

interface StickyFooterProps {
  selectedCount: number;
  onCheckout: () => void;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ selectedCount, onCheckout }) => {
  const totalCost = selectedCount * RAFFLE_CONFIG.ticketPrice;

  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 font-medium">Total a Pagar</span>
          <div className="flex items-baseline gap-1">
             <span className="text-xs text-gray-500 font-bold">{RAFFLE_CONFIG.currencySymbol}</span>
             <span className="text-2xl font-bold text-gray-900">{totalCost.toFixed(2).replace('.', ',')}</span>
          </div>
          <span className="text-xs text-blue-600 font-medium">{selectedCount} números selecionados</span>
        </div>

        <button
          onClick={onCheckout}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-200 transition-all active:scale-95"
        >
          <span>Finalizar</span>
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default StickyFooter;