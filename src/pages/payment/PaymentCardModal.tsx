import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: any) => void;
}

const PaymentCardModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!cardName.trim()) newErrors.cardName = 'Vui lòng nhập tên trên thẻ.';
    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Vui lòng nhập số thẻ.';
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Số thẻ phải gồm 16 chữ số.';
    }
    if (!expiry.trim()) {
      newErrors.expiry = 'Vui lòng nhập ngày hết hạn.';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Định dạng MM/YY (ví dụ: 12/25).';
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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6 text-blue-950">
          Thêm thẻ thanh toán
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Tên trên thẻ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nguyen Van Anh"
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
              onChange={(e) => setCardNumber(e.target.value)}
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
                onChange={(e) => setExpiry(e.target.value)}
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
                onChange={(e) => setCvv(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="•••"
                inputMode="numeric"
                maxLength={4}
              />
              {errors.cvv && (
                <div className="text-red-500 text-xs mt-1">{errors.cvv}</div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
            />
            <label className="text-base text-gray-700">Lưu thông tin thẻ</label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label className="text-base text-gray-700">
              Tôi đồng ý với các điều khoản và chính sách
              <span className="text-red-500">*</span>
            </label>
          </div>
          {errors.agreeTerms && (
            <div className="text-red-500 text-xs mt-1">{errors.agreeTerms}</div>
          )}

          <button
            onClick={handleSubmit}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mt-2 ${
              Object.keys(errors).length > 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={Object.keys(errors).length > 0}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCardModal;
