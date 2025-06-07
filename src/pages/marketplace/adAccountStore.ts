import { create } from "zustand";
import { AdAccount } from "../../types";

const mockAdAccounts: AdAccount[] = [
  {
    id: "1",
    name: "TKQC Cá nhân - Visa",
    accountType: "visa",
    defaultLimit: 5000000,
    pricePerDay: 200000,
    status: "available",
    notes: "TKQC sạch, limit cao, phù hợp mọi ngành hàng",
  },
  {
    id: "2",
    name: "TKQC BM - Visa",
    accountType: "visa",
    defaultLimit: 10000000,
    pricePerDay: 350000,
    status: "available",
    notes: "TKQC BM chất lượng cao, đã verify danh tính",
  },
  {
    id: "3",
    name: "TKQC Cá nhân - Limit thấp",
    accountType: "low_limit",
    defaultLimit: 2000000,
    pricePerDay: 100000,
    status: "available",
  },
  {
    id: "4",
    name: "TKQC BM - Limit cao",
    accountType: "high_limit",
    defaultLimit: 20000000,
    pricePerDay: 500000,
    status: "available",
    notes: "TKQC BM premium, limit cực cao, phù hợp cho chiến dịch lớn",
  },
  {
    id: "5",
    name: "TKQC Cá nhân - Standard",
    accountType: "visa",
    defaultLimit: 3000000,
    pricePerDay: 150000,
    status: "available",
    notes: "TKQC tiêu chuẩn, phù hợp cho người mới bắt đầu",
  },
];

interface AdAccountState {
  accounts: AdAccount[];
  filteredAccounts: AdAccount[];
  searchTerm: string;
  selectedType: string;
  selectedAccountType: string;
  addAccount: (account: AdAccount) => void;
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: string) => void;
  setSelectedAccountType: (accountType: string) => void;
}

export const useAdAccountStore = create<AdAccountState>((set) => ({
  accounts: mockAdAccounts,
  filteredAccounts: mockAdAccounts,
  searchTerm: "",
  selectedType: "all",
  selectedAccountType: "all",
  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account],
      filteredAccounts: [...state.accounts, account],
    })),
  setSearchTerm: (term) =>
    set((state) => {
      const results = state.accounts.filter((account) =>
        account.name.toLowerCase().includes(term.toLowerCase())
      );
      return { searchTerm: term, filteredAccounts: results };
    }),
  setSelectedType: (type) =>
    set((state) => {
      let results = state.accounts;
      if (state.searchTerm) {
        results = results.filter(
          (account) =>
            account.name
              .toLowerCase()
              .includes(state.searchTerm.toLowerCase()) ||
            account.bmName
              ?.toLowerCase()
              .includes(state.searchTerm.toLowerCase()) ||
            account.notes
              ?.toLowerCase()
              .includes(state.searchTerm.toLowerCase())
        );
      }
      if (type !== "all") {
        results = results.filter((account) => account.bmType === type);
      }
      if (state.selectedAccountType !== "all") {
        results = results.filter(
          (account) => account.accountType === state.selectedAccountType
        );
      }
      return { selectedType: type, filteredAccounts: results };
    }),
  setSelectedAccountType: (accountType) =>
    set((state) => {
      let results = state.accounts;
      if (state.searchTerm) {
        results = results.filter(
          (account) =>
            account.name
              .toLowerCase()
              .includes(state.searchTerm.toLowerCase()) ||
            account.bmName
              ?.toLowerCase()
              .includes(state.searchTerm.toLowerCase()) ||
            account.notes
              ?.toLowerCase()
              .includes(state.searchTerm.toLowerCase())
        );
      }
      if (state.selectedType !== "all") {
        results = results.filter(
          (account) => account.bmType === state.selectedType
        );
      }
      if (accountType !== "all") {
        results = results.filter(
          (account) => account.accountType === accountType
        );
      }
      return { selectedAccountType: accountType, filteredAccounts: results };
    }),
}));
