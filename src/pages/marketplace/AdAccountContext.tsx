import React, { createContext, useContext, useState } from "react";
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
        accountType: "personal",
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
        accountType: "low_limit",
        defaultLimit: 3000000,
        pricePerDay: 150000,
        status: "available",
        notes: "TKQC tiêu chuẩn, phù hợp cho người mới bắt đầu",
    },
];

interface AdAccountContextType {
    accounts: AdAccount[];
    addAccount: (account: AdAccount) => void;
}

const AdAccountContext = createContext<AdAccountContextType | undefined>(undefined);

export const useAdAccountContext = () => {
    const context = useContext(AdAccountContext);
    if (!context) {
        throw new Error("useAdAccountContext must be used within an AdAccountProvider");
    }
    return context;
};

export const AdAccountProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [accounts, setAccounts] = useState<AdAccount[]>(mockAdAccounts);

    const addAccount = (account: AdAccount) => {
        setAccounts((prev) => [...prev, account]);
        console.log("accounts",accounts);
    };

    return (
        <AdAccountContext.Provider value={{ accounts, addAccount }}>
            {children}
        </AdAccountContext.Provider>
    );
};
