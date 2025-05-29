import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { QRCodeSVG } from "qrcode.react";

// Dữ liệu mẫu cho tài khoản nạp tiền
const paymentAccounts = [
  { id: "1", name: "Ngân hàng Vietcombank", qrData: "vcb_123456" },
  { id: "2", name: "Ngân hàng Techcombank", qrData: "tcb_789012" },
  { id: "3", name: "Ví Momo", qrData: "momo_345678" },
  { id: "4", name: "Ngân hàng BIDV", qrData: "bidv_901234" },
];

interface FormData {
  paymentAccountId: string;
  amount: string;
}

const PaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    paymentAccountId: "",
    amount: "",
  });
  const [selectedAccount, setSelectedAccount] = useState<
    (typeof paymentAccounts)[0] | null
  >(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "paymentAccountId") {
      const account = paymentAccounts.find((acc) => acc.id === value);
      setSelectedAccount(account || null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.paymentAccountId && formData.amount) {
      console.log("Payment Data:", {
        paymentAccount: paymentAccounts.find(
          (acc) => acc.id === formData.paymentAccountId
        ),
        amount: parseFloat(formData.amount),
      });
      alert("Xác nhận nạp tiền thành công! (Demo)");
      navigate("/marketplace");
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleCancel = () => {
    navigate("/marketplace");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold	 text-gray-900 mb-6">
            Nạp Tiền Vào Tài Khoản
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Phần Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tài khoản nạp tiền
                  </label>
                  <select
                    name="paymentAccountId"
                    value={formData.paymentAccountId}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                  >
                    <option value="">Chọn tài khoản nạp tiền</option>
                    {paymentAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số tiền cần nạp
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    required
                    min="0"
                    step="0.01"
                    placeholder="Nhập số tiền"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    Xác nhận
                  </button>
                </div>
              </form>
            </div>
            {/* Phần mã QR */}
            <div className="flex items-center justify-center">
              {selectedAccount ? (
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Quét mã QR để nạp tiền
                  </h3>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <QRCodeSVG
                      value={selectedAccount.qrData}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Tài khoản: {selectedAccount.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Mã giao dịch: {selectedAccount.qrData}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  Vui lòng chọn tài khoản để hiển thị mã QR
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentForm;
