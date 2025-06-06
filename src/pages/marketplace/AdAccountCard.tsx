import React from "react";
import {
  CreditCard,
  Clock,
  Check,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  CircleFadingPlus,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import styled from "styled-components";
import url from "../../assets/bg.svg";

interface AdAccountCardProps {
  account: any;
  onRentClick: () => void;
}
const dataURI = `data:image/svg+xml,${encodeURIComponent(url)}`;

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
        return "bg-green-100 text-green-700 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200";
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
        return "Có sẵn";
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
        return <Check className="h-4 w-4" />;
    }
  };

  return (
    <CardContainer url={url}>
      <Card className="relative main-card h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardContent className="flex-grow relative z-10">
          <div className="flex justify-between items-start">
            <h3 className="text-[22px] font-semibold text-gray-900">
              {account?.name}
            </h3>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 cursor-pointer ${getStatusBadgeClass(
                account?.status
              )}`}
            >
              {getStatusIcon(account?.status)}
              <span className="ml-1">{getStatusLabel(account?.status)}</span>
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-36 text-[16px] flex gap-1 items-center">
                <Briefcase className="h-4 w-4 text-gray-400" />
                Loại TKQC:
              </span>
              <span className="text-gray-900 font-medium">BM</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-36 text-[16px] flex gap-1 items-center">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                Số tài khoản:
              </span>
              <span className="text-gray-900 font-medium">
                {account?.funding_source_details?.display_string}
              </span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 border-t pt-3">
            <p className="flex gap-1 items-center">
              <CircleFadingPlus className="h-4 w-4 text-gray-400" />
              TKQC BM chất lượng cao, đã verify danh tính
            </p>
          </div>
        </CardContent>
        <CardFooter className=" relative z-10 px-6 py-4">
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
        <div className="absolute bottom-0 left-0 w-full">
          <img className="w-full" src={url} alt="img" />
        </div>
      </Card>
    </CardContainer>
  );
};
const CardContainer = styled.div<{ url: any }>``;
export default AdAccountCard;
