import React from 'react';
import { Ticket, TicketStatus } from '../types';
import { Lock, Check } from 'lucide-react';

interface NumberBadgeProps {
  ticket: Ticket;
  onClick: (number: number) => void;
}

const NumberBadge: React.FC<NumberBadgeProps> = ({ ticket, onClick }) => {
  const { number, status, buyerName } = ticket;

  // Adjusted classes for a denser grid (200 items)
  const baseClasses = "relative w-full aspect-square flex flex-col items-center justify-center rounded-md sm:rounded-lg border transition-all duration-200 select-none shadow-sm overflow-hidden";
  
  let statusClasses = "";
  let icon = null;

  switch (status) {
    case TicketStatus.AVAILABLE:
      statusClasses = "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md cursor-pointer active:scale-95";
      break;
    case TicketStatus.SELECTED:
      statusClasses = "bg-blue-600 border-blue-600 text-white shadow-blue-200 shadow-lg scale-105 z-10 cursor-pointer";
      icon = <Check className="w-3 h-3 sm:w-4 sm:h-4 absolute top-0.5 right-0.5 opacity-75" />;
      break;
    case TicketStatus.SOLD:
      statusClasses = "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed opacity-80";
      icon = <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 absolute top-0.5 right-0.5 opacity-50" />;
      break;
  }

  return (
    <div 
      className={`${baseClasses} ${statusClasses} group`}
      onClick={() => status !== TicketStatus.SOLD && onClick(number)}
    >
      {icon}
      <span className={`text-xs sm:text-sm md:text-base font-bold ${status === TicketStatus.SOLD ? 'line-through decoration-red-300 opacity-50' : ''}`}>
        {number.toString().padStart(3, '0')}
      </span>
      
      {/* Tooltip for Sold Items - displaying Buyer Name */}
      {status === TicketStatus.SOLD && buyerName && (
        <div className="absolute z-50 hidden group-hover:flex group-active:flex flex-col items-center bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[150px]">
           <div className="bg-gray-800 text-white text-[10px] sm:text-xs py-1.5 px-3 rounded shadow-xl text-center">
            <span className="block font-semibold mb-0.5">Adquirido por:</span>
            <span className="block truncate max-w-[120px]">{buyerName}</span>
          </div>
          <div className="w-2 h-2 bg-gray-800 rotate-45 -mt-1"></div>
        </div>
      )}
    </div>
  );
};

export default NumberBadge;
