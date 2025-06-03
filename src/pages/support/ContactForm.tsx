import React from 'react';
import { Send, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { useFormStore } from '../../stores/useFormStore.ts';
import FormField from './FormField.tsx';

const ContactForm: React.FC = () => {
    const {
        formData,
        errors,
        touched,
        isLoading,
        isSubmitted,
        setField,
        setTouched,
        submitForm
    } = useFormStore();

    const handleChange = (field: keyof typeof formData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setField(field, e.target.value);
    };

    const handleBlur = (field: keyof typeof formData) => () => setTouched(field);

    const isFormValid =
        Object.keys(errors).length === 0 &&
        Object.values(formData).every(val => val.trim() !== '');

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <CheckCircle className="text-green-600 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Gửi thành công!</h2>
                    <p className="text-gray-600 mb-6">
                        Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
            <div className="">
                <FormField
                    label="Họ và tên *"
                    name="name"
                    placeholder="Nhập họ và tên của bạn"
                    icon={<User className="w-5 h-5 text-gray-400" />}
                    value={formData.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    error={touched.name ? errors.name : undefined}
                />
                <FormField
                    label="Email *"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    icon={<Mail className="w-5 h-5 text-gray-400" />}
                    value={formData.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={touched.email  ? errors.email : undefined}
                />
                <FormField
                    label="Số điện thoại *"
                    name="phone"
                    type="tel"
                    placeholder="0123 456 789"
                    icon={<Phone className="w-5 h-5 text-gray-400" />}
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    error={touched.phone  ? errors.phone : undefined}
                />
                <FormField
                    label="Tin nhắn *"
                    name="message"
                    placeholder="Nhập tin nhắn của bạn tại đây..."
                    icon={<MessageSquare className="w-5 h-5 text-gray-400" />}
                    isTextarea
                    value={formData.message}
                    onChange={handleChange('message')}
                    onBlur={handleBlur('message')}
                    error={touched.message  ? errors.message : undefined}
                />

                <button
                    onClick={submitForm}
                    disabled={!isFormValid || isLoading}
                    className={`w-full mt-6 py-4 rounded-2xl font-semibold text-white transition transform hover:scale-[1.02] ${
                        isFormValid && !isLoading
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Đang gửi...</span>
                        </span>
                    ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <Send className="w-5 h-5" />
                          <span>Gửi tin nhắn</span>
                        </span>
                    )}
                </button>
            </div>

            {/* Image section */}
            <div className="hidden lg:block">
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                    <img src="/aka2.jpg" alt="Support team" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-2xl font-bold mb-1">Hỗ trợ tận tâm</h3>
                        <p className="text-sm text-white/90">
                            Đội ngũ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
