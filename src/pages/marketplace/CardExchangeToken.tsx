import type React from 'react';
import { useState } from 'react';
import { usePreventScroll } from '../../hook/usePreventScroll';

interface ModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSubmit: (data: { client_id: string; client_secret: string }) => void;
}

const CardExchangeToken: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  usePreventScroll(isOpen);

  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!clientId || !clientSecret) return;
    onSubmit({
      client_id: clientId,
      client_secret: clientSecret,
    });
  };

  return (
    <div
      onClick={() => onClose(false)}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
      >
        <h3 className="text-xl font-semibold mb-5">Exchange Token</h3>

        {/* Client ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Client ID</label>
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập client_id"
          />
        </div>

        {/* Client Secret */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Client Secret
          </label>
          <input
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            type="password"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập client_secret"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Huỷ
          </button>
          <button
            disabled={!clientId || !clientSecret}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardExchangeToken;
