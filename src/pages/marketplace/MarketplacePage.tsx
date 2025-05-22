import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import AdAccountCard from './AdAccountCard';
import RentModal from './RentModal';
import { AdAccount } from '../../types';

// Mock data for demo purposes
const mockAdAccounts: AdAccount[] = [
  {
    id: '1',
    name: 'TKQC Cá nhân - Visa',
    accountType: 'personal',
    accountType: 'visa',
    defaultLimit: 5000000,
    pricePerDay: 200000,
    status: 'available',
    notes: 'TKQC sạch, limit cao, phù hợp mọi ngành hàng'
  },
  {
    id: '2',
    name: 'TKQC BM - Visa',
    accountType: 'business',
    accountType: 'visa',
    defaultLimit: 10000000,
    pricePerDay: 350000,
    status: 'available',
    notes: 'TKQC BM chất lượng cao, đã verify danh tính'
  },
  {
    id: '3',
    name: 'TKQC Cá nhân - Limit thấp',
    accountType: 'personal',
    accountType: 'low_limit',
    defaultLimit: 2000000,
    pricePerDay: 100000,
    status: 'available',
  },
  {
    id: '4',
    name: 'TKQC BM - Limit cao',
    accountType: 'business',
    accountType: 'high_limit',
    defaultLimit: 20000000,
    pricePerDay: 500000,
    status: 'available',
    notes: 'TKQC BM premium, limit cực cao, phù hợp cho chiến dịch lớn'
  },
  {
    id: '5',
    name: 'TKQC Cá nhân - Standard',
    accountType: 'personal',
    accountType: 'low_limit',
    defaultLimit: 3000000,
    pricePerDay: 150000,
    status: 'available',
    notes: 'TKQC tiêu chuẩn, phù hợp cho người mới bắt đầu'
  },
];

const MarketplacePage: React.FC = () => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<AdAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAccountType, setSelectedAccountType] = useState('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    setAdAccounts(mockAdAccounts);
    setFilteredAccounts(mockAdAccounts);
  }, []);

  useEffect(() => {
    let results = adAccounts;
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(account => 
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.bmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply BM type filter
    if (selectedType !== 'all') {
      results = results.filter(account => account.bmType === selectedType);
    }
    
    // Apply account type filter
    if (selectedAccountType !== 'all') {
      results = results.filter(account => account.accountType === selectedAccountType);
    }
    
    setFilteredAccounts(results);
  }, [adAccounts, searchTerm, selectedType, selectedAccountType]);

  const handleRentClick = (account: AdAccount) => {
    setSelectedAccount(account);
    setIsRentModalOpen(true);
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Danh sách BM / Tài khoản quảng cáo
            </h2>
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm BM, tài khoản..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mt-3 md:mt-0 flex items-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={toggleFilters}
            >
              <Filter className="h-5 w-5 mr-2 text-gray-400" />
              Bộ lọc
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {isFiltersOpen && (
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bmType" className="block text-sm font-medium text-gray-700">
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
                  <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
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

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => (
            <AdAccountCard 
              key={account.id} 
              account={account} 
              onRentClick={() => handleRentClick(account)} 
            />
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy BM/tài khoản quảng cáo phù hợp với tiêu chí tìm kiếm.</p>
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
    </Layout>
  );
};

export default MarketplacePage;