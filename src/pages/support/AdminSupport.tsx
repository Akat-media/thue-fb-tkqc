import Layout from "../../components/layout/Layout.tsx";
import { Bell, Settings, User } from "lucide-react";
import AdminSupportRequests from "./AdminSupportRequests.tsx";

const AdminSupport = () => {
    return (
        <Layout>
            {/* Header */}
            <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-yellow-300" />
                    <span className="font-medium font-sans text-sm sm:text-base">AKA Media</span>
                </div>
                <div className="flex items-center gap-3 sm:gap-6">
                    <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-full bg-gray-950/2 px-2 py-1 inset-ring inset-ring-gray-950/8 dark:bg-white/5 dark:inset-ring-white/2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            className="-ml-0.5 size-4 fill-gray-600 dark:fill-gray-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <kbd className="font-sans text-xs text-gray-500 not-[.os-macos_&]:block dark:text-gray-400 hidden sm:block">
                            Ctrl K
                        </kbd>
                    </button>
                    <Settings className="w-5 h-5 text-gray-600 cursor-pointer sm:w-6 sm:h-6" />
                    <User className="w-5 h-5 text-gray-600 cursor-pointer sm:w-6 sm:h-6" />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col min-w-0">
                <div
                    className="w-full max-w-screen-2xl box-border px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 flex flex-col flex-1"
                >
                    <div className="mb-6 sm:mb-8 text-lg sm:text-xl font-bold leading-6 font-sans">
                        Danh sách câu hỏi của người dùng
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 font-sans font-medium">
                            AKA Media - giải pháp số toàn diện
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <AdminSupportRequests />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminSupport;
