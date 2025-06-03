import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import BaseHeader from "../../api/BaseHeader";

interface RentModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: any;
}

const RentModal: React.FC<RentModalProps> = ({ isOpen, onClose, account }) => {
  const objetUser = localStorage.getItem("user");
  const userParse = JSON.parse(objetUser || "{}");
  const [userBmId, setUserBmId] = useState("");
  const [requestedLimit, setRequestedLimit] = useState(50000);
  const [errors, setErrors] = useState<{ bmId?: string; limit?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { addNotification } = useNotification();

  if (!isOpen) return null;

  const calculateTotalPrice = () => {
    return requestedLimit + requestedLimit * 0.1;
  };
  console.log("userBmId", userBmId);
  const handleSubmit = async () => {
    try {
      const response = await BaseHeader({
        url: "points-used",
        method: "post",
        data: {
          bm_id: userBmId || "",
          ads_account_id: account?.account_id || "",
          user_id: userParse.user_id || "",
          amountPoint: calculateTotalPrice(),
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Rental error:", error);
      addNotification(
        "Có lỗi xảy ra",
        "Không thể hoàn tất yêu cầu thuê tài khoản. Vui lòng thử lại sau",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <Card className="border-0 shadow-none">
            <CardHeader className="relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
              <CardTitle>Thuê tài khoản quảng cáo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Thông tin tài khoản
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Bạn đang thuê: <strong>{account.name}</strong>
                      </p>
                      {/* <p>
                        Limit mặc định:{" "}
                        <strong>
                          {account.defaultLimit.toLocaleString("vi-VN")} VNĐ
                        </strong>
                      </p>
                      <p>
                        Giá thuê/ngày:{" "}
                        <strong>
                          {account.pricePerDay.toLocaleString("vi-VN")} VNĐ
                        </strong>
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Input
                    id="userBmId"
                    label="BM ID của bạn"
                    type="text"
                    placeholder="Ví dụ: 123456789"
                    value={userBmId}
                    onChange={(e) => setUserBmId(e.target.value)}
                    error={errors.bmId}
                    helperText="BM ID để chúng tôi cấp quyền truy cập"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                  />
                </div>

                {/* <div>
                  <Input
                    id="rentalDays"
                    label="Số ngày thuê"
                    type="number"
                    min="1"
                    max="30"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value))}
                    helperText="Thời gian thuê tối thiểu 1 ngày"
                    fullWidth
                  />
                </div> */}

                <div>
                  <Input
                    id="requestedLimit"
                    label="Hạn mức chi tiêu yêu cầu (VNĐ)"
                    type="number"
                    min={account.defaultLimit / 2}
                    max={account.defaultLimit * 2}
                    step={100000}
                    value={requestedLimit}
                    onChange={(e) =>
                      setRequestedLimit(parseInt(e.target.value))
                    }
                    error={errors.limit}
                    // helperText={`Hạn mức mặc định: ${account.defaultLimit.toLocaleString(
                    //   "vi-VN"
                    // )} VNĐ. Phí 5% cho phần vượt quá`}
                    fullWidth
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#0167F8]"
                  />
                  <div className="text-sm text-gray-500 mt-1 pl-2">
                    Hạn mức: {requestedLimit.toLocaleString("vi-VN")} VNĐ
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900">
                  Chi tiết thanh toán
                </h4>
                <div className="mt-2 space-y-1">
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Phí thuê ({rentalDays} ngày)
                    </span>
                    <span className="text-gray-900 font-medium">
                      {(account.pricePerDay * rentalDays).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ
                    </span>
                  </div> */}
                  {requestedLimit > account.defaultLimit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Phí tăng limit</span>
                      <span className="text-gray-900 font-medium">
                        {/* {(
                          (requestedLimit - account.defaultLimit) *
                          0.05
                        ).toLocaleString("vi-VN")}{" "}
                        VNĐ */}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Phí dịch vụ (10%)</span>
                    <span className="text-gray-900 font-medium">
                      {/* {(account.pricePerDay * rentalDays * 0.1).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      VNĐ */}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-900">Tổng thanh toán</span>
                      <span className="text-blue-600">
                        {calculateTotalPrice().toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* {user && (
                <div className="text-sm">
                  <span className="text-gray-500">Số dư của bạn: </span>
                  <span
                    className={`font-medium ${
                      user.balance < calculateTotalPrice()
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {user?.balance != null
                      ? user.balance.toLocaleString("vi-VN") + " VNĐ"
                      : "Đang tải..."}
                  </span>

                  {user.balance < calculateTotalPrice() && (
                    <div className="mt-2 text-sm text-red-600">
                      Số dư không đủ để thuê tài khoản này. Vui lòng nạp thêm
                      tiền.
                    </div>
                  )}
                </div>
              )} */}
            </CardContent>
            <CardFooter className="flex justify-end space-x-3 bg-gray-50 border-t">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={false}
              >
                Xác nhận thuê
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RentModal;
