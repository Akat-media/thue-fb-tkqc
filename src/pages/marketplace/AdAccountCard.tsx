import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Clock,
  Check,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  CircleFadingPlus,
  Search,
  Link,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import styled from 'styled-components';
import url from '../../assets/Bg.png';
import url2 from '../../assets/Expand.svg';
import url3 from '../../assets/Badge.svg';
import { Tooltip } from 'antd';

interface AdAccountCardProps {
  account: any;
  onRentClick: () => void;
  isAdmin?: boolean;
  onViewDetail?: (account: any) => void;
}

const AdAccountCard: React.FC<AdAccountCardProps> = ({
  account,
  onRentClick,
  isAdmin = false,
  onViewDetail,
}) => {
  const { t } = useTranslation();

  const getAccountTypeLabel = (type: string) => {
    return type === 'personal'
      ? t('adAccountCard.personal')
      : t('adAccountCard.bm');
  };

  const getLimitTypeLabel = (type: string) => {
    switch (type) {
      case 'visa':
        return t('adAccountCard.visa');
      case 'high_limit':
        return t('adAccountCard.highLimit');
      case 'low_limit':
        return t('adAccountCard.lowLimit');
      default:
        return type;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'rented':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-700 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return t('adAccountCard.available');
      case 'rented':
        return t('adAccountCard.rented');
      case 'unavailable':
        return t('adAccountCard.unavailable');
      default:
        return t('adAccountCard.available');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Check className="h-4 w-4" />;
      case 'rented':
        return <Clock className="h-4 w-4" />;
      case 'unavailable':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  return (
    <div
      onClick={() => onViewDetail?.(account)}
      className="cursor-pointer transition-all duration-200"
    >
      <CardContainer url={url}>
        <Card
          className="relative !overflow-visible main-card rounded-[24px]
        h-full flex flex-col border hover:shadow-lg hover:border-blue-500 
        transition-all hover:scale-105 hover:border-[2px]
        duration-200"
        >
          <CardContent className="flex-grow relative z-10">
            <div className="flex justify-between items-start">
              <Tooltip title={account?.name} placement="top">
                <div className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[22px] font-semibold text-gray-900 truncate max-w-[200px]">
                    {account?.name}
                  </span>
                  <img
                    src={url3}
                    alt="url3"
                    className="h-7 w-7 flex-shrink-0"
                  />
                </div>
              </Tooltip>
              <div>
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail?.(account);
                  }}
                  src={url2}
                  alt="Xem chi tiết"
                  className="h-5 w-5 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 cursor-pointer ${getStatusBadgeClass(
                  account?.status
                )}`}
              >
                {getStatusIcon(account?.status)}
                <span className="ml-1 whitespace-nowrap">
                  {getStatusLabel(account?.status)}
                </span>
              </span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center whitespace-nowrap font-medium">
                  <Briefcase className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-500 text-[16px]">
                    {t('adAccountCard.adAccountType')}:
                  </span>
                </div>
                {account?.is_visa_account ? (
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 
                        rounded-full text-xs font-medium gap-1
                        cursor-pointer bg-blue-100 text-blue-800`}
                    >
                      <Link className="h-4 w-4" />
                      <span className="ml-1 whitespace-nowrap">
                        {t('adAccountCard.withCard')}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div>
                    <span
                      className={`inline-flex items-center px-3 py-1 
                        rounded-full text-xs font-medium gap-1
                        cursor-pointer bg-[#FFEBDC] text-[#FF6400]`}
                    >
                      <Link className="h-4 w-4" />
                      <span className="ml-1 whitespace-nowrap">
                        {t('adAccountCard.withoutCard')}
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center whitespace-nowrap font-medium">
                  <ShieldCheck className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-500 text-[16px]">
                    {t('adAccountCard.accountNumber')}:
                  </span>
                </div>
                <span className="text-gray-900 font-semibold text-[16px]">
                  {account?.funding_source_details?.display_string ||
                    t('adAccountCard.noCardInfo')}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center whitespace-nowrap font-medium">
                  <CreditCard className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-gray-500 text-[16px]">
                    {t('adAccountCard.spendLimit')}:
                  </span>
                </div>
                <span className="text-gray-900 font-semibold text-[16px]">
                  {Number(account?.spend_cap)
                    ? `${Number(account.spend_cap).toLocaleString('vi-VN')} VNĐ`
                    : t('adAccountCard.noLimit')}
                </span>
              </div>
            </div>
            <div className="mt-4 text-[16px] text-gray-500 border-t pt-3">
              <p className="flex gap-1 items-center">
                <CircleFadingPlus className="h-4 w-4 text-gray-500" />
                {t('adAccountCard.highQualityAccount')}
              </p>
            </div>
          </CardContent>
          <CardFooter className="relative z-10 px-6 py-4 flex gap-2">
            <Button
              size="lg"
              className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm "
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onRentClick();
              }}
              icon={<CreditCard className="h-4 w-4" />}
            >
              {t('adAccountCard.rentNow')}
            </Button>
            <Button
              size="lg"
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm "
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onViewDetail?.(account);
              }}
              icon={<Search className="h-4 w-4" />}
            >
              {t('adAccountCard.viewDetails')}
            </Button>
          </CardFooter>
          <div className="absolute bottom-0 left-0 w-full">
            <img className="w-full" src={url} alt="img" />
          </div>
        </Card>
      </CardContainer>
    </div>
  );
};
const CardContainer = styled.div<{ url: any }>``;

export default AdAccountCard;
