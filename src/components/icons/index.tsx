import React from 'react';
import { IconProps, IconType } from './types';
import HomeIcon from './HomeIcon';
import PricingIcon from './PricingIcon';
import TopupIcon from './TopupIcon';
import AccountsIcon from './AccountsIcon';
import RentedIcon from './RentedIcon';
import HistoryIcon from './HistoryIcon';
import SupportIcon from './SupportIcon';
import Logo from './Logo';
import VietnameseIcon from './VietnameseIcon';

interface IconComponentProps extends IconProps {
  name: IconType;
}

const Icon: React.FC<IconComponentProps> = ({ name, ...props }) => {
  const iconComponents: Record<IconType, React.ComponentType<IconProps>> = {
    home: HomeIcon,
    pricing: PricingIcon,
    topup: TopupIcon,
    accounts: AccountsIcon,
    rented: RentedIcon,
    history: HistoryIcon,
    support: SupportIcon,
    logo: Logo,
    logoVietnam: VietnameseIcon,
  };

  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent {...props} />;
};

export default Icon;
export type { IconProps, IconType }; 