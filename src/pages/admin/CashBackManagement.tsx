import React, { useRef, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Upload } from 'lucide-react';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';

const CashBackManagement: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [csvFiles, setCsvFiles] = useState<
    { name: string; size: number; date: Date }[]
  >([]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  //load danh sach
  const fetchCsvFiles = async () => {
    try {
      const res = await BaseHeader({
        url: '/hehe',
        method: 'get',
      });

      const files = res.data;
      setCsvFiles(
        files.map((f: any) => ({
          name: f.name,
          size: f.size,
          date: new Date(f.date),
        }))
      );
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

    try {
      await BaseHeader({
        url: '/hehe',
        method: 'post',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Tải lên thành công!');
      await fetchCsvFiles();
    } catch (error) {
      console.error('Lỗi upload:', error);
      toast.error('Tải lên thất bại!');
    }

    event.target.value = '';
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  //xoa file
  const handleDelete = async (indexToRemove: number) => {
    const fileToDelete = csvFiles[indexToRemove];

    if (!window.confirm(`Xác nhận xoá file: ${fileToDelete.name}?`)) return;

    try {
      await BaseHeader({
        url: `/xóađikýức/${encodeURIComponent(fileToDelete.name)}`,
        method: 'delete',
      });

      toast.success('Xoá file thành công!');
      await fetchCsvFiles();
    } catch (err) {
      console.error('Lỗi khi xóa file:', err);
      toast.error('Xoá file thất bại!');
    }
  };

  useEffect(() => {
    fetchCsvFiles();
  }, []);

  return (
    <div className="w-full h-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">
          Quản Lý Danh Sách Cashback
        </h2>
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" /> Upload CSV
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          hidden
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {csvFiles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Chưa có file nào được tải lên
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                  Tên File
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                  Thời Gian Upload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase">
                  Kích thước File
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {csvFiles.map((file, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {file.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(file.date, 'dd/MM/yyyy HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatSize(file.size)}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CashBackManagement;
