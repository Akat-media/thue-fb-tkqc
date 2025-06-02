import React, { useEffect, useState } from "react";
import { Search, Filter, ChevronDown, Check, Briefcase } from "lucide-react";
import Layout from "../../components/layout/Layout";
import { Card, CardContent } from "../../components/ui/Card";
import AdAccountCard from "./AdAccountCard";
import RentModal from "./RentModal";
import CreateBMModal from "./CreateBMModal";
import { AdAccount } from "../../types";
import { useAdAccountStore } from "./adAccountStore";
import BaseHeader from "../../api/BaseHeader";
import url from "../../assets/bg.svg";
import { useOnOutsideClick } from "../../hook/useOutside";

const MarketplacePage: React.FC = () => {
  const {
    searchTerm,
    selectedType,
    selectedAccountType,
    setSearchTerm,
    setSelectedType,
    setSelectedAccountType,
  } = useAdAccountStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(
    null
  );
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [filteredAccounts, setFilteredAccounts] = useState<any>([]);
  const [bmList, setBmList] = useState<any>([]);

  // New state for CreateBM modal
  const [isCreateBMModalOpen, setIsCreateBMModalOpen] = useState(false);

  const [selectedBM, setSelectedBM] = useState<any>(null);
  const [isBMDetailModalOpen, setIsBMDetailModalOpen] = useState(false);

  const handleCallAPi = async () => {
    try {
      const response = await BaseHeader({
        method: "get",
        url: "ad-accounts",
        params: {},
      });
      console.log(response.data.data);
      setFilteredAccounts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBMList = async () => {
    try {
      const response = await BaseHeader({
        method: "get",
        url: "facebook-bm",
        params: {},
      });
      console.log("BM List:", response.data.data);
      setBmList(response.data.data);
    } catch (error) {
      console.log("Error fetching BM list:", error);
    }
  };

  useEffect(() => {
    handleCallAPi();
    fetchBMList();
  }, []);

  const handleRentClick = (account: any) => {
    console.log("account", account);
    setSelectedAccount(account);
    setIsRentModalOpen(true);
  };

  const handleBMClick = (bm: any) => {
    console.log("BM clicked:", bm);
    setSelectedBM(bm);
    setIsBMDetailModalOpen(true);
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const { innerBorderRef } = useOnOutsideClick(() => {
    setIsBMDetailModalOpen(false);
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold	 leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Danh sách BM / Tài khoản quảng cáo
            </h2>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm BM, tài khoản..."
                className="min-w-[380px] block pl-10 pr-3 py-[10px] rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="inline-flex items-center px-4 py-[10px] border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={toggleFilters}
            >
              <Filter className="h-5 w-5 mr-2 text-gray-400" />
              Bộ lọc
              <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${
                  isFiltersOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="mt-3 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-[10px] border border-blue-600 rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setIsCreateBMModalOpen(true)}
            >
              Tạo tài khoản BM
            </button>
          </div>
        </div>

        {isFiltersOpen && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="bmType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Loại BM
                  </label>
                  <select
                    id="bmType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="personal">Cá nhân</option>
                    <option value="agency">Agency</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="accountType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Loại tài khoản
                  </label>
                  <select
                    id="accountType"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedAccountType}
                    onChange={(e) => setSelectedAccountType(e.target.value)}
                  >
                    <option value="all">Tất cả</option>
                    <option value="visa">Visa</option>
                    <option value="high_limit">Limit cao</option>
                    <option value="low_limit">Limit thấp</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Danh Sách Tài Khoản BM ({bmList.length})
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bmList.map((bm: any) => (
              <Card
                key={bm.id}
                className="h-full flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleBMClick(bm)}
              >
                <CardContent className="flex-grow relative z-10 p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[22px] font-semibold text-gray-900">
                      {bm.bm_name}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 cursor-pointer bg-green-100 text-green-800">
                      <Check className="h-4 w-4" />
                      <span className="ml-1">Hoạt động</span>
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-36 text-[16px] flex gap-1 items-center">
                        <Briefcase className="h-4 w-4 text-gray-400" />
                        BM ID:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {bm.bm_id}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <div className="absolute bottom-0 left-0 w-full">
                  <img className="w-full" src={url} alt="img" />
                </div>
              </Card>
            ))}
          </div>

          {bmList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy BM nào.</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Danh Sách TKQC ({filteredAccounts.length})
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAccounts.map((account: any) => (
              <AdAccountCard
                key={account.id}
                account={account}
                onRentClick={() => handleRentClick(account)}
              />
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Không tìm thấy BM/tài khoản quảng cáo phù hợp với tiêu chí tìm
                kiếm.
              </p>
            </div>
          )}
        </div>

        {selectedAccount && (
          <RentModal
            isOpen={isRentModalOpen}
            onClose={() => setIsRentModalOpen(false)}
            account={selectedAccount}
          />
        )}
        <CreateBMModal
          isOpen={isCreateBMModalOpen}
          onClose={() => setIsCreateBMModalOpen(false)}
          onSuccess={fetchBMList}
        />

        {selectedBM && isBMDetailModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
              ref={innerBorderRef}
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-[600px] relative max-h-[80vh] overflow-y-auto"
            >
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                onClick={() => setIsBMDetailModalOpen(false)}
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">
                Chi Tiết Tài Khoản BM:
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium w-1/3">Tên BM:</span>
                  <span>{selectedBM.bm_name}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-1/3">BM ID:</span>
                  <span>{selectedBM.bm_id}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-1/3">Trạng thái:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="h-3 w-3 mr-1" />
                    Hoạt động
                  </span>
                </div>
                {selectedBM.system_user_token && (
                  <div className="flex flex-col">
                    <span className="font-medium mb-1">System User Token:</span>
                    <div className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto">
                      <code className="break-all whitespace-pre-wrap">
                        {selectedBM.system_user_token}
                      </code>
                    </div>
                  </div>
                )}
                {Object.entries(selectedBM).map(
                  ([key, value]: [string, any]) => {
                    if (
                      ["bm_name", "bm_id", "system_user_token"].includes(key)
                    ) {
                      return null;
                    }
                    return (
                      <div key={key} className="flex items-start">
                        <span className="font-medium w-1/3">{key}:</span>
                        <span className="break-all">
                          {typeof value === "number"
                            ? value.toLocaleString()
                            : String(value)}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MarketplacePage;
