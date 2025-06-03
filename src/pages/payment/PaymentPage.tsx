import React, { useState, useEffect } from "react";
import { CreditCard, Copy, Landmark, Check, X } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { Transaction } from "../../types";
import BaseHeader from "../../api/BaseHeader";
import socket from "../../socket/index.ts";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "1",
    amount: 1000000,
    type: "deposit",
    status: "completed",
    description: "Nạp tiền qua Web2m - Chuyển khoản ngân hàng",
    transactionCode: "DEPOSIT-123456",
    createdAt: new Date(2023, 5, 15, 10, 30),
  },
  {
    id: "2",
    userId: "1",
    amount: 500000,
    type: "payment",
    status: "completed",
    description: "Thanh toán thuê BM Agency - Visa",
    createdAt: new Date(2023, 5, 16, 14, 45),
  },
  {
    id: "3",
    userId: "1",
    amount: 200000,
    type: "deposit",
    status: "completed",
    description: "Nạp tiền qua Web2m - Ví điện tử",
    createdAt: new Date(2023, 5, 18, 9, 15),
  },
  {
    id: "4",
    userId: "1",
    amount: 300000,
    type: "payment",
    status: "completed",
    description: "Thanh toán gói dịch vụ AI - 1 tháng",
    createdAt: new Date(2023, 5, 20, 16, 30),
  },
  {
    id: "5",
    userId: "1",
    amount: 100000,
    type: "payment",
    status: "completed",
    description: "Thanh toán thuê Tài Khoản Quảng Cáo - Limit thấp",
    createdAt: new Date(2023, 5, 16, 14, 45),
  },
];

const PaymentPage: React.FC = () => {
  const objetUser = localStorage.getItem("user");
  const userParse = JSON.parse(objetUser || "{}");
  const [activeTab, setActiveTab] = useState("deposit");
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedAmount, setSelectedAmount] = useState(1000000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [showQRCode, setShowQRCode] = useState(false);
  const [isShowingQR, setIsShowingQR] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "failed" | null
  >(null);

  const hanleCalTransaction = async (number: any) => {
    try {
      const res = await BaseHeader({
        url: "transaction",
        method: "post",
        data: {
          amountVND: number,
          user_id: userParse.user_id || "",
        },
      });
      return res.data.data.short_code;
    } catch (error) {
      console.log(error);
    }
  };
  const storedUserData = localStorage.getItem("user");
  const shortCode = storedUserData
    ? JSON.parse(storedUserData)?.user?.short_code || "NAP0000"
    : "NAP0000";

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification(
      "Đã sao chép",
      "Thông tin đã được sao chép vào clipboard",
      "success"
    );
  };

  const handleDeposit = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    if (isNaN(amount) || amount <= 0) {
      addNotification("Lỗi", "Vui lòng nhập số tiền hợp lệ", "error");
      return;
    }
    const shortCode = await hanleCalTransaction(amount);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addNotification(
        "Tạo lệnh nạp tiền thành công",
        "Vui lòng chuyển khoản theo thông tin đã cung cấp",
        "success"
      );
      setIsShowingQR(true);
      const qrUrl = `https://apiqr.web2m.com/api/generate/ACB/20478471/duy%20nam?amount=${amount}&memo=${shortCode}&is_mask=1&bg=1`;
      setQrImageUrl(qrUrl);
      setTimeout(() => {
        setShowQRCode(true);
        setIsShowingQR(false);
        setCountdown(120);
      }, 1200);
      if (qrUrl) {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Deposit error:", error);
      addNotification(
        "Có lỗi xảy ra",
        "Không thể tạo lệnh nạp tiền. Vui lòng thử lại sau",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmTransfer = () => {
    setPaymentStatus("loading");
    setTimeout(() => {
      setPaymentStatus("success");
      setTimeout(() => {
        setPaymentStatus(null);
        setShowQRCode(false);
        setCustomAmount("");
      }, 2000);
    }, 3000);
  };

  const formatTransactionDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    if (!showQRCode) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setPaymentStatus("failed");
          setTimeout(() => {
            setPaymentStatus(null);
            setShowQRCode(false);
            setCustomAmount("");
          }, 3000);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showQRCode]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("joinRoom");
    });
    socket.on("payment_success", (data) => {
      console.log("Payment success event received:", data);
      setPaymentStatus("success");
      setTimeout(() => {
        setPaymentStatus(null);
        setShowQRCode(false);
        setCustomAmount("");
      }, 5000);
    });

    return () => {
      socket.off("payment_success");
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold	 leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Cổng Thanh Toán
            </h2>
            {user && (
              <p className="mt-1 text-sm text-gray-500">
                Số dư hiện tại:{" "}
                <span className="font-medium text-green-600">
                  {user && typeof user.balance === "number"
                    ? user.balance.toLocaleString("vi-VN") + " VNĐ"
                    : "Không có thông tin số dư"}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="deposit">Nạp tiền</option>
              {/* <option value="history">Lịch sử nạp</option>
              <option value="platform">Thanh toán nền tảng</option> */}
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  className={`${
                    activeTab === "deposit"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("deposit")}
                >
                  <CreditCard className="h-5 w-5 mr-2 inline-block" />
                  Nạp tiền
                </button>
                {/* <button
                  className={`${
                    activeTab === "history"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("history")}
                >
                  <FileText className="h-5 w-5 mr-2 inline-block" />
                  Lịch sử nạp
                </button>
                <button
                  className={`${
                    activeTab === "platform"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("platform")}
                >
                  Thanh toán nền tảng
                </button> */}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === "deposit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-semibold">
                    Nạp tiền vào hệ thống
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="col-span-2 sm:col-span-3">
                      <label className="block text-xl font-medium text-gray-700">
                        Nhập số tiền bạn muốn nạp 👇
                      </label>
                      <div className="mt-2">
                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            className={`shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full h-12 px-4 pr-16 sm:text-sm rounded-md ${
                              customAmount &&
                              (parseInt(customAmount) <= 1000 ||
                                parseInt(customAmount) % 1000 !== 0)
                                ? "border-red-500"
                                : "border border-gray-300"
                            }`}
                            placeholder="Nhập số tiền"
                            value={
                              customAmount
                                ? parseInt(customAmount).toLocaleString("vi-VN")
                                : ""
                            }
                            onChange={(e) => {
                              const raw = e.target.value.replace(/[^0-9]/g, "");
                              setCustomAmount(raw);
                              setShowQRCode(false);
                            }}
                            // min="50000"
                            min="1000"
                            step="1000"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                            VNĐ
                          </span>
                        </div>

                        {customAmount &&
                          (parseInt(customAmount) <= 1000 ||
                            parseInt(customAmount) % 1000 !== 0) && (
                            <p className="text-red-500 text-xs mt-1">
                              Vui lòng nhập số tiền từ 1.000 VNĐ trở lên và là
                              số tiền chẵn hàng nghìn (vd: 50.000 VNĐ, 68.000
                              VNĐ, 100.000 VNĐ).
                            </p>
                          )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xl font-medium text-gray-700">
                        Vui lòng chọn mệnh giá
                      </label>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          500000, 1000000, 2000000, 3000000, 5000000, 10000000,
                        ].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            className={`${
                              selectedAmount === amount && !customAmount
                                ? "bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-700"
                            } border rounded-md py-2 px-3 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount(String(amount));
                              setShowQRCode(false);
                            }}
                          >
                            {amount.toLocaleString("vi-VN")}đ
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Landmark
                            className="h-5 w-5 text-blue-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-3 w-full">
                          <h3 className="text-sm font-medium text-blue-800 mb-2">
                            Thông tin chuyển khoản
                          </h3>
                          <div className="text-sm text-blue-700 space-y-2 grid grid-cols-2 gap-x-4">
                            <span className="self-center">Ngân hàng:</span>
                            <div className="flex justify-end items-center">
                              <span className="font-medium">ACB Bank</span>
                              <button
                                onClick={() => handleCopyClick("ACB Bank")}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Số tài khoản:</span>
                            <div className="flex justify-end items-center">
                              <span className="font-medium">20478471</span>
                              <button
                                onClick={() => handleCopyClick("20478471")}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Chủ tài khoản:</span>
                            <div className="flex justify-end items-center">
                              <span className="font-medium">
                                CÔNG TY TNHH AKADS
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyClick("CÔNG TY TNHH AKADS")
                                }
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Nội dung CK:</span>
                            <div className="flex justify-end items-center">
                              <span className="font-medium">{shortCode}</span>
                              <button
                                onClick={() => handleCopyClick(shortCode)}
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>

                            <span className="self-center">Số tiền:</span>
                            <div className="flex justify-end items-center">
                              <span className="font-medium">
                                {(customAmount
                                  ? parseInt(customAmount)
                                  : selectedAmount
                                ).toLocaleString("vi-VN")}{" "}
                                VNĐ
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyClick(
                                    `${
                                      customAmount
                                        ? parseInt(customAmount)
                                        : selectedAmount
                                    }`
                                  )
                                }
                                className="ml-2 text-blue-500 hover:text-blue-700"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        fullWidth
                        onClick={handleDeposit}
                        isLoading={isLoading}
                        disabled={isLoading}
                      >
                        Tạo lệnh nạp tiền
                      </Button>
                      <p className="mt-2 text-xs text-gray-500 text-center">
                        Sau khi chuyển khoản, hệ thống sẽ tự động cộng tiền vào
                        tài khoản của bạn trong vòng 5 phút.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>
                    {showQRCode ? "Mã QR" : "Hướng dẫn nạp tiền"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isShowingQR ? (
                    <div className="flex justify-center items-center w-full h-full min-h-[400px]">
                      <div className="flex flex-col items-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-transparent mb-3"></div>
                        <p>Đang tạo mã QR, vui lòng chờ...</p>
                      </div>
                    </div>
                  ) : showQRCode ? (
                    <div className="flex items-center justify-center min-h-[500px]">
                      <div className="flex flex-col items-center text-sm text-gray-700 space-y-6 text-center">
                        {qrImageUrl && (
                          <img
                            src={qrImageUrl}
                            alt="Mã QR chuyển khoản"
                            className="w-[400px] h-[500px] rounded shadow"
                          />
                        )}
                        {/* <Button
                          onClick={handleConfirmTransfer}
                          className="mt-4"
                        >
                          Đã thanh toán
                        </Button> */}
                        <div className="space-y-1">
                          <p className="text-sm text-red-500 font-semibold">
                            Mã QR sẽ hết hạn sau: {Math.floor(countdown / 60)}:
                            {(countdown % 60).toString().padStart(2, "0")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            1
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Chọn số tiền cần nạp
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Chọn một trong các mệnh giá có sẵn hoặc nhập số tiền
                            tùy chọn (tối thiểu 100.000đ).
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            2
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Tạo lệnh nạp tiền
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Nhấn nút "Tạo lệnh nạp tiền" để hệ thống tạo một mã
                            giao dịch duy nhất.
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            3
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Chuyển khoản ngân hàng
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Thực hiện chuyển khoản theo thông tin được cung cấp.
                            Lưu ý nhập đúng nội dung chuyển khoản.
                          </p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                            4
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            Nhận tiền tự động
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Hệ thống sẽ tự động cộng tiền vào tài khoản của bạn
                            sau khi nhận được thanh toán (thường trong vòng 5
                            phút).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "history" && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử nạp</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại giao dịch
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mô tả
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số tiền
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions
                          .filter((t) => t.type === "deposit")
                          .map((transaction) => (
                            <tr
                              key={transaction.id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {formatTransactionDate(transaction.createdAt)}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                  Nạp tiền
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="text-green-600 font-medium">
                                  +{transaction.amount.toLocaleString("vi-VN")}{" "}
                                  VNĐ
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    transaction.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : transaction.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {transaction.status === "completed"
                                    ? "Hoàn thành"
                                    : transaction.status === "pending"
                                    ? "Đang xử lý"
                                    : "Thất bại"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        {transactions.filter((t) => t.type === "deposit")
                          .length === 0 && (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-6 text-gray-500"
                            >
                              Chưa có giao dịch nạp tiền nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "platform" && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử giao dịch nền tảng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mô tả
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số tiền
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions
                          .filter((t) => t.type === "payment")
                          .map((t) => (
                            <tr key={t.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {formatTransactionDate(t.createdAt)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {t.description}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span className="text-red-600 font-medium">
                                  -{t.amount.toLocaleString("vi-VN")} VNĐ
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    t.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : t.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {t.status === "completed"
                                    ? "Hoàn thành"
                                    : t.status === "pending"
                                    ? "Đang xử lý"
                                    : "Thất bại"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        {transactions.filter((t) =>
                          t.description.toLowerCase().includes("dịch vụ ai")
                        ).length === 0 && (
                          <tr>
                            <td
                              colSpan={4}
                              className="text-center py-6 text-gray-500"
                            >
                              Tài khoản chưa có giao dịch nền tảng nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      {paymentStatus && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
            {paymentStatus === "loading" ? (
              <>
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-700 text-sm">
                  Vui lòng chờ một chút để hệ thống xác nhận thanh toán...
                </p>
              </>
            ) : paymentStatus === "success" ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Thanh toán thành công!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Vui lòng chờ trong giây lát để cộng điểm!!
                </p>
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đóng
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Thanh toán thất bại!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Không nhận được xác nhận thanh toán. Vui lòng thử lại sau.
                </p>
                <button
                  onClick={() => {
                    setPaymentStatus(null);
                    setShowQRCode(false);
                  }}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Đóng
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PaymentPage;
