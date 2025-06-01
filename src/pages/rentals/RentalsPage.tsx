import React, { useState, useEffect } from "react";
import {
  Clock,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Lightbulb,
  Calendar,
  DollarSign,
  Wallet,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Rental } from "../../types";
import url from "../../assets/bg.svg";

const mockRentals: (Rental & { adAccount: any })[] = [
  {
    id: "1",
    userId: "1",
    adAccountId: "1",
    userBmId: "123456789",
    startDate: new Date(2023, 5, 15),
    endDate: new Date(2023, 5, 22),
    requestedLimit: 5000000,
    totalPrice: 1500000,
    spentBudget: 2500000,
    status: "available",
    createdAt: new Date(2023, 5, 15),
    adAccount: {
      id: "1",
      name: "BM Cá nhân",
      bmId: "bm_123456",
      bmName: "Business Manager Cá nhân",
      bmType: "personal",
      accountType: "visa",
      defaultLimit: 5000000,
      pricePerDay: 200000,
      remainingBudget: 2500000,
      includesAdAccount: true,
      status: "active",
    },
  },
  {
    id: "2",
    userId: "1",
    adAccountId: "2",
    userBmId: "123456789",
    startDate: new Date(2023, 5, 10),
    endDate: new Date(2023, 5, 17),
    requestedLimit: 10000000,
    totalPrice: 2450000,
    spentBudget: 10000000,
    status: "active",
    createdAt: new Date(2023, 5, 10),
    adAccount: {
      id: "2",
      name: "BM Agency - Visa",
      bmId: "bm_789012",
      bmName: "Business Manager Agency",
      bmType: "agency",
      accountType: "visa",
      defaultLimit: 10000000,
      pricePerDay: 350000,
      remainingBudget: 0,
      includesAdAccount: true,
      status: "available",
    },
  },
  {
    id: "3",
    userId: "1",
    adAccountId: "3",
    userBmId: "123456789",
    startDate: new Date(2023, 5, 18),
    endDate: new Date(2023, 5, 19),
    requestedLimit: 2000000,
    totalPrice: 110000,
    spentBudget: 0,
    status: "unavailable",
    createdAt: new Date(2023, 5, 18),
    adAccount: {
      id: "3",
      name: "BM Cá nhân - Limit thấp",
      bmId: "bm_345678",
      bmName: "Business Manager Cá nhân",
      bmType: "personal",
      accountType: "low_limit",
      defaultLimit: 2000000,
      pricePerDay: 100000,
      remainingBudget: 2000000,
      includesAdAccount: true,
      status: "active",
    },
  },
];

const RentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<(Rental & { adAccount: any })[]>([]);
  const [activeTab, setActiveTab] = useState<"available" | "active" | "all">(
    "available"
  );

  useEffect(() => {
    // This would be an API call in a real application
    setRentals(mockRentals);
  }, []);

  const filteredRentals = rentals.filter((rental) => {
    if (activeTab === "all") return true;
    return rental.status === activeTab;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <span
            className="
            min-w-[140px] justify-center
            inline-flex items-center px-3 py-[6px] rounded-full text-xs font-medium gap-1 cursor-pointer
          bg-green-100 text-green-700 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Đang thuê
          </span>
        );
      // case "expired":
      //   return (
      //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      //       <Clock className="h-3 w-3 mr-1" />
      //       Đang thuê
      //     </span>
      //   );
      case "unavailable":
        return (
          <span
            className=" min-w-[110px] justify-center
            inline-flex items-center px-3 py-[6px] rounded-full text-xs font-medium gap-1 cursor-pointer
          border border-red-200 shadow-sm hover:shadow-md transition-all duration-200 bg-red-100 text-red-800"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Đang xử lý
          </span>
        );
      default:
        return (
          <span
            className="min-w-[80px]
            inline-flex items-center justify-center px-3 py-[6px] rounded-full text-xs font-medium gap-1 cursor-pointer
           border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-gray-100 text-gray-800"
          >
            {status}
          </span>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold	 leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Tài khoản đang thuê
            </h2>
          </div>
        </div>

        <div className="mt-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) =>
                setActiveTab(e.target.value as "available" | "active" | "all")
              }
            >
              <option value="active">Đang thuê</option>
              <option value="active">Đang hoạt động</option>
              <option value="all">Tất cả</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  className={`${
                    activeTab === "available"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("available")}
                >
                  Đang thuê
                </button>
                <button
                  className={`${
                    activeTab === "active"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("active")}
                >
                  Đang hoạt động
                </button>
                <button
                  className={`${
                    activeTab === "all"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab("all")}
                >
                  Tất cả
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {filteredRentals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRentals.map((rental) => (
                <Card key={rental.id} className="h-full flex flex-col relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-[22px]">
                        {rental.adAccount.name}
                      </CardTitle>
                      {getStatusBadge(rental.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow relative z-10">
                    <div className="space-y-4">
                      <div className="font-sans text-gray-700 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            BM ID:
                          </span>
                          <span className="font-semibold">
                            {rental.adAccount?.bmId}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            Thời gian thuê:
                          </span>
                          <span className="font-semibold">
                            {formatDate(rental.startDate)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            Limit yêu cầu:
                          </span>
                          <span className="font-semibold">
                            {rental.requestedLimit.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Wallet className="w-4 h-4 text-purple-400" />
                            Đã chi tiêu:
                          </span>
                          <span className="font-semibold">
                            {rental.spentBudget.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4 text-pink-400" />
                            Còn lại:
                          </span>
                          <span className="font-semibold">
                            {(
                              rental.requestedLimit - rental.spentBudget
                            ).toLocaleString("vi-VN")}{" "}
                            VNĐ
                          </span>
                        </div>
                      </div>

                      {rental.status === "available" && (
                        <div className="pt-2">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className=" h-4 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (rental.spentBudget / rental.requestedLimit) *
                                    100
                                )}%`,
                                background:
                                  "linear-gradient(90deg, #4ade80, #22d3ee)",
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0%</span>
                            <span>
                              {Math.round(
                                (rental.spentBudget / rental.requestedLimit) *
                                  100
                              )}
                              %
                            </span>
                            <span>100%</span>
                          </div>
                        </div>
                      )}
                      {rental.status === "expired" &&
                        rental.spentBudget < rental.requestedLimit && (
                          <div className="bg-green-50 p-3 rounded-md flex items-start">
                            <AlertTriangle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-green-800">
                                Hoàn tiền khả dụng
                              </h3>
                              <p className="text-sm text-green-700 mt-1">
                                Bạn có thể yêu cầu hoàn{" "}
                                {(
                                  rental.requestedLimit - rental.spentBudget
                                ).toLocaleString("vi-VN")}{" "}
                                VNĐ chưa sử dụng
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                  <div className="px-6 py-4 relative z-10">
                    <div className="flex space-x-3">
                      {rental.status === "available" && (
                        <>
                          <Button
                            className="bg-yellow-500 hover:bg-yellow-400 py-2"
                            size="sm"
                            icon={<BarChart3 className="h-4 w-4" />}
                            fullWidth
                          >
                            Xem báo cáo
                          </Button>
                          <Button className="py-2" size="sm" fullWidth>
                            Nâng cấp
                          </Button>
                        </>
                      )}
                      {rental.status === "active" &&
                        rental.spentBudget < rental.requestedLimit && (
                          <Button size="sm" fullWidth>
                            Yêu cầu hoàn tiền
                          </Button>
                        )}
                      {rental.status === "active" &&
                        rental.spentBudget >= rental.requestedLimit && (
                          <>
                            <Button
                              className="bg-yellow-500 hover:bg-yellow-400 py-2"
                              size="sm"
                              icon={<BarChart3 className="h-4 w-4" />}
                              fullWidth
                            >
                              Xem báo cáo
                            </Button>
                            <Button
                              className="py-2 bg-fuchsia-700 hover:bg-fuchsia-600"
                              size="sm"
                              fullWidth
                            >
                              Thuê gói
                            </Button>
                          </>
                        )}
                      {rental.status === "unavailable" && (
                        <Button
                          className="bg-red-500 hover:bg-red-400 py-2"
                          size="sm"
                          icon={<RefreshCw className="h-4 w-4" />}
                          fullWidth
                          disabled
                        >
                          Đang xử lý
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full">
                    <img className="w-full" src={url} alt="img" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {activeTab === "available"
                  ? "Bạn không có tài khoản nào đang thuê."
                  : activeTab === "active"
                  ? "Bạn không có tài khoản nào đang hoạt động. "
                  : "Bạn chưa thuê tài khoản nào."}
              </p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = "/marketplace")}
              >
                Thuê tài khoản ngay
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default RentalsPage;
