import React, {useEffect, useState} from 'react';
import PricingCard from './PricingCard';
import BaseHeader from "../../api/BaseHeader.ts";

interface BudgetItem {
    id?: string;
    name: string;
    description: string[];
    amount: number;
    start_date: string;
    end_date: string;
    currency: string;
    percentage: number;
    highlight: boolean;
    buttonLabel: string;
    buttonColor: string;
    buttonContact: string;
    subtitle: string;
    overview: string;
    buttonLabelEN: string;
    buttonContactEN: string;
}

const PricingPage: React.FC = () => {
    const [data, setData] = useState<BudgetItem[]>([]);

    useEffect(() => {
        const language = localStorage.getItem("language");
        const langParse = language ? JSON.parse(language).language : 'vi'; // default la vi
        const fetch = async () => {
            try {
                const res = await BaseHeader({
                    method: 'get',
                    url: '/budget',
                    params: {
                      lang: langParse,
                    },
                });
                setData(res.data.data || []);
            } catch {
                setData([]);
            }
        };
        fetch();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 max-w-7xl mx-auto">
            {data.map((plan, index) => (
                <PricingCard
                    key = {index}
                    {...plan}
                />
            ))}
        </div>
    );
};

export default PricingPage;
