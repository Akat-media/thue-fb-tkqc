"use client"

import { Fragment, useEffect, useState } from "react"
import { Button, Modal } from "antd"
import { InfoCircleOutlined, ShareAltOutlined, TagOutlined } from "@ant-design/icons"
import BaseHeader, { BaseUrl } from "../../api/BaseHeader"
import { Link, useNavigate } from "react-router-dom"
import { TicketPercent } from "lucide-react"

export interface VoucherData {
  id: string
  user_id: string
  voucher_id: string
  quantity: number
  is_used: boolean
  assigned_at: string
  used_at: string | null
  voucher: {
    id: string
    name: string
    code: string
    description: string
    discount: number
    type: string
    max_usage: number
    expires_at: string
    created_at: string
    updated_at: string
  }
}

const VoucherDetails = ({
  voucher,
  formatDiscount,
  formatDate,
  getBackgroundColor,
  getVoucherIcon,
  handleUseNow,
  isExpired,
}: {
  voucher: VoucherData
  formatDiscount: (discount: number, type: string) => string
  formatDate: (dateString: string) => string
  getBackgroundColor: (type: string) => string
  getVoucherIcon: (type: string) => string
  handleUseNow: () => void
  isExpired: boolean
}) => {
  if (!voucher) return null

  return (
    <div>
      <h2 className="text-gray-800 text-xl font-bold mb-4 font-hubot">Chi tiết Voucher</h2>
      <div className="bg-white rounded-lg relative overflow-hidden shadow-lg">
        {/* Left semi-circle cutout */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full -translate-x-3"
          style={{ backgroundColor: "#E9EFFF" }}
        ></div>

        {/* Right semi-circle cutout */}
        <div
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full translate-x-3"
          style={{ backgroundColor: "#E9EFFF" }}
        ></div>

        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center mb-6 sm:mb-8 text-center sm:text-left">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${getBackgroundColor(
                voucher.voucher.type,
              )} flex items-center justify-center mr-0 sm:mr-6 mb-4 sm:mb-0 flex-shrink-0`}
            >
              <span className="text-white font-bold text-xl sm:text-2xl">{getVoucherIcon(voucher.voucher.type)}</span>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                {formatDiscount(voucher.voucher.discount, voucher.voucher.type)}
              </div>
              <div className="text-lg sm:text-2xl font-semibold text-gray-800">{voucher.voucher.name}</div>
            </div>
          </div>

          {/* Voucher Code */}
          <div className="mb-6">
            <div className="flex items-center bg-gray-100 p-3 sm:p-4 rounded-lg">
              <TagOutlined className="text-gray-600 mr-3" />
              <div>
                <div className="text-xs sm:text-sm text-gray-600">Mã voucher</div>
                <div className="text-base sm:text-lg font-bold text-gray-900">{voucher.voucher.code}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
              {voucher.voucher.description}
            </h3>

            {/* Voucher Info */}
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 text-sm sm:text-base">Số lượng có sẵn: {voucher.quantity}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 text-sm sm:text-base">
                  Loại giảm giá:{" "}
                  {voucher.voucher.type === "percentage"
                    ? "Phần trăm"
                    : voucher.voucher.type === "fixed"
                      ? "Số tiền cố định"
                      : "VNĐ"}
                </span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700 text-sm sm:text-base">
                  Trạng thái: {
                    isExpired 
                      ? "Voucher đã hết hạn" 
                      : voucher.is_used 
                        ? "Đã sử dụng" 
                        : "Chưa sử dụng"
                  }
                </span>
              </li>
            </ul>
          </div>

          {/* Dotted Line */}
          <div className="border-t-2 border-dashed border-gray-300 my-6 sm:my-8"></div>

          {/* Use Now Button Section */}
          <div className="text-center mb-6 sm:mb-8">
            <Button
              type="primary"
              size="large"
              onClick={handleUseNow}
              disabled={voucher.is_used || isExpired}
              className={`${
                voucher.is_used || isExpired ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } border-blue-600 hover:border-blue-700 px-10 py-5 h-auto text-base sm:text-lg font-semibold rounded-lg`}
            >
              {isExpired ? "Voucher đã hết hạn" : voucher.is_used ? "Đã sử dụng" : "Dùng ngay"}
            </Button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Button type="text" icon={<ShareAltOutlined />} className="text-gray-600" size="large" />
            <span className={`text-xs sm:text-base font-medium ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
              Hết hạn: {formatDate(voucher.voucher.expires_at)}
            </span>
            <Button type="text" icon={<InfoCircleOutlined />} className="text-gray-600" size="large" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TicketPage() {
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const navigate = useNavigate();

  const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < breakpoint)
      }
      checkScreenSize()
      window.addEventListener("resize", checkScreenSize)
      return () => window.removeEventListener("resize", checkScreenSize)
    }, [breakpoint])
    return isMobile
  }
  const isMobile = useIsMobile()
  
  // Dữ liệu mẫu từ API
  const [stateData, setStateDate] = useState<VoucherData[]>([])
  
  useEffect(() => {
    const fetchData = async() => {
      const userId = JSON.parse(localStorage.getItem('user') || '').user_id
      try {
        const respone = await BaseHeader({
          method: 'get',
          url: `my-vouchers?user_id=${userId}`,
          baseURL: BaseUrl,
        })
        setStateDate(respone.data.data)
      } catch(error:any) {
        console.log('error',error)
      }
    }
    fetchData()
  },[])

  // Kiểm tra voucher có hết hạn không
  const isVoucherExpired = (expiresAt: string) => {
    const currentTime = new Date()
    const expiryTime = new Date(expiresAt)
    return expiryTime < currentTime
  }

  const handleVoucherClick = (voucher: VoucherData) => {
    setSelectedVoucher(voucher)
    if (isMobile) {
      setIsModalVisible(true)
    }
  }

  const handleUseNow = () => {
    if (selectedVoucher && !isVoucherExpired(selectedVoucher.voucher.expires_at)) {
      navigate('/marketplace')
      if (isMobile) {
        setIsModalVisible(false)
      }
    }
  }

  // Format discount display
  const formatDiscount = (discount: number, type: string) => {
    switch (type.toLowerCase()) {
      case "percentage":
        return `${discount}%`
      case "fixed":
        return `${discount.toLocaleString("vi-VN")}đ`
      case "vnđ":
        return `${discount.toLocaleString("vi-VN")}đ`
      default:
        return `${discount}`
    }
  }

  // Format expiry date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Get background color based on voucher type
  const getBackgroundColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "percentage":
        return "bg-green-500"
      case "fixed":
        return "bg-blue-500"
      case "vnđ":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get voucher icon
  const getVoucherIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "percentage":
        return "%"
      case "fixed":
        return "₫"
      case "vnđ":
        return "₫"
      default:
        return "🎫"
    }
  }
  
  console.log("stateData1111",stateData)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F1F7FF' }}>
      <style>{`
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div className="flex h-screen">
        {stateData.length > 0 ? (
          <Fragment>
            {/* Left Panel - Voucher List */}
            <div className="w-full md:w-1/2 p-4 flex flex-col h-screen">
              <h2 className="text-gray-800 text-xl font-bold mb-4 flex-shrink-0 font-hubot">
                Voucher của tôi (
                {stateData.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {stateData.map((item) => {
                  const isExpired = isVoucherExpired(item.voucher.expires_at);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleVoucherClick(item)}
                      className={`relative cursor-pointer transform transition-all duration-200 hover:scale-101 ${
                        selectedVoucher?.id === item.id
                          ? 'opacity-90'
                          : 'opacity-100'
                      } ${item.is_used || isExpired ? 'opacity-50' : ''}`}
                    >
                      {/* Ticket Shape - Extra Small */}
                      <div className="bg-white rounded-md relative overflow-hidden shadow-sm">
                        {/* Used/Expired overlay */}
                        {(item.is_used || isExpired) && (
                          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
                            <span className="text-white font-bold text-sm">
                              {isExpired ? 'ĐÃ HẾT HẠN' : 'ĐÃ SỬ DỤNG'}
                            </span>
                          </div>
                        )}

                        {/* Left semi-circle cutout - Extra Small */}
                        <div
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full -translate-x-1.5"
                          style={{ backgroundColor: '#E9EFFF' }}
                        ></div>

                        {/* Right semi-circle cutout - Extra Small */}
                        <div
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full translate-x-1.5"
                          style={{ backgroundColor: '#E9EFFF' }}
                        ></div>

                        {/* Content - Extra Compact */}
                        <div className="flex items-center p-3">
                          {/* Logo Section - Extra Small */}
                          <div
                            className={`w-8 h-8 rounded-full ${getBackgroundColor(
                              item.voucher.type
                            )} flex items-center justify-center mr-3`}
                          >
                            <span className="text-white font-bold text-xs">
                              {getVoucherIcon(item.voucher.type)}
                            </span>
                          </div>

                          {/* Divider - Extra Small */}
                          <div className="w-px h-8 bg-gray-200 mr-3"></div>

                          {/* Content Section - Extra Compact */}
                          <div className="flex-1">
                            <div className="text-sm font-bold text-gray-900 mb-0.5">
                              {formatDiscount(
                                item.voucher.discount,
                                item.voucher.type
                              )}
                            </div>
                            <div className="text-xs font-semibold text-gray-700 mb-0.5">
                              {item.voucher.name}
                            </div>
                            <div
                              className={`text-[10px] ${
                                isExpired ? 'text-red-500' : 'text-gray-500'
                              }`}
                            >
                              Hết hạn: {formatDate(item.voucher.expires_at)}
                            </div>
                          </div>

                          {/* Quantity badge */}
                          {item.quantity > 1 && (
                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                              x{item.quantity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel - Voucher Details */}
            <div className="hidden md:block w-1/2 p-4 overflow-y-auto">
              {selectedVoucher ? (
                <VoucherDetails
                  voucher={selectedVoucher}
                  formatDiscount={formatDiscount}
                  formatDate={formatDate}
                  getBackgroundColor={getBackgroundColor}
                  getVoucherIcon={getVoucherIcon}
                  handleUseNow={handleUseNow}
                  isExpired={isVoucherExpired(
                    selectedVoucher.voucher.expires_at
                  )}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center font-hubot">
                    <div className="flex items-center justify-center mb-4">
                      <TicketPercent className="h-16 w-16 text-gray-500" />
                    </div>
                    <h3 className="text-gray-800 text-xl font-semibold mb-2">
                      Chọn một Voucher
                    </h3>
                    <p className="text-gray-600">
                      Click vào voucher bên trái để xem chi tiết
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Fragment>
        ) : (
          <div className="flex items-center justify-center w-full h-3/4">
            <div className="text-center font-hubot">
              <div className="flex items-center justify-center mb-4">
                <TicketPercent className="h-16 w-16 text-gray-500" />
              </div>
              <h3 className="text-gray-800 text-xl font-semibold mb-2">
                Không có voucher nào
              </h3>
              <p className="text-gray-600">
                Hiện tại bạn không có voucher nào trong danh sách.
              </p>
            </div>
          </div>
        )}
      </div>
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnHidden
        style={{ top: 20, padding: 0 }}
        styles={{
          body: {
            padding: 0,
            backgroundColor: '#E9EFFF',
            borderRadius: '8px',
          },
        }}
        width="95vw"
      >
        <div className="p-4 max-h-[90vh] overflow-y-auto scrollbar-thin">
          {selectedVoucher && (
            <VoucherDetails
              voucher={selectedVoucher}
              formatDiscount={formatDiscount}
              formatDate={formatDate}
              getBackgroundColor={getBackgroundColor}
              getVoucherIcon={getVoucherIcon}
              handleUseNow={handleUseNow}
              isExpired={isVoucherExpired(selectedVoucher.voucher.expires_at)}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}