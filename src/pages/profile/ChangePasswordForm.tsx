import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseUrl } from "../../api/BaseHeader.ts";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface User {
    id?: string;
    password?: string;
}

const schema = z
    .object({
        oldPassword: z.string().min(1, "Mật khẩu cũ không được để trống"),
        newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

type ChangePasswordData = z.infer<typeof schema>;

const ChangePasswordForm: React.FC = () => {
    const user = localStorage.getItem("user");
    const initialUser: User = typeof user === "string" ? JSON.parse(user).user : {};

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ChangePasswordData>({
        resolver: zodResolver(schema),
        defaultValues: {
            oldPassword: initialUser.password || "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    // const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const onSubmit = async (data: ChangePasswordData) => {
        if (!initialUser.id) {
            toast.error("Không tìm thấy ID người dùng trong localStorage!", {
                position: "top-right",
                autoClose: 3000,
            });
            return;
        }

        try {
            const response = await axios.put(`${BaseUrl}/user/${initialUser.id}`, {
                password: data.newPassword,
            });
            console.log("response: ", response);
            toast.success("Cập nhật mật khẩu thành công!", {
                position: "top-right",
                autoClose: 3000,
            });
            localStorage.setItem(
                "user",
                JSON.stringify({ user: { ...initialUser, password: data.newPassword } })
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật mật khẩu:", error);
            toast.error("Có lỗi xảy ra khi cập nhật mật khẩu!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const eyeIcon = (visible: boolean) => (
        visible ? <FiEyeOff size={20} /> : <FiEye size={20} />
    );

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
            <ToastContainer />
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Old Password */}
                <div className="relative mb-6">
                    <input
                        type="password"
                        placeholder="Mật khẩu cũ"
                        {...register("oldPassword")}
                        className="w-full h-12 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 flex items-center justify-center"*/}
                    {/*    onClick={() => setShowOld((prev) => !prev)}*/}
                    {/*>*/}
                    {/*    {eyeIcon(showOld)}*/}
                    {/*</button>*/}
                    {errors.oldPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</p>
                    )}
                </div>

                {/* New Password */}
                <div className="relative mb-6">
                    <input
                        type={showNew ? "text" : "password"}
                        placeholder="Mật khẩu mới"
                        {...register("newPassword")}
                        className="w-full h-12 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 flex items-center justify-center"
                        onClick={() => setShowNew((prev) => !prev)}
                    >
                        {eyeIcon(showNew)}
                    </button>
                    {/*<p className="text-gray-500 text-sm mt-1">Mật khẩu phải có tối thiểu 6 ký tự</p>*/}
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="relative mb-6">
                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu mới"
                        {...register("confirmPassword")}
                        className="w-full h-12 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 flex items-center justify-center"
                        onClick={() => setShowConfirm((prev) => !prev)}
                    >
                        {eyeIcon(showConfirm)}
                    </button>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
