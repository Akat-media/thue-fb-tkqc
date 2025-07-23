import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import styled from 'styled-components';
import NotiDropdown from '../icons/NotiDropdown';
import { useOnOutsideClick } from '../../hook/useOutside';
import { Checkbox, Slider } from 'antd';
import { useTranslation } from 'react-i18next';

type ButtonCmpProps = {
  onClick?: (data: any) => void;
  className?: string;
  label?: string;
  type?: string;
  icon?: React.ReactNode;
  beforeIcon?: React.ReactNode;
};

const ButtonCmp: React.FC<ButtonCmpProps> = ({
  onClick,
  className = '',
  label,
  icon = <Filter className="h-5 w-5 text-gray-400" />,
  beforeIcon = <ChevronDown />,
  type = 'money',
}) => {
  const { t, i18n } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(['1']);
  const { innerBorderRef } = useOnOutsideClick(() => setDropdownOpen(false));
  const buttonLabel = label || (i18n.language === 'en' ? 'Filter' : 'Bộ lọc');

  const filterItems = [
    { id: '1', label: t('filter.withCard') },
    { id: '2', label: t('filter.withoutCard') },
    { id: '3', label: t('filter.noLimit') },
  ];

  const formatMoney = (value: number) => value.toLocaleString('vi-VN');
  const parseMoney = (str: string) => Number(str.replace(/\./g, '') || '0');

  const toggleDropdown = () => {
    if (beforeIcon) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const isSelected = (id: string) => selectedItems.includes(id);
  ///
  const [range, setRange] = useState<[number, number]>([0, 10000000000]);
  const handleSliderChange = (value: number[]) => {
    setRange([value[0], value[1]]);
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max'
  ) => {
    const value = parseMoney(e.target.value);
    const newRange: [number, number] = [...range];

    if (type === 'min') {
      newRange[0] = Math.min(value, newRange[1]); // Không vượt quá max
    } else {
      newRange[1] = Math.max(value, newRange[0]); // Không nhỏ hơn min
    }

    setRange(newRange);
  };
  const onChange = (e: any) => {
    console.log(`checked = ${e.target.checked}`);
  };
  return (
    <ButtonStyle className="relative">
      <button
        type="button"
        className={`h-[54px] min-w-[120px] px-3 sm:px-4 
           rounded-full shadow-sm text-sm font-medium text-gray-700
            bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
            focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-1
            justify-center btn ${className}`}
        onClick={(e) => {
          toggleDropdown();
        }}
      >
        <span className="ml-2 hidden whitespace-nowrap lg:inline text-[16px] font-semibold">
          {buttonLabel}
        </span>
        {icon}
        {/* {beforeIcon} */}
      </button>

      {/* Dropdown chỉ hiển thị khi có beforeIcon */}
      {beforeIcon && (
        <div
          ref={innerBorderRef}
          className={`list-filter-child ${dropdownOpen ? 'active' : ''}`}
        >
          {type === 'money' && (
            <div>
              <div className="flex justify-between items-center">
                <p className="price-title mb-3 text-[24px] font-semibold">
                  {t('filter.priceRange')}
                </p>
                <Checkbox
                  className="text-[16px] font-medium"
                  onChange={onChange}
                >
                  {t('filter.noLimit')}
                </Checkbox>
              </div>
              <div className="input-price ">
                <div className="price-filter ">
                  <div className="price-input-group">
                    <div className="input-wrapper">
                      <label
                        className="mb-3 text-[14px] font-semibold text-[#B4B4B4]"
                        htmlFor="min-price"
                      >
                        {t('filter.minimum')}
                      </label>
                      <input
                        id="min-price"
                        type="text"
                        placeholder={'0'}
                        value={formatMoney(range[0])}
                        onChange={(e) => handleInputChange(e, 'min')}
                        className="price-input"
                      />
                    </div>
                  </div>
                  {/* - */}
                  <div className="price-input-group">
                    <div className="input-wrapper">
                      <label
                        className="mb-2 text-[14px] font-semibold text-[#B4B4B4]"
                        htmlFor="min-price"
                      >
                        {t('filter.maximum')}
                      </label>
                      <input
                        id="max-price"
                        type="text"
                        placeholder={''}
                        value={formatMoney(range[1])}
                        onChange={(e) => handleInputChange(e, 'max')}
                        className="price-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Slider
                range
                min={0}
                max={10000000000}
                step={100000}
                value={range}
                onChange={handleSliderChange}
                tooltip={{
                  formatter: (value) => `${value?.toLocaleString()}₫`,
                }}
              />
            </div>
          )}
          {/* <p className="price-title mb-3">{t('filter.accountType')}</p>
          <ul>
            {filterItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`btn-filter btn-filter-item button__filter-children ${
                    isSelected(item.id) ? 'active' : ''
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  {item.label}
                  <span className="icon tooltip">
                    <NotiDropdown
                      color={isSelected(item.id) ? '#2570eb' : undefined}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul> */}

          <div className="btn-filter-group show flex justify-between gap-[20px] mt-4">
            <button
              className="button button__filter-children-close is-small is-danger is-light"
              onClick={() => setDropdownOpen(false)}
            >
              {t('filter.close')}
            </button>

            <button
              onClick={() => {
                onClick?.({
                  selectedItems,
                  range,
                });
              }}
              className="button button__filter-children-submit is-small is-danger submit"
            >
              {t('filter.viewResults')}
            </button>
          </div>
        </div>
      )}
    </ButtonStyle>
  );
};

const ButtonStyle = styled.div`
  .btn {
    position: relative;
    background: white;
    border-radius: 9999px; /* full rounded */
    padding: 2px;
    z-index: 0;
  }

  .btn::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    padding: 1px; /* thickness của border */
    border-radius: 9999px;
    background: linear-gradient(
      84.75deg,
      #07ffc9 1.75%,
      #29fbfb 51.57%,
      #00eaff 86.96%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  .list-filter-child {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    box-shadow: 0 1px 20px rgba(0, 0, 0, 0.2);
    display: none;
    left: 0;
    max-width: 600px;
    opacity: 0;
    padding: 16px;
    position: absolute;
    top: 64px;
    transition: 0.5s;
    width: calc(100vw - 20px);
    z-index: -1;
  }
  .list-filter-child.active {
    display: block;
    max-height: 60vh;
    opacity: 1;
    z-index: 100;
  }
  .list-filter-child.active:after {
    border-bottom: 10px solid #fff;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    content: '';
    left: 30px;
    position: absolute;
    top: -10px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .btn-filter {
    align-items: center;
    background: #f2f2f3;
    border: none;
    border-radius: 8px;
    color: #1d1d20;
    cursor: pointer;
    display: flex;
    font-size: 14px;
    gap: 4px;
    height: 40px;
    justify-content: center;
    padding: 8px 16px;
    transition: 0.3s;
    white-space: nowrap;
  }
  .btn-filter-item.btn-filter.active {
    background: #eff5ff;
    box-shadow: 0 0 0 1px #2570eb;
    color: #2570eb;
    font-weight: 600;
  }
  .button {
    background: #fff;
    border: 1px solid #cfcfd3;
    border-radius: 8px;
    color: #18181b;
    font-size: 14px;
    font-weight: 600;
    height: auto;
    padding: 10px;
    width: calc(50% - 5px);
  }
  .button:hover {
    background: #f7f7f8;
  }
  .button.submit {
    background: #193250;
    border-color: #193250;
    color: #fff;
  }
  .button.submit:hover {
    background: #456993;
  }
  .price-filter {
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    gap: 20px;
    margin-top: 8px;
    justify-content: space-between;
    .price-input-group {
      width: calc(50% - 5px);
    }
  }
  .price-input {
    border: 1px solid #cfcfd3;
    border-radius: 6px;
    flex: 1;
    font-size: 16px;
    outline: none;
    padding: 8px 55px 8px 16px;
    text-align: right;
    transition: border-color 0.2s ease;
    width: 100%;
  }
  .ant-slider-track {
    background-color: #d70018;
    background: linear-gradient(
      84.75deg,
      #07ffc9 1.75%,
      #29fbfb 51.57%,
      #00eaff 86.96%
    );
    height: 8px;
  }
  .ant-slider-track:hover {
    background-color: #d70018;
    background: linear-gradient(
      84.75deg,
      #07ffc9 1.75%,
      #29fbfb 51.57%,
      #00eaff 86.96%
    );
  }
  .ant-slider-handle::after,
  .ant-slider-handle::before {
    width: 13px;
    height: 13px;
  }
`;

export default ButtonCmp;
