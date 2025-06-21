import React from 'react';

interface Plan {
    name: string;
    priceMonthly: number;
    features: string[];
    popular?: boolean;
}

interface Props {
    plans: Plan[];
}

const PricingTable: React.FC<Props> = ({ plans }) => {
    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {plans.map((plan) => (
                <div
                    key={plan.name}
                    className={`relative flex flex-col p-6 rounded-2xl border ${
                        plan.popular
                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white'
                    }`}
                >
                    {plan.popular && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-sm px-3 py-1 rounded-bl">
                            Phổ biến
                        </div>
                    )}
                    <h2 className="text-xl font-semibold mb-4">{plan.name}</h2>
                    <div className="mb-6">
                        <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                        <span className="text-gray-600">/tháng</span>
                    </div>
                    <ul className="flex-1 mb-6 space-y-2">
                        {plan.features.map((f) => (
                            <li key={f} className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 01.083 1.32l-.083.094L8.414 15l-4.707-4.707a1 1 0 011.32-1.497l.094.083L8.414 12.586l7.879-7.879a1 1 0 011.414 0z" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>
                    <button
                        className={`mt-4 py-2 px-4 rounded-lg text-white ${
                            plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'
                        }`}
                    >
                        Chọn {plan.name}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default PricingTable;
