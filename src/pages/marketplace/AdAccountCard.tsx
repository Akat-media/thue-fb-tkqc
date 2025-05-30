import React from "react";
import { CreditCard, Clock, Check, AlertCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { AdAccount } from "../../types";

interface AdAccountCardProps {
  account: any;
  onRentClick: () => void;
}

const AdAccountCard: React.FC<AdAccountCardProps> = ({
  account,
  onRentClick,
}) => {
  const getAccountTypeLabel = (type: string) => {
    return type === "personal" ? "Cá nhân" : "BM";
  };

  const getLimitTypeLabel = (type: string) => {
    switch (type) {
      case "visa":
        return "Visa";
      case "high_limit":
        return "Limit cao";
      case "low_limit":
        return "Limit thấp";
      default:
        return type;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "rented":
        return "bg-yellow-100 text-yellow-800";
      case "unavailable":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Có sẵn";
      case "rented":
        return "Đã thuê";
      case "unavailable":
        return "Không khả dụng";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Check className="h-4 w-4" />;
      case "rented":
        return <Clock className="h-4 w-4" />;
      case "unavailable":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">
            {account?.name}
          </h3>
          {/* <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(account.status)}`}>
            {getStatusIcon(account.status)}
            <span className="ml-1">{getStatusLabel(account.status)}</span>
          </span> */}
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-28">Loại TKQC:</span>
            <span className="text-gray-900 font-medium">BM</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-28">Loại tài khoản:</span>
            <span className="text-gray-900 font-medium">
              {account?.funding_source_details?.display_string}
            </span>
          </div>
          {/* <div className="flex items-center text-sm">
            <span className="text-gray-500 w-28">Limit mặc định:</span>
            <span className="text-gray-900 font-medium">{1000} VNĐ</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-28">Giá thuê/ngày:</span>
            <span className="text-gray-900 font-medium">{1000} VNĐ</span>
          </div> */}
        </div>

        <div className="mt-4 text-sm text-gray-500 border-t pt-3">
          <p>TKQC BM chất lượng cao, đã verify danh tính</p>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <Button
          fullWidth
          onClick={() => {
            onRentClick();
          }}
          icon={<CreditCard className="h-4 w-4" />}
        >
          Thuê ngay
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdAccountCard;
