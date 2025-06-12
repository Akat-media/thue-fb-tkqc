import React, { useState } from "react";
import Layout from "../../components/layout/Layout.tsx";
import { AlertCircle, Send, Upload, X } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {useUserStore} from "../../stores/useUserStore.ts";

// interface FormData {
//     fullName: string;
//     email: string;
//     phone: string;
//     title: string;
//     department: string;
//     content: string;
// }

const supportRequestSchema = z.object({
    fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    department: z.string().refine(
        (val) => ["tech", "sales", "hr"].includes(val),
        { message: "Vui lòng chọn bộ phận" }
    ),
    content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự"),
    priority: z.string().refine(
        (val) => ["low", "medium", "high", "urgent"].includes(val),
        { message: "Vui lòng chọn mức độ ưu tiên hợp lệ" }
    ),
    category: z.string().refine(
        (val) => ["account", "pay", "recover","other"].includes(val),
        { message: "Vui lòng chọn danh mục hợp lệ" }
    ),
    status: z.string().optional(),
    user_id: z.string().uuid().optional(),
    attachments: z.array(z.string()).optional(),
});

type SupportRequestFormData = z.infer<typeof supportRequestSchema>;

const RequestForm: React.FC = () => {
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const user = useUserStore((state) => state.user);
    // console.log("user",user)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<SupportRequestFormData>({
        resolver: zodResolver(supportRequestSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phone: "",
            title: "",
            department: "",
            content: "",
            priority: "",
            category: "",
            status: "new",
        },
    });

    const departments = [
        { value: "", label: "Chọn bộ phận" },
        { value: "tech", label: "Hỗ trợ kỹ thuật" },
        { value: "sales", label: "Kinh doanh" },
        { value: "hr", label: "Hành chính nhân sự" },
    ];

    const priorities = [
        { value: "", label: "Chọn mức độ" },
        { value: "low", label: "Thấp" },
        { value: "medium", label: "Trung bình" },
        { value: "high", label: "Cao" },
        { value: "urgent", label: "Khẩn cấp" },
    ];

    const categories = [
        { value: "", label: "Chọn danh mục" },
        { value: "account", label: "Tài khoản" },
        { value: "pay", label: "Thanh toán" },
        { value: "recover", label: "Hoàn tiền" },
        { value: "other", label: "Khác" },
    ]

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
            "text/plain",
        ];

        const validFiles = files.filter((file) => {
            if (file.size > maxSize) {
                alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
                return false;
            }
            if (!allowedTypes.includes(file.type)) {
                alert(
                    `File ${file.name} không được hỗ trợ. Chỉ chấp nhận: JPG, PNG, GIF, PDF, TXT.`
                );
                return false;
            }
            return true;
        });

        setAttachments((prev) => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit: SubmitHandler<SupportRequestFormData> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("title", data.title);
            formData.append("department", data.department);
            formData.append("content", data.content);
            attachments?.forEach((file) => formData.append("attachments", file));
            formData.append("priority",data.priority);
            formData.append("category",data.category);
            // formData.append("status","new");

            const userId = user?.id;
            if (userId) {
                formData.append("user_id", userId);
            }
            console.log("Payload gửi đi:", Object.fromEntries(formData.entries()));

            const baseUrl = import.meta.env.VITE_BASE_URL;
            await axios.post(`${baseUrl}/support`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setSubmitSuccess(true);
            setAttachments([]);
            reset();
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Đã có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    if (submitSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-time justify-center p-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Gửi thành công!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Yêu cầu hỗ trợ của bạn đã được gửi. Chúng tôi sẽ phản hồi trong thời
                        gian sớm nhất.
                    </p>
                    <button
                        onClick={() => setSubmitSuccess(false)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Gửi yêu cầu khác
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                    <div className="backdrop-blur-sm border-b border-white/20 z-50">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
                                            Gửi yêu cầu hỗ trợ
                                        </h2>
                                        <p className="mt-1 text-base text-gray-500">
                                            <span>Chúng tôi sẵn sàng hỗ trợ bạn 24/7</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Họ và tên */}
                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    {...register("fullName")}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                        errors.fullName ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                                    placeholder="Nhập họ và tên của bạn"
                                />
                                {errors.fullName && (
                                    <div className="flex items-center mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.fullName.message}
                                    </div>
                                )}
                            </div>

                            {/* Email và Số điện thoại */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register("email")}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.email.message}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        {...register("phone")}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                        placeholder="0123456789"
                                    />
                                    {errors.phone && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.phone.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tiêu đề và Bộ phận */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        {...register("title")}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                        placeholder="Tóm tắt vấn đề của bạn"
                                    />
                                    {errors.title && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.title.message}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="department"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Bộ phận <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="department"
                                        {...register("department")}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.department ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                    >
                                        {departments.map((dept) => (
                                            <option key={dept.value} value={dept.value}>
                                                {dept.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.department && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.department.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/*muc do va the loai*/}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="priority"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Mức độ ưu tiên <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="priority"
                                        {...register("priority")}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.priority ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                    >
                                        {priorities.map((dept) => (
                                            <option key={dept.value} value={dept.value}>
                                                {dept.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.priority && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.priority.message}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="category"
                                        className="block text-sm font-semibold text-gray-700 mb-2"
                                    >
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        {...register("category")}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            errors.category ? "border-red-500 bg-red-50" : "border-gray-300"
                                        }`}
                                    >
                                        {categories.map((dept) => (
                                            <option key={dept.value} value={dept.value}>
                                                {dept.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <div className="flex items-center mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.category.message}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Nội dung */}
                            <div>
                                <label
                                    htmlFor="content"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Nội dung chi tiết <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    rows={5}
                                    {...register("content")}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                                        errors.content ? "border-red-500 bg-red-50" : "border-gray-300"
                                    }`}
                                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                                />
                                <div className="flex justify-between items-center mt-2">
                                    {errors.content ? (
                                        <div className="flex items-center text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.content.message}
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                          Tối thiểu 10 ký tự
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Đính kèm tệp */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Đính kèm tệp
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        Kéo thả file hoặc click để chọn
                                    </p>
                                    <p className="text-xs text-gray-500 mb-4">
                                        Hỗ trợ: JPG, PNG, GIF, PDF, TXT (tối đa 5MB)
                                    </p>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf,.txt"
                                        className="hidden"
                                        id="fileInput"
                                    />
                                    <label
                                        htmlFor="fileInput"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Chọn tệp
                                    </label>
                                </div>

                                {/* Danh sách file đã chọn */}
                                {attachments.length > 0 && (
                                    <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                                        {attachments.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                            >
                                                <div className="flex items-center flex-1 min-w-0">
                                                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                                                        <Upload className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatFileSize(file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang gửi...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Gửi yêu cầu
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RequestForm;
