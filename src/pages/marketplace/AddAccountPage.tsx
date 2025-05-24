import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { AdAccount } from '../../types';
import { useAdAccountStore } from './adAccountStore';

interface FormData {
    adAccountType: string;
    name: string;
    accountType: string;
    defaultLimit: string;
    pricePerDay: string;
    notes: string;
}

interface FormErrors {
    adAccountType?: string;
    name?: string;
    accountType?: string;
    defaultLimit?: string;
    pricePerDay?: string;
}

const AddAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const { addAccount } = useAdAccountStore();

    const [formData, setFormData] = useState<FormData>({
        adAccountType: '',
        name: '',
        accountType: '',
        defaultLimit: '',
        pricePerDay: '',
        notes: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.adAccountType) newErrors.adAccountType = 'Vui lòng chọn loại tài khoản quảng cáo';
        if (!formData.name) newErrors.name = 'Vui lòng nhập tên tài khoản';
        if (!formData.accountType) newErrors.accountType = 'Vui lòng chọn loại tài khoản';
        if (!formData.defaultLimit || isNaN(parseFloat(formData.defaultLimit)) || parseFloat(formData.defaultLimit) < 0) {
            newErrors.defaultLimit = 'Vui lòng nhập limit hợp lệ (số không âm)';
        }
        if (!formData.pricePerDay || isNaN(parseFloat(formData.pricePerDay)) || parseFloat(formData.pricePerDay) < 0) {
            newErrors.pricePerDay = 'Vui lòng nhập giá thuê hợp lệ (số không âm)';
        }
        return newErrors;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        const newAccount: AdAccount = {
            id: Date.now().toString(),
            name: `${formData.name} - ${
                formData.adAccountType.charAt(0).toUpperCase() + formData.adAccountType.slice(1)
            }`,
            accountType: formData.accountType as "personal" | "business" | "visa" | "high_limit" | "low_limit",
            defaultLimit: parseFloat(formData.defaultLimit),
            pricePerDay: parseFloat(formData.pricePerDay),
            status: 'available',
            notes: formData.notes || 'Không có ghi chú',
            adAccountType: formData.adAccountType as 'facebook' | 'google' | 'tiktok',
        };

        console.log("new acc", newAccount)
        addAccount(newAccount);
        setFormData({
            adAccountType: '',
            name: '',
            accountType: '',
            defaultLimit: '',
            pricePerDay: '',
            notes: '',
        });
        navigate('/marketplace');
    };

    const handleCancel = () => {
        navigate('/marketplace');
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Thêm Tài khoản Quảng cáo</h2>
                    <form id="accountForm" onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Loại tài khoản quảng cáo
                            </label>
                            <select
                                name="adAccountType"
                                value={formData.adAccountType}
                                onChange={handleChange}
                                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                    errors.adAccountType ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Chọn loại tài khoản quảng cáo</option>
                                <option value="facebook">Facebook Ads</option>
                                <option value="google">Google Ads</option>
                                <option value="tiktok">TikTok Ads</option>
                            </select>
                            {errors.adAccountType && (
                                <p className="mt-1 text-sm text-red-500">{errors.adAccountType}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                    errors.name ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Loại tài khoản</label>
                            <select
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                    errors.accountType ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Chọn loại tài khoản</option>
                                <option value="personal">Cá nhân</option>
                                <option value="business">Doanh nghiệp</option>
                                <option value="visa">Visa</option>
                                <option value="high_limit">Limit cao</option>
                                <option value="low_limit">Limit thấp</option>
                            </select>
                            {errors.accountType && (
                                <p className="mt-1 text-sm text-red-500">{errors.accountType}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Limit mặc định (VND)
                            </label>
                            <input
                                type="number"
                                name="defaultLimit"
                                value={formData.defaultLimit}
                                onChange={handleChange}
                                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                    errors.defaultLimit ? 'border-red-500' : ''
                                }`}
                                min="0"
                                step="0.01"
                            />
                            {errors.defaultLimit && (
                                <p className="mt-1 text-sm text-red-500">{errors.defaultLimit}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giá thuê ngày (VND)
                            </label>
                            <input
                                type="number"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                className={`mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${
                                    errors.pricePerDay ? 'border-red-500' : ''
                                }`}
                                min="0"
                                step="0.01"
                            />
                            {errors.pricePerDay && (
                                <p className="mt-1 text-sm text-red-500">{errors.pricePerDay}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Thêm tài khoản
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AddAccountPage;
