export enum TicketStatus {
  AVAILABLE = 'AVAILABLE',
  SELECTED = 'SELECTED',
  SOLD = 'SOLD'
}

export interface Ticket {
  number: number;
  status: TicketStatus;
  buyerName?: string;
  buyerPhone?: string;
  buyerEmail?: string;
  purchaseDate?: string;
  amountPaid?: number;
}

export interface BuyerInfo {
  fullName: string;
  phone: string;
  email: string;
}

export interface RaffleConfig {
  ticketPrice: number;
  totalNumbers: number;
  currencySymbol: string;
}

export interface GeminiContent {
  title: string;
  description: string;
  prizeHighlights: string[];
}
