import React, { useState } from "react";
import AccountSidebar from "./AccountSidebar";
import AccountForm from "./AccountForm";
import ChangePasswordForm from "./ChangePasswordForm.tsx";

const AccountPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"account" | "password">("account");

    return (
        <div className="p-8 space-y-6">
            <div>
                <h2 className="text-2xl font-semibold">Tài khoản</h2>
                <nav className="text-sm text-gray-500 mt-1">Trang chủ &gt; Tài khoản</nav>
            </div>

            <div className="flex items-center space-x-8 border-b pb-4">
                <button
                    className={`pb-1 font-semibold ${activeTab === "account" ? "border-b-2 border-black" : "text-gray-400"}`}
                    onClick={() => setActiveTab("account")}
                >
                    Thông tin chung
                </button>
                <button
                    className={`pb-1 font-semibold ${activeTab === "password" ? "border-b-2 border-black" : "text-gray-400"}`}
                    onClick={() => setActiveTab("password")}
                >
                    Đổi mật khẩu
                </button>
            </div>

            {activeTab === "account" && (
                <div className="flex flex-col lg:flex-row gap-8">
                    <AccountSidebar />
                    <AccountForm />
                </div>
            )}

            {activeTab === "password" && (
                <div>
                    <ChangePasswordForm />
                </div>
            )}
        </div>
    );
};

export default AccountPage;
