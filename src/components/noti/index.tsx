import { Check, X } from "lucide-react";
interface Props {
  onClose?: () => void;
  label?: string;
  message?: string;
  btnLabel?: string;
}

export const NotiSuccess = ({
  onClose,
  label = "Thành công",
  message,
  btnLabel = "Đóng",
}: Props) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm w-full">
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{label}</h3>
          <p className="text-gray-600 text-sm mb-4">{message}</p>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {btnLabel}
          </button>
        </>
      </div>
    </div>
  );
};
interface PropsError {
  onClose?: () => void;
  label?: string;
  message?: string;
  btnLabel?: string;
}

export const NotiError = ({
  onClose,
  label = "Thất bại",
  message,
  btnLabel = "Đóng",
}: PropsError) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{label}</h3>
        <p className="text-gray-600 text-sm mb-4">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {btnLabel}
        </button>
      </>
    </div>
  );
};
