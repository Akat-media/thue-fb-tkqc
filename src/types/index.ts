export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "payment" | "refund";
  status: "pending" | "completed" | "failed" | "cancelled";
  description: string;
  transactionCode?: string;
  createdAt: Date;
}

export interface AdAccount {
  id: string;
  name: string;
  accountType: "personal" | "business" | "visa" | "high_limit" | "low_limit";
  defaultLimit: number;
  pricePerDay: number;
  status: "available" | "rented" | "unavailable";
  notes?: string;
  bmName?: string;
  bmType?: string;
}

export interface Rental {
  id: string;
  userId: string;
  adAccountId: string;
  userBmId: string;
  startDate: Date;
  endDate: Date;
  requestedLimit: number;
  totalPrice: number;
  spentBudget: number;
  status: "pending" | "active" | "expired" | "cancelled";
  createdAt: Date;
}

export type NotificationType = "success" | "info" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}
