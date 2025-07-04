import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import BaseHeader from '../../api/BaseHeader';

interface PolicySection {
  id: string;
  title: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const Policy: React.FC = () => {
  const [openSections, setOpenSections] = React.useState<
    Record<number, boolean>
  >({ '0': true });
  const [policies, setPolicies] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await BaseHeader({
        method: 'get',
        url: 'policies',
      });
      setPolicies(response.data.data || []);
      // setOpenSections(response.data.data?.[0] || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies([
        {
          id: '1',
          title: 'Điều Khoản Sử Dụng',
          message:
            'Người dùng phải từ 18 tuổi trở lên để sử dụng dịch vụ của AKA MEDIA.\nMọi hành vi vi phạm pháp luật hoặc gây hại đến hệ thống sẽ bị cấm và có thể dẫn đến khóa tài khoản.\nAKA MEDIA có quyền thay đổi điều khoản mà không cần thông báo trước.\nNgười dùng chịu trách nhiệm bảo mật thông tin tài khoản của mình.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Chính Sách Bảo Mật',
          message:
            'Chúng tôi thu thập thông tin cá nhân (tên, email, số điện thoại) để cung cấp dịch vụ và cải thiện trải nghiệm người dùng.\nThông tin của bạn sẽ không được chia sẻ với bên thứ ba mà không có sự đồng ý, trừ khi có yêu cầu từ cơ quan pháp luật.\nChúng tôi sử dụng công nghệ mã hóa để bảo vệ dữ liệu người dùng.\nNgười dùng có quyền yêu cầu xóa dữ liệu cá nhân của mình bằng cách liên hệ qua support@akamedia.com.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Chính Sách Thanh Toán',
          message:
            'Mọi giao dịch thanh toán phải được thực hiện qua các phương thức được AKA MEDIA hỗ trợ.\nKhông hoàn tiền cho các giao dịch đã hoàn tất, trừ khi có lỗi từ phía hệ thống.\nThời gian xử lý giao dịch có thể mất từ 1-3 ngày làm việc.\nNgười dùng cần cung cấp thông tin chính xác để tránh sai sót trong quá trình thanh toán.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (index: any) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  console.log(openSections);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-200 to-cyan-100">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-blue-900 sm:text-4xl">
              Chính Sách và Điều Khoản
            </h2>
            <p className="mt-4 text-lg text-blue-900">
              Vui lòng đọc kỹ các chính sách dưới đây để hiểu rõ quyền lợi và
              trách nhiệm khi sử dụng dịch vụ của AKA MEDIA.
            </p>
          </div>

          <div className="space-y-6">
            {policies.map((policy, index) => (
              <div
                key={policy.id}
                className="bg-white rounded-lg shadow-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-white to-blue-100 text-left text-lg font-semibold text-blue-900 hover:bg-gray-100 transition-colors"
                >
                  <span>{policy.title}</span>
                  {openSections[index] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600 transition-transform duration-1000" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600 transition-transform duration-1000" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-1000 ease-in-out ${
                    openSections[index]
                      ? 'opacity-100 overflow-y-auto'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4 bg-white">
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {policy.message}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Policy;
