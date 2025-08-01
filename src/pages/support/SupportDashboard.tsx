import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  X,
  Eye,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useUserStore } from '../../stores/useUserStore.ts';
import BaseHeader from '../../api/BaseHeader.ts';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.ts';
interface SupportRequest {
  id: string;
  title: string;
  sender: string;
  service: string;
  department: string;
  status: string;
  priority: string;
  lastUpdate: string;
  description: string;
  avatar?: string;
  full_name: string;
  updated_at: string;
  content: string;
  category: string;
  email: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const SupportDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState<SupportRequest[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [faq, setFaq] = useState<FAQItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const { t } = useTranslation();

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const { user } = useUserStore();
  const id = user?.id;

  const faqData: FAQItem[] = [
    {
      question:
        'Tài khoản thuê là tài khoản gì? Có khác gì tài khoản cá nhân không?',
      answer:
        'Tài khoản thuê là tài khoản quảng cáo được cung cấp sẵn với lịch sử chi tiêu và độ trust cao, giúp chạy ads hiệu quả hơn so với tài khoản mới hoặc cá nhân.',
    },
    {
      question: 'Tôi cần chuẩn bị gì để sử dụng tài khoản thuê?',
      answer:
        'Bạn chỉ cần có chiến dịch quảng cáo sẵn, team kỹ thuật hoặc media buyer; chúng tôi sẽ cấp quyền truy cập và hướng dẫn vận hành.',
    },
    {
      question: 'Dịch vụ có cam kết gì không? Nếu tài khoản bị khoá thì sao?',
      answer:
        'Chúng tôi cam kết hỗ trợ xử lý sự cố nhanh chóng, hoàn tiền hoặc thay thế tài khoản nếu lỗi phát sinh từ phía hệ thống (tùy chính sách từng gói).',
    },
    {
      question: 'Có thể thanh toán theo ngày/tuần/tháng không?',
      answer:
        'Có, các gói thuê được thiết kế linh hoạt: theo ngày, tuần, hoặc theo ngân sách tiêu dùng (CPM). Giá sẽ khác nhau tùy hạn mức và độ trust.',
    },
    {
      question: 'Có bị giới hạn ngành hàng hoặc nội dung quảng cáo không?',
      answer:
        'Có. Một số ngành bị giới hạn như tài chính, crypto, hoặc sản phẩm vi phạm chính sách nền tảng. Vui lòng liên hệ để kiểm tra nội dung trước khi chạy.',
    },
    {
      question:
        'Tôi có thể dùng tài khoản này để chạy cho nhiều Fanpage/Website không?',
      answer:
        'Tuỳ vào gói thuê. Một số gói hỗ trợ nhiều Fanpage/Domain, một số chỉ áp dụng cho 1-2 chiến dịch. Chúng tôi sẽ tư vấn rõ khi bạn đăng ký.',
    },
    {
      question: 'Thời gian nhận tài khoản sau khi đăng ký là bao lâu?',
      answer:
        'Thường từ 30 phút đến 2 giờ làm việc, tuỳ mức độ phê duyệt và số lượng tài khoản có sẵn.',
    },
  ];

  const faqDataEN: FAQItem[] = [
    {
      question:
        'What is a rented ad account? How is it different from a personal account?',
      answer:
        'A rented ad account is a pre-approved account with spending history and high trust, offering better performance than new or personal accounts.',
    },
    {
      question: 'What do I need to prepare to use a rented account?',
      answer:
        'You just need a ready ad campaign and a technical team or media buyer. We will grant access and provide guidance on how to operate it.',
    },
    {
      question:
        'Is there any service guarantee? What if the account gets banned?',
      answer:
        "We commit to quick issue resolution, refunds, or account replacements if the issue originates from the system (depending on each package's policy).",
    },
    {
      question: 'Can I pay daily, weekly, or monthly?',
      answer:
        'Yes, rental packages are flexible: daily, weekly, or based on ad spend (CPM). Prices vary by spending limit and trust level.',
    },
    {
      question: 'Are there any restrictions on industries or ad content?',
      answer:
        'Yes. Some industries are restricted, such as finance, crypto, or content that violates platform policies. Please contact us to check your content in advance.',
    },
    {
      question: 'Can I use the account for multiple Fanpages/Websites?',
      answer:
        'It depends on the package. Some support multiple Fanpages/Domains, while others are limited to 1–2 campaigns. We will advise clearly during registration.',
    },
    {
      question:
        'How long does it take to receive the account after registration?',
      answer:
        'Usually from 30 minutes to 2 working hours, depending on approval level and account availability.',
    },
  ];

  const fetchData = useCallback(
    async (targetPage = 1, isLoadMore = false, search = '', status = 'all') => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/support/user/${id}`, {
          params: {
            page: targetPage,
            limit: 6,
            search,
            status,
          },
        });

        const newData = response.data.data.data;
        const totalRecords = response.data.data.pagination.totalRecords;
        setTotalRecords(totalRecords);
        if (isLoadMore) {
          setData((prev) => [...prev, ...newData]);
        } else {
          setData(newData);
        }

        const loadedItems = isLoadMore
          ? data.length + newData.length
          : newData.length;

        setHasMore(loadedItems < totalRecords);
      } catch (err: any) {
        console.error('Lỗi khi fetch data:', err.message);
      } finally {
        setLoading(false);
      }
    },
    [id, baseUrl]
  );

  const debouncedFetchData = useMemo(
    () =>
      debounce((query: string, status: string) => {
        fetchData(1, false, query, status);
        setPage(1);
        // setHasMore(true);
      }, 800),
    [fetchData]
  );

  useEffect(() => {
    if (id) {
      debouncedFetchData(searchQuery, statusFilter);
    }
  }, [id, searchQuery, statusFilter]);

  useEffect(() => {
    return () => {
      debouncedFetchData.cancel();
    };
  }, [debouncedFetchData]);

  // xy ly khi click ben ngoai nut xoa yeu cau
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdownMenus = document.querySelectorAll('.dropdown-menu');
      let clickedInside = false;

      dropdownMenus.forEach((menu) => {
        if (menu.contains(target)) {
          clickedInside = true;
        }
      });

      if (!clickedInside) setOpenMenuId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true, searchQuery, statusFilter);
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await BaseHeader({
        method: 'delete',
        url: `support/${deleteTargetId}`,
      });
      // await axios.delete(`${baseUrl}/support/${deleteTargetId}`);
      setData((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setOpenMenuId(null);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    } catch (err: any) {
      console.error('Error deleting request:', err.message);
    }
  };

  const formatTimestampToDate = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    return `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const createRequest = () => {
    navigate('/support/create');
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: Clock,
        label: t('supportPage.hadData.pending'),
      },
      'in-progress': {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: TrendingUp,
        label: t('supportPage.hadData.inProgress'),
      },
      resolved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: CheckCircle2,
        label: t('supportPage.hadData.resolved'),
      },
      closed: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        icon: X,
        label: t('supportPage.hadData.closed'),
      },
    };
    return configs[status as keyof typeof configs];
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return t('supportPage.hadData.low');
      case 'medium':
        return t('supportPage.hadData.medium');
      case 'high':
        return t('supportPage.hadData.high');
      case 'urgent':
        return t('supportPage.hadData.urgent');
      default:
        return priority;
    }
  };

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Set FAQ based on language
  useEffect(() => {
    const language = localStorage.getItem('i18nextLng');
    const langParse = language ? language : 'vi';

    if (langParse === 'vi') {
      setFaq(faqData);
    } else {
      setFaq(faqDataEN);
    }
  }, [i18n.language]);

  return (
    <div className="min-h-[800px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className=" backdrop-blur-sm border-b border-white/20 z-50">
        <div className="container mx-auto px-6 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold leading-7 text-blue-900 sm:text-3xl sm:truncate">
                  {t('supportPage.header.header1')}
                </h2>
                <p className="mt-1 text-base text-gray-500">
                  {t('supportPage.header.header2')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-3">
              <div className="relative ">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-12 py-3 border border-gray-300 bg-gray-50 rounded-xl text-gray-700 hover:bg-blue-100 focus:ring-2 focus:ring-blue-500 transition-all min-w-[160px] appearance-none cursor-pointer
"
                >
                  <option value="all">
                    {t('supportPage.filter.status.status1')}
                  </option>
                  <option value="pending">
                    {t('supportPage.filter.status.status2')}
                  </option>
                  <option value="in-progress">
                    {t('supportPage.filter.status.status3')}
                  </option>
                  <option value="resolved">
                    {t('supportPage.filter.status.status4')}
                  </option>
                </select>
              </div>

              {/*<button className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 hover:bg-blue-100 transition-colors">*/}
              {/*    <Calendar className="w-4 h-4" />*/}
              {/*    Thời gian*/}
              {/*</button>*/}
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('supportPage.filter.search.placeHolder')}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border-0 bg-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-400"
                />
              </div>
              <button
                onClick={createRequest}
                className="flex items-center gap-2 bg-[#193250] hover:bg-[#1F3E68] text-[#24F9FB] px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                {t('supportPage.filter.search.create')}
              </button>
            </div>
          </div>
        </div>

        {/* Support Requests */}
        {data.length > 0 ? (
          <div className="max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-white-400 scrollbar-track-blue-100 space-y-4 pr-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.map((request: SupportRequest) => {
                const statusConfig = getStatusConfig(request.status);
                // const priorityConfig = getPriorityConfig(request.priority);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={request.id}
                    className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all space-y-4"
                  >
                    {/* Tiêu đề + trạng thái + ngày */}
                    <div className="flex justify-between items-start">
                      <div className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {request.title}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            getStatusConfig(request.status).bg
                          } ${getStatusConfig(request.status).text}`}
                        >
                          {getStatusConfig(request.status).label}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimestampToDate(request.updated_at)}
                        </div>
                      </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className="text-sm space-y-1">
                      <div>
                        <span className="font-medium">Danh mục:</span>{' '}
                        <span className="text-gray-700">
                          {request.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Mức độ ưu tiên:</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            request.priority === 'low'
                              ? 'bg-green-100 text-green-600'
                              : request.priority === 'medium'
                              ? 'bg-[#D6F0FF] text-[#007B9E]'
                              : request.priority === 'high'
                              ? 'bg-purple-100 text-purple-600'
                              : request.priority === 'urgent'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {getPriorityLabel(request.priority)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Email:</span>{' '}
                        <span className="text-gray-700">{request.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Nội dung:</span>
                        <div className="bg-gray-100 rounded-lg p-3 mt-1 text-sm text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
                          {request.content}
                        </div>
                      </div>
                    </div>

                    {/* Nút xem chi tiết */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => navigate(`/support/${request.id}`)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-600 border border-cyan-400 rounded-full hover:bg-cyan-50 transition-all"
                      >
                        {t('supportPage.hadData.seeDetail')}
                        <Eye className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md relative">
                    <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
                    <p>Bạn có chắc muốn xóa yêu cầu này không?</p>
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setShowDeleteModal(false);
                          setDeleteTargetId(null);
                        }}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleDelete()}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('supportPage.main.main1')}
              </h3>
              <p className="text-gray-500 mb-8">
                {t('supportPage.main.main2')}
              </p>
              <button
                onClick={createRequest}
                className="flex items-center gap-2 bg-[#193250] hover:bg-[#1F3E68] text-[#24F9FB] px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
              >
                <Plus className="w-5 h-5" />
                {t('supportPage.main.main3')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {hasMore && (
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2 mt-5">
            <p>
              Hiển thị {(page - 1) * pageSize + data.length} trong tổng số{' '}
              {totalRecords} kết quả
            </p>

            <div className="flex space-x-2">
              {[...Array(Math.ceil(totalRecords / pageSize)).keys()].map(
                (i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setPage(pageNum);
                        fetchData(pageNum, false, searchQuery, statusFilter);
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-medium transition ${
                        page === pageNum
                          ? 'bg-[#193250] text-[#24F9FB] border-[#24F9FB]'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Add FAQ section */}
        <div className="mt-8">
          <style>
            {`
              .faq-content {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.5s ease;
              }
              .faq-content.open {
                max-height: 500px;
              }
            `}
          </style>
          <h2 className="text-xl text-blue-900 font-bold mb-6">
            {i18n.language === 'vi'
              ? 'Câu hỏi thường gặp'
              : 'Frequently Asked Questions'}
          </h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {faq.map((item, index) => (
                <li key={index} className="overflow-hidden">
                  <button
                    className="w-full text-left p-4 flex justify-between items-center text-gray-700 font-medium hover:bg-gray-50"
                    onClick={() => toggleFAQ(index)}
                  >
                    {item.question}
                    <span className="text-gray-500 flex-shrink-0 ml-2">
                      {activeIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={`faq-content transition-all duration-300 ease-in-out overflow-hidden ${
                      activeIndex === index
                        ? 'open max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    } bg-indigo-50 pl-4 text-indigo-800 text-sm leading-relaxed rounded-b-lg`}
                  >
                    <div className="py-4 pl-2">{item.answer}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
