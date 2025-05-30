import React from "react";

const AccountSidebar: React.FC = () => {

    return (
        <div className="flex justify-center items-center ">
            <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-xs">
            <div className="flex justify-center mb-10">
                <img
                    src="/avatar.jpg"
                    alt="Avatar"
                    className="w-28 h-28 rounded-full border-4 border-white shadow"
                />
            </div>
            <p className="text-sm text-center text-gray-500 mb-6">
                Cho phép ảnh *.jpeg, *.jpg, *.png, *.gif <br />
                Dung lượng tối đa 3 Mb
            </p>
            <button className="w-full bg-red-100 text-red-600 hover:bg-red-200 font-semibold py-2 px-4 rounded-lg transition">
                Đổi ảnh đại diện
            </button>
        </div>
        </div>
    );
};

export default AccountSidebar;
