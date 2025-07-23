import React, { useRef, useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import BaseHeader from '../../../api/BaseHeader.ts';
import { toast } from 'react-toastify';
import CashBackForm from "./CashBackForm.tsx";

const CashBackManagement: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  //load danh sach
  const fetchCsvFiles = async (retryCount = 0) => {
    try {
      const res = await BaseHeader({
        url: '/ad_rewards',
        method: 'get',
      });

      const files = res.data.data.data;
      console.log("files", files.length);

      if (files.length === 0 && retryCount < 2) {
        console.log(`Đang tải lại... lần ${retryCount + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return await fetchCsvFiles(retryCount + 1);
      }

      setData(files);
    } catch (err) {
      console.error('Lỗi lấy danh sách file:', err);
    }
  };

  //update file
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);

    try {
      await BaseHeader({
        url: '/ad_rewards',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchCsvFiles();

    } catch (error) {
      console.error('Lỗi upload:', error);
      toast.error('Tải lên thất bại!');
    } finally {
      setIsUploading(false);
    }

    event.target.value = '';
  };

  useEffect(() => {
    fetchCsvFiles();
  }, []);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:flex-row flex-col justify-between items-center mb-2">
        <h2 className="md:text-2xl text-xl font-semibold text-blue-900">
          Quản Lý Danh Sách Cashback
        </h2>
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full md:w-[150px] flex justify-center my-3 md:my-0 items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang tải...
              </>
          ) : (
              <>
                <Upload className="h-4 w-4" /> Upload CSV
              </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          hidden
        />
      </div>

      {isUploading && (
          <div className="flex items-center justify-center gap-2 py-4 bg-blue-50 rounded-lg mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Đang tải lên và cập nhật danh sách...</span>
          </div>
      )}

      <div>
        {data.length === 0 && !isUploading ? (
            <p className="text-gray-500 text-center py-8">
              Chưa có file nào được tải lên
            </p>
        ) : isUploading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-16"></div>
              ))}
            </div>
        ) : (
            <CashBackForm />
        )}
      </div>
    </div>
  );
};

export default CashBackManagement;
