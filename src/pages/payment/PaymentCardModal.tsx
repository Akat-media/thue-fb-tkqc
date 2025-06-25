import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: any) => void;
  onBackToRentModal?: () => void;
}

const PaymentCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  onBackToRentModal,
}) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isOpen) {
      setCardName('');
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setSaveCard(false);
      setAgreeTerms(false);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!cardName.trim()) {
      newErrors.cardName = 'Vui lòng nhập tên trên thẻ.';
    } else if (!/^[A-Za-zÀ-ỹ]+(\s[A-Za-zÀ-ỹ]+)*$/.test(cardName.trim())) {
      newErrors.cardName =
        'Tên chỉ được chứa chữ cái và khoảng trắng giữa các từ.';
    } else if (cardName.trim().length > 40) {
      newErrors.cardName = 'Tên trên thẻ không được dài quá 40 ký tự.';
    }
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Vui lòng nhập số thẻ.';
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Số thẻ phải gồm 16 chữ số.';
    }
    if (!expiry.trim()) {
      newErrors.expiry = 'Vui lòng nhập ngày hết hạn.';
    } else {
      const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
      const match = expiry.match(expiryRegex);
      if (!match) {
        newErrors.expiry = 'Vui lòng nhập đúng định dạng MM/YY (ví dụ: 12/25).';
      } else {
        const [_, mm, yy] = match;
        if (isNaN(parseInt(mm)) || isNaN(parseInt(yy))) {
          newErrors.expiry = 'MM và YY phải là số hợp lệ.';
        }
      }
    }
    if (!cvv.trim()) {
      newErrors.cvv = 'Vui lòng nhập CVV.';
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV phải gồm 3 hoặc 4 chữ số.';
    }
    if (!agreeTerms)
      newErrors.agreeTerms = 'Vui lòng lựa chọn đồng ý với các điều khoản.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ cardName, cardNumber, expiry, cvv, saveCard });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-2xl p-8 relative shadow-2xl">
        <div className="flex items-center justify-between mb-6 relative">
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-950 text-center flex-grow">
            Thêm thẻ thanh toán
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black absolute right-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Tên trên thẻ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="NGUYEN VAN ANH"
            />
            {errors.cardName && (
              <div className="text-red-500 text-xs mt-1">{errors.cardName}</div>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1 flex items-center justify-between">
              <span>
                Số thẻ <span className="text-red-500">*</span>
              </span>
              <span className="space-x-1">
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/yy/r/nb0pz9XDsBU.png"
                  alt="Visa"
                  className="inline-block w-9"
                />
                <img
                  src="https://static.xx.fbcdn.net/rsrc.php/v4/y5/r/vYNls7mhq4f.png"
                  alt="Mastercard"
                  className="inline-block w-9"
                />
              </span>
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, '').slice(0, 16);
                const formatted = rawValue.replace(/(.{4})/g, '$1 ').trim();
                setCardNumber(formatted);
              }}
              className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="1234 5678 9012 3456"
              inputMode="numeric"
              maxLength={19}
            />
            {errors.cardNumber && (
              <div className="text-red-500 text-xs mt-1">
                {errors.cardNumber}
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-base font-medium text-gray-700 mb-1">
                MM/YY <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => {
                  let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (raw.length >= 3) {
                    raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
                  }
                  setExpiry(raw);
                }}
                className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="12/25"
                maxLength={5}
              />

              {errors.expiry && (
                <div className="text-red-500 text-xs mt-1">{errors.expiry}</div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-base font-medium text-gray-700 mb-1">
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setCvv(raw);
                }}
                className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="•••"
                inputMode="numeric"
              />
              {errors.cvv && (
                <div className="text-red-500 text-xs mt-1">{errors.cvv}</div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <Link to={'/policy'} className="text-base text-blue-600 underline">
              Tôi đồng ý với các điều khoản và chính sách
              <span className="text-red-500">*</span>
            </Link>
          </div>
          {errors.agreeTerms && (
            <div className="text-red-500 text-xs mt-1">{errors.agreeTerms}</div>
          )}
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!agreeTerms}
            className='w-full text-white rounded-xl mt-2 p-4'
          >
            <p className='flex justify-center items-center w-full h-full p-3 font-semibold'>Lưu</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCardModal;
