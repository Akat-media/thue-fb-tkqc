import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePreventScroll } from '../../hook/usePreventScroll';

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
  const { t } = useTranslation();
  usePreventScroll(isOpen);

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      newErrors.cardName = 'card_name_required';
    } else if (!/^[A-Za-zÀ-ỹ]+(\s[A-Za-zÀ-ỹ]+)*$/.test(cardName.trim())) {
      newErrors.cardName = 'card_name_invalid';
    } else if (cardName.trim().length > 40) {
      newErrors.cardName = 'card_name_max';
    }

    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'card_number_required';
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'card_number_invalid';
    }

    if (!expiry.trim()) {
      newErrors.expiry = 'expiry_required';
    } else {
      const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
      const match = expiry.match(expiryRegex);
      if (!match) {
        newErrors.expiry = 'expiry_invalid';
      }
    }

    if (!cvv.trim()) {
      newErrors.cvv = 'cvv_required';
    } else if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'cvv_invalid';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'agree_terms';
    }

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
            {t('payment_modal.title')}
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
              {t('payment_modal.card_name')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder={t('payment_modal.card_name_placeholder')}
            />
            {errors.cardName && (
              <div className="text-red-500 text-xs mt-1">
                {t(`payment_modal.errors.${errors.cardName}`)}
              </div>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-1 flex items-center justify-between">
              <span>
                {t('payment_modal.card_number')} <span className="text-red-500">*</span>
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
              placeholder={t('payment_modal.card_number_placeholder')}
              inputMode="numeric"
              maxLength={19}
            />
            {errors.cardNumber && (
              <div className="text-red-500 text-xs mt-1">
                {t(`payment_modal.errors.${errors.cardNumber}`)}
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-base font-medium text-gray-700 mb-1">
                {t('payment_modal.expiry')} <span className="text-red-500">*</span>
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
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiry && (
                <div className="text-red-500 text-xs mt-1">
                  {t(`payment_modal.errors.${errors.expiry}`)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-base font-medium text-gray-700 mb-1">
                {t('payment_modal.cvv')} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={cvv}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setCvv(raw);
                  }}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="•••"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              {errors.cvv && (
                <div className="text-red-500 text-xs mt-1">
                  {t(`payment_modal.errors.${errors.cvv}`)}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <Link to="/policy" className="text-base text-blue-600 underline">
              {t('payment_modal.terms')} <span className="text-red-500">*</span>
            </Link>
          </div>
          {errors.agreeTerms && (
            <div className="text-red-500 text-xs mt-1">
              {t(`payment_modal.errors.${errors.agreeTerms}`)}
            </div>
          )}

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!agreeTerms}
            className="w-full text-white rounded-xl mt-2 p-4"
          >
            <p className="flex justify-center items-center w-full h-full p-3 font-semibold">
              {t('payment_modal.save')}
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCardModal;
