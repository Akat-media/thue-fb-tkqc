import React, {useEffect, useState} from 'react';
import PricingCard from './PricingCard';
import BaseHeader from "../../api/BaseHeader.ts";
import {useTranslation} from "react-i18next";
import { Col, ConfigProvider, Row } from 'antd';

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

    const { i18n } = useTranslation();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await BaseHeader({
                    method: 'get',
                    url: '/budget',
                    params: {
                        lang: i18n.language,
                    },
                });
                setData(res.data.data || []);
            } catch {
                setData([]);
            }
        };
        fetch();
    }, [i18n.language]);

    return (
    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 max-w-7xl mx-auto">
    <Row gutter={[24, 24]} className='pb-6'> 
    {data.map((plan, index) => (
        <Col key={index} xs={24} sm={24} md={12} lg={12} xl={12}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
            <PricingCard 
            key = {index}
            {...plan}
          />
            </div>
        </Col>
    ))}
    </Row>
    //   </div>
    );
};

export default PricingPage;
