import React from 'react';
import { Briefcase, ShieldCheck, CircleFadingPlus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import url from '../../assets/bg.svg';

interface BM {
  id: string;
  bm_id: string;
  bm_name: string;
  system_user_token?: string;
  created_at?: string;
  updated_at?: string;
}

interface BMCardProps {
  bm: BM;
  onClick: () => void;
  onDelete: (bm: BM) => void;
  onExchangeToken: (bm: BM) => void;
}

const BMCard: React.FC<BMCardProps> = ({
  bm,
  onClick,
  onDelete,
  onExchangeToken,
}) => {
  return (
    <CardContainer url={url}>
      <Card className="relative main-card h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardContent className="flex-grow relative z-10">
          <div className="flex justify-between items-start h-[55px]">
            <Tooltip title={bm?.bm_name} placement="top">
              <h3 className="text-[22px] font-semibold text-gray-900 line-clamp-2 overflow-hidden text-ellipsis leading-tight max-w-[200px] cursor-pointer">
                {bm?.bm_name}
              </h3>
            </Tooltip>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1 cursor-pointer bg-green-100 text-green-700 border border-green-200 shadow-sm hover:shadow-md transition-all duration-200 whitespace-nowrap">
              Hoạt động
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-36 text-[16px] flex gap-1 items-center">
                <Briefcase className="h-4 w-4 text-gray-400" />
                BM ID:
              </span>
              <Tooltip title={bm?.bm_id} placement="top">
                <span className="text-gray-900 font-medium overflow-hidden text-ellipsis leading-tight cursor-pointer">
                  {bm?.bm_id}
                </span>
              </Tooltip>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-gray-500 w-36 text-[16px] flex gap-1 items-center">
                <ShieldCheck className="h-4 w-4 text-gray-400" />
                Trạng thái:
              </span>
              <span className="text-gray-900 font-medium">Hoạt động</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 border-t pt-3">
            <p className="flex gap-1 items-center">
              <CircleFadingPlus className="h-4 w-4 text-gray-400" />
              Tài khoản BM đã được xác thực
            </p>
          </div>
        </CardContent>
        <CardFooter className="relative z-10 px-6 py-4">
          <div className="flex gap-2 w-full">
            <Button
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onDelete(bm);
              }}
              className="bg-red-500 hover:bg-red-600"
              icon={<Trash2 className="w-4 h-4" />}
            >
              Xóa
            </Button>
            <Button
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onExchangeToken(bm);
              }}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Gia hạn token
            </Button>
            <Button
              fullWidth
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Xem chi tiết
            </Button>
          </div>
        </CardFooter>
        <div className="absolute bottom-0 left-0 w-full">
          <img className="w-full" src={url || '/placeholder.svg'} alt="img" />
        </div>
      </Card>
    </CardContainer>
  );
};

const CardContainer = styled.div<{ url: any }>``;

export default BMCard;
