import './style.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshCw,
  MoreHorizontal,
  Search,
  Folder,
  SendHorizontal,
  MailOpen,
  Plus,
  SlidersHorizontal,
  FolderUp,
  LayoutDashboard,
  PanelTop,
} from 'lucide-react';
import BaseHeader from '../../../api/BaseHeader';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import axios from 'axios';
import EmptyState from '../../../components/EmptyState';
import { debounce } from 'lodash';

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  return format(new Date(value), 'dd/MM/yyyy HH:mm');
};
const formatVNDV2 = (value?: number | string) => {
  if (value === null || value === undefined || value === '') return '0';
  const num = Number(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('vi-VN');
};
const Advertisement = () => {
  const [selectedSearch, setSelectedSearch] = useState(false);
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<any>('all');

  const [selectedFilter, setSelectedFilter] = useState({
    active: false,
    displayOnSearchBar: false,
    name: 'all',
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [chooseWallet, setChooseWallet] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [dataCampaign, setDataCampaign] = useState<any>([]);

  const fetchData = async () => {
    try {
      const payload = {
        wallet_id: selectedWalletId,
        ad_account_id: selectedFilter.name,
      };

      const [response] = await Promise.all([
        BaseHeader({
          url: '/campaign',
          method: 'get',
          params: payload,
        }),
      ]);
      const result = response.data.data;
      setDataCampaign(result);
      if (result.length > 0) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [selectedWalletId, selectedFilter]);

  const filteredWallets = wallets.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const fetchWallets = async (keyword = '') => {
    setLoading(true);
    try {
      const [response] = await Promise.all([
        BaseHeader({
          url: '/wallet-campaign',
          method: 'get',
          params: {
            query: keyword || undefined,
          },
        }),
      ]);
      const result = response.data.data.data;
      setWallets(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedGetWallet = useCallback(
    debounce((value: string) => {
      fetchWallets(value);
    }, 500),
    []
  );
  useEffect(() => {
    if (search) {
      debouncedGetWallet(search);
    } else {
      fetchWallets(); // search rỗng → load all
    }
    return () => {
      debouncedGetWallet.cancel();
    };
  }, [search]);
  const selectedWallet = useMemo(() => {
    return wallets?.find((w) => w.id === selectedWalletId) || [];
  }, [selectedWalletId, wallets]);

  console.log('selectedWallet', selectedWallet);
  console.log('selectedWallet?.adsAccounts', selectedWallet?.adsAccounts);
  const handleSelectedFilter = (name: any) => {
    setSelectedFilter({
      active: true,
      displayOnSearchBar: true,
      name: name,
    });
  };
  const handleToggleCampaign = async (item: any) => {
    try {
      const response = await BaseHeader({
        url: `/campaign`,
        method: 'put',
        data: {
          id: item.id,
          ads_id: item.ad_account_id,
          wallet_id: item.wallet_id,
          is_active: item.status === 'ACTIVE' ? false : true,
        },
      });
      if (response.status == 200) {
        toast.success('Cập nhật Campaiig khoản thành công!');
        fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra';
        toast.error(message);
      } else {
        toast.error('Lỗi không xác định');
      }
    }
  };
  return (
    <div className="page-fix">
      <div className="section-1 flex-col sm:flex-row">
        <div className="inner-left">
          <div className="text-[24px] font-bold ">Quản lý chiến dịch</div>
        </div>

        <div className="inner-right">
          <div className="inner-text-2">Thời gian cập nhật: vừa xong</div>
          <div
            className="button hover:bg-gray-200"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5 cursor-pointer" />
          </div>
          <div className="button hover:bg-gray-200">
            <MoreHorizontal className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Section 2: Bộ lọc và chế độ xem */}
      <div className="section-2">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[20px] font-medium">Ví liên kết: </span>
          <div className="relative w-[220px] sm:w-[286px]">
            {/* LABEL / BUTTON */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="w-full h-[46px] border border-gray-300 rounded-lg 
      px-3 flex items-center justify-between bg-white
      focus:ring-2 focus:ring-blue-500"
            >
              <span className="truncate font-medium">
                {chooseWallet ? chooseWallet.name : 'Tất cả'}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition ${
                  open ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeWidth="2" />
              </svg>
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg">
                {/* Search */}
                <div className="p-2 border-b relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên..."
                    className="w-full border rounded-lg pl-9 pr-3 py-2"
                  />
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>

                {/* List */}
                <div className="max-h-[300px] overflow-auto">
                  {/* Tất cả */}
                  <div
                    onClick={() => {
                      setChooseWallet(null);
                      setSelectedWalletId('all');
                      setOpen(false);
                    }}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                  >
                    Tất cả
                  </div>

                  {filteredWallets.length === 0 && (
                    <p className="text-center text-gray-400 py-6">
                      Không có kết quả
                    </p>
                  )}

                  {filteredWallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      onClick={() => {
                        setChooseWallet(wallet);
                        setSelectedWalletId(wallet.id);
                        setSelectedFilter({
                          active: true,
                          displayOnSearchBar: true,
                          name: 'all',
                        });
                        setOpen(false);
                      }}
                      className={`px-4 py-3 cursor-pointer
              hover:bg-blue-50
              ${selectedWallet?.id === wallet.id ? 'bg-blue-100' : ''}`}
                    >
                      <p className="font-medium">{wallet.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex flex-wrap items-center gap-2 pb-2">
          <button
            onClick={() => handleSelectedFilter('all')}
            className={`
      flex items-center gap-2 whitespace-nowrap
      px-4 py-2 rounded-full border transition-all
      ${
        selectedFilter.name === 'all'
          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
          : 'bg-white  border-gray-300 hover:bg-gray-100'
      }
    `}
          >
            <Folder className="w-4 h-4" />
            <span className="font-medium">Tất cả quảng cáo</span>
          </button>

          <div className="flex gap-2 flex-wrap flex-1">
            {selectedWallet?.adsAccounts?.map((acc: any) => (
              <button
                key={acc.id}
                onClick={() => handleSelectedFilter(acc.id)}
                className={`
        inline-flex items-center gap-3
        px-4 py-3 rounded-lg border
        ${
          selectedFilter.name === acc.id
            ? 'bg-blue-600 text-white'
            : 'bg-white hover:bg-gray-100'
        }
      `}
              >
                <Folder className="w-5 h-5" />
                <span className="font-medium">{acc.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="section-3 flex flex-col sm:flex-row ">
          <div className="sm:inner-left">
            <div
              className={`button button-round hover:bg-gray-200 mr-2 mb-2 sm:mb-0 bg-white
                                ${
                                  selectedFilter.name === 'two' ? 'active' : ''
                                } 
                            `}
              onClick={() => handleSelectedFilter('two')}
            >
              <SendHorizontal className="w-5 h-5 cursor-pointer" />
              <div className="inner-text">Quảng cáo đang hoạt động</div>
            </div>
            <div
              className={`button button-round hover:bg-gray-200 mr-2 mb-2 sm:mb-0 bg-white
                                ${
                                  selectedFilter.name === 'three'
                                    ? 'active'
                                    : ''
                                } 
                            `}
              onClick={() => handleSelectedFilter('three')}
            >
              <MailOpen className="w-5 h-5 cursor-pointer" />
              <div className="inner-text">Có phân phối</div>
            </div>
            <div className="button button-none hover:bg-gray-200">
              <Plus className="w-5 h-5 cursor-pointer" />
              <div className="inner-text">Xem thêm</div>
            </div>
          </div>

          <div className="inner-right">
            <div className="button">
              <div className="inner-text">Tạo chế độ xem</div>
            </div>
            <div className="button">
              <SlidersHorizontal className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>

        {selectedSearch && (
          <div className="section-4">
            <div className="inner-tag">
              <span className="inner-tag-1">Chiến dịch là</span>
              <span className="inner-tag-2">Đã chọn 3</span>
              <span className="inner-tag-close">
                <i className="fa-solid fa-xmark" />
              </span>
            </div>
            <div className="inner-input">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, ID hoặc số liệu"
              />
            </div>
            <div className="inner-delete">Xóa</div>
          </div>
        )}

        {/* Section 5: Tab hiển thị */}
        <div className="section-5 mb-4">
          <div
            className="
      inner-left
      flex flex-col
      gap-2
      sm:flex-row sm:flex-wrap
      xl:flex-nowrap
    "
          >
            {/* Chiến dịch */}
            <div
              className="
        inner-button active
        flex items-center gap-2
        w-full
        sm:w-[48%]
        xl:w-[307px]
      "
            >
              <FolderUp />
              <div className="inner-text">Chiến dịch</div>
            </div>

            {/* Nhóm quảng cáo */}
            <div
              className="
        inner-button
        flex items-center gap-2
        w-full
        sm:w-[48%]
        xl:w-[307px]
      "
            >
              <LayoutDashboard />
              <div className="inner-text">Nhóm quảng cáo</div>
            </div>

            {/* Quảng cáo */}
            <div
              className="
        inner-button
        flex items-center gap-2
        w-full
        sm:w-[48%]
        xl:w-[307px]
      "
            >
              <PanelTop />
              <div className="inner-text">Quảng cáo</div>
            </div>
          </div>
          {/* <div className="inner-right">
            <div className="button">
              <div className="inner-icon">
                <i className="fa-regular fa-calendar-days" />
              </div>
              <span className="inner-text">
                Tháng này: 1 Tháng 7, 2025 – 31 Tháng 7, 2025
              </span>
              <div className="inner-icon-down">
                <i className="fa-solid fa-caret-down" />
              </div>
            </div>
          </div> */}
        </div>

        {/* Section 6: Hành động & báo cáo */}
        <div className="section-6 flex flex-row overflow-x-auto whitespace-nowrap gap-2 p-2">
          <div className="inner-left">
            <div className="button button-green">
              <Plus className="w-5 h-5 cursor-pointer" />
              <div className="inner-text">Tạo</div>
            </div>

            {/* Sao chép */}
            <div className="button-group">
              <div className="button">
                <div className="inner-icon">
                  <i className="fa-regular fa-copy" />
                </div>
                <div className="inner-text">Sao chép</div>
              </div>
              <div className="button">
                <div className="inner-icon">
                  <i className="fa-solid fa-caret-down" />
                </div>
              </div>
            </div>

            {/* Chỉnh sửa */}
            <div className="button-group">
              <div className="button">
                <div className="inner-icon">
                  <i className="fa-solid fa-pen" />
                </div>
                <div className="inner-text">Chỉnh sửa</div>
              </div>
              <div className="button">
                <div className="inner-icon">
                  <i className="fa-solid fa-caret-down" />
                </div>
              </div>
            </div>

            {/* Xóa & thử nghiệm */}
            <div className="button">
              <div className="inner-icon">
                <i className="fa-solid fa-trash-can" />
              </div>
            </div>
            <div className="inner-line" />
            <div className="button">
              <div className="inner-icon">
                <i className="fa-solid fa-flask" />
              </div>
              <div className="inner-text">Thử nghiệm A/B</div>
            </div>
            <div className="button">
              <div className="inner-icon">
                <i className="fa-solid fa-tag" />
              </div>
            </div>
            <div className="button button-none">
              <div className="inner-text">Xem thêm</div>
              <div className="inner-icon-down">
                <i className="fa-solid fa-caret-down" />
              </div>
            </div>
          </div>

          <div className="inner-right">
            <div className="button">
              <div className="inner-icon">
                <i className="fa-solid fa-table-columns" />
              </div>
              <span className="inner-text">Cột: M</span>
              <div className="inner-icon-down">
                <i className="fa-solid fa-caret-down" />
              </div>
            </div>
            <div className="button">
              <div className="inner-icon">
                <i className="fa-solid fa-chart-simple" />
              </div>
              <span className="inner-text">Số liệu chia nhỏ</span>
              <div className="inner-icon-down">
                <i className="fa-solid fa-caret-down" />
              </div>
            </div>
            <div className="button">
              <div className="inner-icon">
                <i className="fa-solid fa-file-lines" />
              </div>
              <span className="inner-text">Báo cáo</span>
              <div className="inner-icon-down">
                <i className="fa-solid fa-caret-down" />
              </div>
            </div>
            <div className="button-group">
              <div className="button">
                <div className="inner-icon">
                  <i className="fa-solid fa-arrow-up-right-from-square" />
                </div>
                <div className="inner-text">Xuất</div>
              </div>
              <div className="button">
                <div className="inner-icon">
                  <i className="fa-solid fa-caret-down" />
                </div>
              </div>
            </div>
            <div className="button">
              <div className="inner-icon">
                <i className="fa-solid fa-chart-line" />
              </div>
              <span className="inner-text">Biểu đồ</span>
            </div>
          </div>
        </div>

        {/* Section 7: Bảng dữ liệu */}
        <div className="section-7 flex flex-rơ overflow-x-auto whitespace-nowrap gap-2 p-2">
          <table>
            <thead>
              <tr>
                <th>Tắt/Bật</th>
                <th>Tên chiến dịch</th>
                <th>Trạng thái</th>
                <th>Ngân sách mỗi ngày</th>
                <th>Ngân sách trọn đời</th>
                <th>Ngân sách còn lại</th>
                <th>Mục tiêu chiến dịch</th>
                <th>Chiến lược đặt giá thầu</th>
                <th>Danh mục quảng cáo đặc biệt</th>
                <th>Trạng thái thực tế Facebook đang chạy</th>
                <th>Cách mua quảng cáo</th>
                <th>Thời điểm bắt đầu chạy</th>
                <th>Kết thúc</th>
                <th></th>
              </tr>
            </thead>
            {/* ========================phần map dữ liệu ========================== */}
            <tbody>
              {/* Dữ liệu ví dụ, có thể tạo thêm component map */}
              {dataCampaign.length > 0 &&
                dataCampaign.map((item: any) => (
                  <tr key={item.id}>
                    <td>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          className="sr-only peer"
                          type="checkbox"
                          checked={item?.status === 'ACTIVE'}
                          onChange={() => handleToggleCampaign(item)}
                        />
                        <div
                          className="
                            w-14 h-8 
                            bg-gray-300 
                            rounded-full 
                            peer peer-checked:bg-green-500
                            transition-colors
                          "
                        />
                        <div
                          className="
                          absolute left-1 top-1 
                          w-6 h-6 
                          bg-white 
                          rounded-full 
                          shadow-md
                          transition-transform
                          peer-checked:translate-x-6
                        "
                        />
                      </label>
                    </td>

                    <td>{item?.name}</td>
                    <td>
                      <span
                        className={`
                                px-3 py-1
                                text-xs font-semibold
                                rounded-full
                                ${
                                  item?.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-200 text-gray-600'
                                }
                              `}
                      >
                        {item?.status === 'ACTIVE'
                          ? 'Đang hoạt động'
                          : 'Không hoạt động'}
                      </span>
                    </td>
                    <td>{formatVNDV2(item?.daily_budget)}</td>
                    <td>{formatVNDV2(item?.lifetime_budget)}</td>
                    <td>{formatVNDV2(item?.budget_remaining)}</td>
                    <td>{item?.objective}</td>
                    <td>{item?.bid_strategy}</td>
                    <td>{item?.special_ad_categories?.join(',')}</td>
                    <td>{item?.effective_status}</td>
                    <td>{item?.buying_type}</td>
                    <td>{formatDateTime(item?.start_time)}</td>
                    <td>{formatDateTime(item?.stop_time)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!dataCampaign.length && <EmptyState />}
      </div>
    </div>
  );
};

export default Advertisement;
