import React, { useState } from 'react';
import { CreditCard, Copy, RefreshCw, FileText } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Transaction } from '../../types';

// Mock transactions data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    amount: 1000000,
    type: 'deposit',
    status: 'completed',
    description: 'Nạp tiền qua Web2m - Chuyển khoản ngân hàng',
    transactionCode: 'DEPOSIT-123456',
    createdAt: new Date(2023, 5, 15, 10, 30),
  },
  {
    id: '2',
    userId: '1',
    amount: 500000,
    type: 'payment',
    status: 'completed',
    description: 'Thanh toán thuê BM Agency - Visa',
    createdAt: new Date(2023, 5, 16, 14, 45),
  },
  {
    id: '3',
    userId: '1',
    amount: 200000,
    type: 'refund',
    status: 'completed',
    description: 'Hoàn tiền limit chưa sử dụng',
    createdAt: new Date(2023, 5, 18, 9, 15),
  },
];

const PaymentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('deposit');
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [selectedAmount, setSelectedAmount] = useState(1000000);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { addNotification } = useNotification();

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification('Đã sao chép', 'Thông tin đã được sao chép vào clipboard', 'success');
  };

  const handleDeposit = async () => {
    const amount = customAmount ? parseInt(customAmount) : selectedAmount;
    
    if (isNaN(amount) || amount <= 0) {
      addNotification('Lỗi', 'Vui lòng nhập số tiền hợp lệ', 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addNotification(
        'Tạo lệnh nạp tiền thành công', 
        'Vui lòng chuyển khoản theo thông tin đã cung cấp', 
        'success'
      );
    } catch (error) {
      console.error('Deposit error:', error);
      addNotification(
        'Có lỗi xảy ra', 
        'Không thể tạo lệnh nạp tiền. Vui lòng thử lại sau', 
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTransactionDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Quản lý tài chính
            </h2>
            {user && (
              <p className="mt-1 text-sm text-gray-500">
                Số dư hiện tại: <span className="font-medium text-green-600">{user.balance.toLocaleString('vi-VN')} VNĐ</span>
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
              <option value="history">Lịch sử giao dịch</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  className={`${
                    activeTab === 'deposit'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('deposit')}
                >
                  <CreditCard className="h-5 w-5 mr-2 inline-block" />
                  Nạp tiền
                </button>
                <button
                  className={`${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('history')}
                >
                  <FileText className="h-5 w-5 mr-2 inline-block" />
                  Lịch sử giao dịch
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'deposit' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nạp tiền qua Web2m</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Chọn mệnh giá
                      </label>
                      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[500000, 1000000, 2000000, 5000000].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            className={`${
                              selectedAmount === amount && !customAmount
                                ? 'bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-700'
                            } border rounded-md py-2 px-3 text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                            onClick={() => {
                              setSelectedAmount(amount);
                              setCustomAmount('');
                            }}
                          >
                            {amount.toLocaleString('vi-VN')}đ
                          </button>
                        ))}
                        <div className="col-span-2 sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Hoặc nhập số tiền khác
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Nhập số tiền"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              min="100000"
                              step="10000"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-blue-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <RefreshCw className="h-5 w-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">Thông tin chuyển khoản</h3>
                          <div className="mt-2 text-sm text-blue-700 space-y-1">
                            <div className="flex justify-between">
                              <span>Ngân hàng:</span>
                              <div className="flex items-center">
                                <span className="font-medium">Vietcombank</span>
                                <button
                                  onClick={() => handleCopyClick('Vietcombank')}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Số tài khoản:</span>
                              <div className="flex items-center">
                                <span className="font-medium">1234567890</span>
                                <button
                                  onClick={() => handleCopyClick('1234567890')}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Chủ tài khoản:</span>
                              <div className="flex items-center">
                                <span className="font-medium">CÔNG TY TNHH AKADS</span>
                                <button
                                  onClick={() => handleCopyClick('CÔNG TY TNHH AKADS')}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Nội dung CK:</span>
                              <div className="flex items-center">
                                <span className="font-medium">AKADS {user?.name.split(' ')[0]}</span>
                                <button
                                  onClick={() => handleCopyClick(`AKADS ${user?.name.split(' ')[0]}`)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Số tiền:</span>
                              <div className="flex items-center">
                                <span className="font-medium">
                                  {(customAmount ? parseInt(customAmount) : selectedAmount).toLocaleString('vi-VN')} VNĐ
                                </span>
                                <button
                                  onClick={() => handleCopyClick(`${customAmount ? parseInt(customAmount) : selectedAmount}`)}
                                  className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
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
                        Sau khi chuyển khoản, hệ thống sẽ tự động cộng tiền vào tài khoản của bạn trong vòng 5 phút.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Hướng dẫn nạp tiền</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                          1
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">Chọn số tiền cần nạp</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Chọn một trong các mệnh giá có sẵn hoặc nhập số tiền tùy chọn (tối thiểu 100.000đ).
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
                        <h4 className="text-sm font-medium text-gray-900">Tạo lệnh nạp tiền</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Nhấn nút "Tạo lệnh nạp tiền" để hệ thống tạo một mã giao dịch duy nhất.
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
                        <h4 className="text-sm font-medium text-gray-900">Chuyển khoản ngân hàng</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Thực hiện chuyển khoản theo thông tin được cung cấp. Lưu ý nhập đúng nội dung chuyển khoản.
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
                        <h4 className="text-sm font-medium text-gray-900">Nhận tiền tự động</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Hệ thống sẽ tự động cộng tiền vào tài khoản của bạn sau khi nhận được thanh toán (thường trong vòng 5 phút).
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử giao dịch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thời gian
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Loại giao dịch
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mô tả
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số tiền
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatTransactionDate(transaction.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.type === 'deposit' 
                                  ? 'bg-green-100 text-green-800' 
                                  : transaction.type === 'refund'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.type === 'deposit' 
                                  ? 'Nạp tiền' 
                                  : transaction.type === 'refund'
                                    ? 'Hoàn tiền'
                                    : 'Thanh toán'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`font-medium ${
                                transaction.type === 'deposit' || transaction.type === 'refund'
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                              }`}>
                                {transaction.type === 'deposit' || transaction.type === 'refund' ? '+' : '-'}
                                {transaction.amount.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : transaction.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}>
                                {transaction.status === 'completed' 
                                  ? 'Hoàn thành' 
                                  : transaction.status === 'pending'
                                    ? 'Đang xử lý'
                                    : 'Thất bại'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {transactions.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Chưa có giao dịch nào.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;