export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  balance: number;
  createdAt: Date;
  user: any;
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
  // accountType: "personal" | "business" | "visa" | "high_limit" | "low_limit";
  accountType: string;
  defaultLimit: number;
  pricePerDay: number;
  // status: "available" | "rented" | "unavailable";
  status: string;
  notes?: string;
  bmName?: string;
  bmType?: string;
  adAccountType?: string;
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
  status:
    | "rented"
    | "available"
    | "expired"
    | "cancelled"
    | "unavailable"
    | "active";
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
