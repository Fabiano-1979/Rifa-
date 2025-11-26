import { Ticket, TicketStatus, BuyerInfo } from '../types';
import { RAFFLE_CONFIG, MOCK_BUYERS, STORAGE_KEY } from '../constants';

// This service simulates the Google Sheets API interaction.
// In a real production build, this would fetch/post to a Serverless Function 
// that talks to the Google Sheets API.

export const initializeData = (): Ticket[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  
  // Create base 1-200 grid
  const baseTickets: Ticket[] = Array.from({ length: RAFFLE_CONFIG.totalNumbers }, (_, i) => ({
    number: i + 1,
    status: TicketStatus.AVAILABLE
  }));

  if (saved) {
    // Merge saved "Sheet Rows" into the grid
    const savedTickets = JSON.parse(saved) as Ticket[];
    return baseTickets.map(base => {
      const found = savedTickets.find(t => t.number === base.number);
      return found ? found : base;
    });
  }

  // Seed initial data if empty (Simulating existing rows in the Sheet)
  const ticketsWithData = baseTickets.map(t => {
    // Simulate ~10% already sold for demo purposes
    const isSold = Math.random() < 0.1;
    if (isSold) {
      return {
        ...t,
        status: TicketStatus.SOLD,
        buyerName: MOCK_BUYERS[Math.floor(Math.random() * MOCK_BUYERS.length)],
        buyerPhone: '(11) 99999-9999',
        buyerEmail: 'comprador@exemplo.com',
        purchaseDate: new Date().toISOString(),
        amountPaid: RAFFLE_CONFIG.ticketPrice
      };
    }
    return t;
  });
  
  // We only save the "Sold" tickets to storage, mimicking a database of transactions
  saveSheetData(ticketsWithData.filter(t => t.status === TicketStatus.SOLD));
  
  return ticketsWithData;
};

// Helper to save only sold tickets (Simulating the Spreadsheet Rows)
const saveSheetData = (tickets: Ticket[]) => {
  const soldTickets = tickets.filter(t => t.status === TicketStatus.SOLD);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(soldTickets));
  
  // Log for Admin transparency demonstration
  console.group("Google Sheets Sync Simulation");
  console.log("Syncing with Sheet ID: 1BxiMvs0XRA5nslRgGh5...");
  console.table(soldTickets.map(t => ({
    'Col A (Num)': t.number,
    'Col B (Name)': t.buyerName,
    'Col C (Phone)': t.buyerPhone,
    'Col D (Email)': t.buyerEmail,
    'Col E (Date)': t.purchaseDate,
    'Col F (Value)': t.amountPaid
  })));
  console.groupEnd();
};

export const purchaseTickets = async (
  currentTickets: Ticket[], 
  selectedNumbers: number[], 
  buyerInfo: BuyerInfo
): Promise<Ticket[]> => {
  // Simulate network latency for API Call
  await new Promise(resolve => setTimeout(resolve, 800));

  const newTickets = currentTickets.map(t => {
    if (selectedNumbers.includes(t.number)) {
      return {
        ...t,
        status: TicketStatus.SOLD,
        buyerName: buyerInfo.fullName,
        buyerPhone: buyerInfo.phone,
        buyerEmail: buyerInfo.email,
        purchaseDate: new Date().toISOString(),
        amountPaid: RAFFLE_CONFIG.ticketPrice
      };
    }
    return t;
  });
  
  saveSheetData(newTickets);
  return newTickets;
};
