import React, { useState, useEffect } from 'react';
import { Ticket, TicketStatus, BuyerInfo, GeminiContent } from './types';
import { RAFFLE_CONFIG } from './constants';
import * as storageService from './services/storageService';
import * as geminiService from './services/geminiService';

import RaffleGrid from './components/RaffleGrid';
import StickyFooter from './components/StickyFooter';
import CheckoutModal from './components/CheckoutModal';
import { Ticket as TicketIcon, Info, Sparkles, Database } from 'lucide-react';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [raffleContent, setRaffleContent] = useState<GeminiContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  // Initial Load
  useEffect(() => {
    // 1. Load Ticket Data (Simulating Sheet Fetch)
    const data = storageService.initializeData();
    setTickets(data);

    // 2. Load Dynamic Content via Gemini
    const fetchContent = async () => {
      const content = await geminiService.generateRaffleTheme();
      if (content) {
        setRaffleContent(content);
      }
      setLoadingContent(false);
    };
    fetchContent();
  }, []);

  const selectedTickets = tickets.filter(t => t.status === TicketStatus.SELECTED);
  const soldCount = tickets.filter(t => t.status === TicketStatus.SOLD).length;
  const progressPercent = (soldCount / RAFFLE_CONFIG.totalNumbers) * 100;

  const handleToggleTicket = (number: number) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.number !== number) return ticket;
      
      // If it's sold, do nothing
      if (ticket.status === TicketStatus.SOLD) return ticket;

      // Toggle between AVAILABLE and SELECTED
      return {
        ...ticket,
        status: ticket.status === TicketStatus.SELECTED 
          ? TicketStatus.AVAILABLE 
          : TicketStatus.SELECTED
      };
    }));
  };

  const handleCheckoutSubmit = async (buyerInfo: BuyerInfo) => {
    const selectedNumbers = selectedTickets.map(t => t.number);
    
    // Call service to "Write to Sheet"
    const updatedTickets = await storageService.purchaseTickets(tickets, selectedNumbers, buyerInfo);
    
    setTickets(updatedTickets);
    // Modal closes automatically inside CheckoutModal on success
  };

  return (
    <div className="min-h-screen pb-32 flex flex-col bg-[#f8f9fa]">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide shadow-sm">
                  Rifa Digital Pro
                </span>
                {loadingContent && <span className="text-gray-400 text-xs animate-pulse">Carregando tema IA...</span>}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
                {raffleContent ? raffleContent.title : "Sorteio Tech 2024"}
              </h1>
               <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                {raffleContent 
                  ? raffleContent.description 
                  : "Participe da nossa rifa. Selecione seus números, preencha seus dados e boa sorte!"}
              </p>
            </div>
            
            {/* Admin Indicator (Visual Only) */}
            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 self-start">
               <Database className="w-3 h-3" />
               <span>Google Sheets Sync: Ativo</span>
            </div>
          </div>

          {raffleContent && (
            <div className="flex flex-wrap gap-2 mb-8">
              {raffleContent.prizeHighlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                  {highlight}
                </div>
              ))}
            </div>
          )}

          {/* Stats Bar */}
          <div className="bg-white rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-center justify-between border border-gray-100 shadow-sm">
             <div className="flex items-center gap-6 w-full md:w-auto justify-center md:justify-start">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Valor do Número</span>
                  <span className="font-bold text-gray-900 text-2xl">
                    {RAFFLE_CONFIG.currencySymbol} {RAFFLE_CONFIG.ticketPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <div className="w-px h-10 bg-gray-200"></div>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Números Vendidos</span>
                  <span className="font-bold text-gray-900 text-2xl">
                    {soldCount} <span className="text-gray-300 text-lg font-medium">/ {RAFFLE_CONFIG.totalNumbers}</span>
                  </span>
                </div>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full md:max-w-xs">
               <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                 <span>Progresso da Rifa</span>
                 <span>{Math.round(progressPercent)}%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
                    style={{ width: `${progressPercent}%` }}
                  ></div>
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 py-8 w-full">
        
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-600 mb-6 bg-white py-3 px-6 rounded-xl border border-gray-100 shadow-sm w-fit mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded shadow-sm"></div>
            <span>Disponível</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded shadow-sm border border-blue-700"></div>
            <span className="font-bold text-blue-700">Selecionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
            <span className="text-gray-400">Vendido</span>
          </div>
        </div>

        {/* The Grid */}
        <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-sm border border-gray-200">
           <RaffleGrid tickets={tickets} onToggleTicket={handleToggleTicket} />
        </div>
        
        <div className="mt-6 flex items-start gap-3 text-sm text-gray-500 max-w-2xl mx-auto bg-white border border-blue-100 p-4 rounded-xl shadow-sm">
          <Info className="w-5 h-5 shrink-0 text-blue-500" />
          <p>
            Clique nos números para selecionar. Ao finalizar, clique em <strong>Finalizar</strong> na barra inferior. 
            Números já comprados exibem o nome do participante ao passar o mouse.
          </p>
        </div>
      </main>

      {/* Sticky Action Bar */}
      <StickyFooter 
        selectedCount={selectedTickets.length} 
        onCheckout={() => setIsCheckoutOpen(true)} 
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedNumbers={selectedTickets.map(t => t.number)}
        config={RAFFLE_CONFIG}
        onSubmit={handleCheckoutSubmit}
      />
    </div>
  );
}

export default App;
