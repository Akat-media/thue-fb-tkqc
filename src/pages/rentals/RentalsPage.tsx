import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, BarChart3, RefreshCw } from "lucide-react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Rental, AdAccount } from "../../types";
import {AdAccountProvider} from "../marketplace/AdAccountContext.tsx";

// Mock data for demonstration
const mockRentals: (Rental & { adAccount: AdAccount })[] = [
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
    status: "active",
    createdAt: new Date(2023, 5, 15),
    adAccount: {
      id: "1",
      name: "BM Cá nhân - Visa",
      bmId: "bm_123456",
      bmName: "Business Manager Cá nhân",
      bmType: "personal",
      accountType: "visa",
      defaultLimit: 5000000,
      pricePerDay: 200000,
      remainingBudget: 2500000,
      includesAdAccount: true,
      status: "rented",
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
    status: "expired",
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
    status: "pending",
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
      status: "rented",
    },
  },
];

const RentalsPage: React.FC = () => {
  const [rentals, setRentals] = useState<(Rental & { adAccount: AdAccount })[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<"active" | "expired" | "all">(
    "active"
  );

  useEffect(() => {
    // This would be an API call in a real application
    setRentals(mockRentals);
  }, []);

  const filteredRentals = rentals.filter((rental) => {
    if (activeTab === "all") return true;
    return rental.status === activeTab;
  });

  const calculateDaysLeft = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Clock className="h-3 w-3 mr-1" />
            Đang hoạt động
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3 mr-1" />
            Đã hết hạn
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <RefreshCw className="h-3 w-3 mr-1" />
            Đang xử lý
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
      <AdAccountProvider>
        <Layout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
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
                    setActiveTab(e.target.value as "active" | "expired" | "all")
                  }
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="expired">Đã hết hạn</option>
                  <option value="all">Tất cả</option>
                </select>
              </div>
              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8" aria-label="Tabs">
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
                        activeTab === "expired"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                      onClick={() => setActiveTab("expired")}
                    >
                      Đã hết hạn
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
                    <Card key={rental.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">
                            {rental.adAccount.name}
                          </CardTitle>
                          {getStatusBadge(rental.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">BM ID:</span>
                              <span className="font-medium">
                                {rental.adAccount.bmId}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Thời gian thuê:</span>
                              <span className="font-medium">
                                {formatDate(rental.startDate)} -{" "}
                                {formatDate(rental.endDate)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Limit yêu cầu:</span>
                              <span className="font-medium">
                                {rental.requestedLimit.toLocaleString("vi-VN")} VNĐ
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Đã chi tiêu:</span>
                              <span className="font-medium">
                                {rental.spentBudget.toLocaleString("vi-VN")} VNĐ
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Còn lại:</span>
                              <span className="font-medium">
                                {(
                                  rental.requestedLimit - rental.spentBudget
                                ).toLocaleString("vi-VN")}{" "}
                                VNĐ
                              </span>
                            </div>
                          </div>

                          {rental.status === "active" && (
                            <div className="pt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (rental.spentBudget / rental.requestedLimit) *
                                        100
                                    )}%`,
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

                          {rental.status === "active" && (
                            <div className="bg-blue-50 p-3 rounded-md flex items-start">
                              <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                  Thời gian còn lại
                                </h3>
                                <p className="text-sm text-blue-700 mt-1">
                                  {calculateDaysLeft(rental.endDate)} ngày
                                </p>
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
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex space-x-3">
                          {rental.status === "active" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<BarChart3 className="h-4 w-4" />}
                                fullWidth
                              >
                                Xem báo cáo
                              </Button>
                              <Button size="sm" fullWidth>
                                Gia hạn
                              </Button>
                            </>
                          )}
                          {rental.status === "expired" &&
                            rental.spentBudget < rental.requestedLimit && (
                              <Button size="sm" fullWidth>
                                Yêu cầu hoàn tiền
                              </Button>
                            )}
                          {rental.status === "expired" &&
                            rental.spentBudget >= rental.requestedLimit && (
                              <Button
                                variant="outline"
                                size="sm"
                                icon={<BarChart3 className="h-4 w-4" />}
                                fullWidth
                              >
                                Xem báo cáo
                              </Button>
                            )}
                          {rental.status === "pending" && (
                            <Button
                              variant="outline"
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
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {activeTab === "active"
                      ? "Bạn không có tài khoản nào đang hoạt động."
                      : activeTab === "expired"
                      ? "Bạn không có tài khoản nào đã hết hạn."
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
      </AdAccountProvider>
  );
};

export default RentalsPage;
