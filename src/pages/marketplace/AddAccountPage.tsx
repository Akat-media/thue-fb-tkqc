import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { AdAccount } from "../../types";
import { useAdAccountContext } from "./AdAccountContext";

interface FormData {
    adAccountType: string;
    name: string;
    accountType: string;
    defaultLimit: string;
    pricePerDay: string;
    notes: string;
}

const AddAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const { addAccount } = useAdAccountContext();

    const [formData, setFormData] = useState<FormData>({
        adAccountType: "",
        name: "",
        accountType: "",
        defaultLimit: "",
        pricePerDay: "",
        notes: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            formData.adAccountType &&
            formData.name &&
            formData.accountType &&
            formData.defaultLimit &&
            formData.pricePerDay
        ) {
            const newAccount: AdAccount = {
                id: Date.now().toString(),
                name: `${formData.name} - ${
                    formData.adAccountType.charAt(0).toUpperCase() + formData.adAccountType.slice(1)
                }`,
                accountType: formData.accountType as "personal" | "business" | "visa" | "high_limit" | "low_limit",
                defaultLimit: parseFloat(formData.defaultLimit),
                pricePerDay: parseFloat(formData.pricePerDay),
                status: "available",
                notes: formData.notes || "Không có ghi chú",
            };
            console.log("newAccount", newAccount);
            addAccount(newAccount);
            setFormData({
                adAccountType: "",
                name: "",
                accountType: "",
                defaultLimit: "",
                pricePerDay: "",
                notes: "",
            });
            navigate("/marketplace");
        } else {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
        }
    };

    const handleCancel = () => {
        navigate("/marketplace");
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
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                required
                            >
                                <option value="">Chọn loại tài khoản quảng cáo</option>
                                <option value="facebook">Facebook Ads</option>
                                <option value="google">Google Ads</option>
                                <option value="tiktok">TikTok Ads</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên tài khoản</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Loại tài khoản</label>
                            <select
                                name="accountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                required
                            >
                                <option value="">Chọn loại tài khoản</option>
                                <option value="personal">Cá nhân</option>
                                <option value="business">Doanh nghiệp</option>
                                <option value="visa">Visa</option>
                                <option value="high_limit">Limit cao</option>
                                <option value="low_limit">Limit thấp</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Limit mặc định (USD)
                            </label>
                            <input
                                type="number"
                                name="defaultLimit"
                                value={formData.defaultLimit}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Giá thuê ngày (USD)
                            </label>
                            <input
                                type="number"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                required
                                min="0"
                                step="0.01"
                            />
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
