import React from 'react';
import { Ticket } from '../types';
import NumberBadge from './NumberBadge';

interface RaffleGridProps {
  tickets: Ticket[];
  onToggleTicket: (number: number) => void;
}

const RaffleGrid: React.FC<RaffleGridProps> = ({ tickets, onToggleTicket }) => {
  return (
    // Adjusted grid columns for 200 items:
    // Mobile: 5 cols
    // SM: 8 cols
    // MD: 10 cols
    // LG: 12 cols (for 200 items, 10 or 20 cols usually looks cleaner, let's stick to 10 for MD+)
    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5 sm:gap-2 md:gap-3">
      {tickets.map((ticket) => (
        <NumberBadge 
          key={ticket.number} 
          ticket={ticket} 
          onClick={onToggleTicket} 
        />
      ))}
    </div>
  );
};

export default RaffleGrid;
