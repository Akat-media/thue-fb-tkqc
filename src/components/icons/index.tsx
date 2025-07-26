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
import VietnameseFlag from './VietnamFlag';
import EnglishIcon from './EnglishIcon';
import Percent from './Percent';
import Checkcircle from './Checkcircle';
import LogoNew from './LogoNew';
import LogoV2 from './LogoV2';
import TagIcon from './TagIcon';
import FbIcon from './FbIcon';
import ZaloIcon from './ZaloIcon';
import YoutubeIcon from './YoutubeIcon';

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
    logoEL:EnglishIcon,
    vietnameseFlag:VietnameseFlag,
    percent: Percent,
    checkCircle: Checkcircle,
    logoNew: LogoNew,
    fb: FbIcon,
    zalo: ZaloIcon,
    youtube: YoutubeIcon,
    logoV2: LogoV2,
    ccIcon: TagIcon
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
