import styled from 'styled-components';
import img from '../../assets/bg-money-info-mb.png';
import avatar from '../../../public/avatar.jpg';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/index.ts';

interface Props {
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
}

const Subheader = ({ active, setActive }: Props) => {
  const userobj = useUserStore((state) => state.user);
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 sm:gap-4 border-b border-gray-200 mb-6">
      <button
        onClick={() => setActive('points')}
        className={`px-6 py-4 text-base font-bold transition-colors min-w-max rounded-t-lg ${
          active === 'points'
            ? 'text-blue-900 bg-gradient-to-r from-[#09FFCD] to-[#0AEEFE]'
            : 'text-gray-600 hover:text-[#1e3a8a]'
        }`}
      >
        Nạp tiền vào ví
      </button>
      <button
        onClick={() => setActive('money')}
        className={`px-6 py-4 text-base font-bold transition-colors min-w-max rounded-t-lg ${
          active === 'money'
            ? 'text-blue-900 bg-gradient-to-r from-[#09FFCD] to-[#0AEEFE]'
            : 'text-gray-600 hover:text-[#1e3a8a]'
        }`}
      >
        Nạp tiền
      </button>
    </div>
  );
};
const Container = styled.div<{
  img: string;
}>`
  .bg-info {
    background: url(${(props) => props.img}) right top / 30% 60% no-repeat,
      linear-gradient(180deg, #01ab4d, #017d38);
  }
  @media (max-width: 768px) {
    .bg-info {
      background: url(${(props) => props.img}) right top / 40% 60% no-repeat,
        linear-gradient(180deg, #01ab4d, #017d38);
    }
  }
  @media (max-width: 480px) {
    .bg-info {
      background: url(${(props) => props.img}) right top / 60% 60% no-repeat,
        linear-gradient(180deg, #01ab4d, #017d38);
    }
  }
`;
export default Subheader;
