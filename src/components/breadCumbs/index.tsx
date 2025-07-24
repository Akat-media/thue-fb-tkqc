import React from 'react';
import styled from 'styled-components';
type TabItem = {
  key: string;
  label: string;
};

type BreadCumbsCmpProps = {
  tabs: TabItem[];
  activeTab?: string;
  className?: string;
  setActiveTab: (key: string) => void;
};
const BreadCumbsCmp: React.FC<BreadCumbsCmpProps> = ({
  tabs,
  activeTab = '',
  setActiveTab,
  className = '',
}) => {
  return (
    <BreadCumbs>
      <div className="breadcumbs-container overflow-x-auto">
        {tabs.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              className={`
        whitespace-nowrap py-4 border-b-2 text-[16px] font-semibold ${className}
        ${
          isActive
            ? 'border-blue-500 text-[#193250] active'
            : 'border-transparent text-[#6E7382] hover:text-blue-600 hover:border-gray-300'
        }
      `}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </BreadCumbs>
  );
};
const BreadCumbs = styled.div`
  .breadcumbs-container {
    display: flex;
    gap: 36px;
  }
  .active {
    border-bottom: 3px solid;

    border-image-source: linear-gradient(
      84.75deg,
      #07ffc9 1.75%,
      #29fbfb 51.57%,
      #00eaff 86.96%
    );
    border-image-slice: 1;
  }
`;
export default BreadCumbsCmp;
