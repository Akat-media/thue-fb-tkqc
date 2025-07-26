import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Button, Tag, Typography, Space } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import Icon from '../../components/icons';
const { Title, Text, Paragraph } = Typography;
interface PricingCardProps {
  id?: string;
  name: string;
  description: string[];
  amount: number;
  start_date: string;
  end_date: string;
  currency: string;
  percentage: number;
  highlight: boolean;
  buttonLabel: string;
  buttonColor: string;
  buttonContact: string;
  subtitle: string;
  overview: string;
  buttonLabelEN: string;
  buttonContactEN: string;
}
export const getCardBg = (value: string) => {
  switch (value) {
    case 'Cơ bản':
    case 'Basic':
      return '#DCFFE7';
    case 'Tiêu chuẩn':
    case 'Standard':
      return '#C9FFF3';
    case 'Nâng cao':
    case 'Advance':
      return '#9AFFFA';
    case 'Cao cấp':
    case 'Special':
      return '#8CF5FF';
    default:
      return '#E2E8F0';
  }
};

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  description,
  amount,
  currency,
  percentage,
  buttonLabel = 'Bắt đầu ngay',
  buttonContact = 'Liên hệ',
  subtitle,
  overview,
  buttonLabelEN = 'Start now',
  buttonContactEN = 'Contact',
}) => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  
  return (
    <Card
      style={{
        width: '100%',
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Plan Tag */}
        <Tag
          style={{
            borderRadius: 20,
            padding: '4px 16px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#193250',
            backgroundColor: getCardBg(subtitle),
            border: `1px solid ${getCardBg(subtitle)}`,
          }}
        >

          {subtitle}
        </Tag>

        {/* Price Section */}
        <div>
          <Title
            level={2}
            style={{
              margin: 0,
              color: '#1e293b',
              fontSize: '32px',
              fontWeight: 600,
            }}
          >
            {name}{' '}
            <Text
              style={{ fontSize: '24px', fontWeight: 300, color: '#6B7280' }}
            >
              {currency}
            </Text>
          </Title>

          {percentage ? (
            <span
              style={{
                color: '#64748b',
                fontSize: '16px',
                display: 'flex',
                marginTop: 4,
                height:50,
                alignItems:"center"
              }}
            >
              <span className="font-semibold text-[#6B7280] text-xl">
                {t("price.fee")}:
              </span>
              {(amount < 2000000000 && currency === 'VND') ||
              (amount < 100000 && currency === 'USD') ? (
                <span className="flex ml-[5px] relative">
                  <Icon name="percent" />
                  <span className="absolute top-1/4 left-1/4 text-[#193250] font-semibold">
                    {percentage}%
                  </span>
                </span>
              ) : (
                <span className="ml-2 text-[#193250] font-semibold">
                  {t("price.contact")}
                </span>
              )}
            </span>
          ) :(
            <span
            style={{
              color: '#64748b',
              fontSize: '16px',
              display: 'flex',
              marginTop: 4,
              height:50,
              alignItems:"center"
            }}
          >
            <span className="font-semibold text-[#6B7280] text-xl">
              {t("price.fee")}:
            </span>
            <span className="ml-2 text-[#193250] text-xl font-semibold">
              {t("price.contact")}
            </span>
          </span>) 
          }
        </div>

        {/* Description */}
        {overview && (
          <Paragraph
            style={{
              color: '#6B7280',
              fontSize: '16px',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {overview}
          </Paragraph>
        )}

        {/* <Paragraph
          style={{
            color: '#64748b',
            fontSize: '14px',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {description}
        </Paragraph> */}

        {/* CTA Button */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {(amount < 2000000000 && currency === 'VND') ||
          (amount < 100000 && currency === 'USD') ? (
            <Button
              onClick={() => navigate("/marketplace")}
              type="primary"
              size="large"
              block
              // onClick={onButtonClick}
              style={{
                height: 64,
                borderRadius: 60,
                backgroundColor: '#193250',
                borderColor: '#193250',
                fontSize: '20px',
                fontWeight: 600,
                color:"#07FFE6"
              }}
            >
              {t("price.rent")}
            </Button>
          ) : (
            <Button
              size="large"
              block
              // onClick={onContactClick}
              style={{
                height: 64,
                borderRadius: 60,
                fontSize: '20px',
                fontWeight: 600,
                backgroundColor: '#193250',
                borderColor: '#193250',
                color: '#07FFE6',
              }}
            >
            {t("price.contact")}
            </Button>
          )}
        </Space>

        {/* Features List */}
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          {description.map((feature, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}
            >
              <Icon name='checkCircle' />
              <Text
                style={{
                  color: '#64748b',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              >
                {feature}
              </Text>
            </div>
          ))}
        </Space>
      </Space>
    </Card>
  );
};

export default PricingCard;
