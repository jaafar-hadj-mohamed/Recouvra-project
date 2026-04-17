export interface Stats {
  totalInvoices: number;
  totalUnpaidAmount: number;
  totalCollectedAmount: number;
  totalClients: number;
}

export interface StatsResponse {
  success: boolean;
  data: Stats;
}
