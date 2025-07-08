import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BaseHeader from '../../api/BaseHeader';

interface PolicySection {
  id?: string;
  title: string;
  message: string;
}

const PolicyManagement: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState<PolicySection | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<PolicySection | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await BaseHeader({
        method: 'get',
        url: 'policies',
      });
      setPolicies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('Không thể tải chính sách. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPolicy = () => {
    setEditingPolicy({
      title: 'Chính sách mới',
      message: 'Nội dung mới',
    });
    setEditingIndex(-1);
  };

  const handleEditPolicy = (policy: PolicySection, index: number) => {
    setEditingPolicy({ ...policy });
    setEditingIndex(index);
  };

  const handleDeletePolicy = async (policyId: string) => {
    try {
      const response = await BaseHeader({
        method: 'delete',
        url: `policies/${policyId}`,
      });

      if (response.data.success) {
        toast.success('Xóa chính sách thành công');
        fetchPolicies();
      } else {
        toast.error(response.data.message || 'Không thể xóa chính sách');
      }
    } catch (error: any) {
      console.error('Error deleting policy:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Không thể xóa chính sách. Vui lòng thử lại sau.';
      toast.error(errorMessage);
    }
  };

  const handleSavePolicy = async () => {
    if (!editingPolicy) return;
    if (!editingPolicy.title.trim()) {
      toast.warning('Tiêu đề không được để trống');
      return;
    }

    if (!editingPolicy.message.trim()) {
      toast.warning('Nội dung không được để trống');
      return;
    }

    try {
      let response;

      if (editingPolicy.id) {
        response = await BaseHeader({
          method: 'put',
          url: `policies/${editingPolicy.id}`,
          data: editingPolicy,
        });

        if (response.data.success) {
          toast.success('Cập nhật chính sách thành công');
        } else {
          toast.error(response.data.message || 'Không thể cập nhật chính sách');
        }
      } else {
        response = await BaseHeader({
          method: 'post',
          url: '/policies',
          data: editingPolicy,
        });

        if (response.data.success) {
          toast.success('Thêm mới chính sách thành công');
        } else {
          toast.error(response.data.message || 'Không thể thêm chính sách');
        }
      }

      setEditingPolicy(null);
      fetchPolicies();
    } catch (error: any) {
      console.error('Error saving policy:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Không thể lưu chính sách. Vui lòng thử lại sau.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <main className="w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">
              Quản lý Chính sách và Điều khoản
            </h2>
            <Button onClick={handleAddPolicy} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" /> Thêm chính sách
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <>
              {/* {editingPolicy ? (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg text-blue-900 font-semibold mb-4">
                    {editingPolicy.id
                      ? 'Chỉnh sửa chính sách'
                      : 'Thêm chính sách mới'}
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingPolicy.title}
                      onChange={(e) =>
                        setEditingPolicy({
                          ...editingPolicy,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tiêu đề chính sách"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={editingPolicy.message}
                      onChange={(e) =>
                        setEditingPolicy({
                          ...editingPolicy,
                          message: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md min-h-[200px] focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập nội dung chính sách"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingPolicy(null)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleSavePolicy}>
                      <Save className="w-4 h-4 mr-2" /> Lưu
                    </Button>
                  </div>
                </div>
              ) : null} */}

              {policies.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <p className="text-gray-500 mb-4">Chưa có chính sách nào</p>
                  <Button
                    onClick={handleAddPolicy}
                    className="flex items-center mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Thêm chính sách đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy, index) => (
                    <div
                      key={policy.id || index}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-blue-50">
                        <h3 className="text-lg font-semibold text-blue-900">
                          {policy.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPolicy(policy, index)}
                            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setPolicyToDelete(policy);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        {editingIndex === index && editingPolicy ? (
                          <>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={editingPolicy.title}
                                onChange={(e) =>
                                  setEditingPolicy({
                                    ...editingPolicy,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập tiêu đề chính sách"
                              />
                            </div>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nội dung <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                value={editingPolicy.message}
                                onChange={(e) =>
                                  setEditingPolicy({
                                    ...editingPolicy,
                                    message: e.target.value,
                                  })
                                }
                                className="w-full p-2 border border-gray-300 rounded-md min-h-[200px] focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nhập nội dung chính sách"
                              />
                            </div>

                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingPolicy(null)}
                              >
                                Hủy
                              </Button>
                              <Button onClick={handleSavePolicy}>
                                <Save className="w-4 h-4 mr-2" /> Lưu
                              </Button>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {policy.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      {showDeleteModal && policyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-2 text-red-600">
              Xác nhận xóa
            </h4>
            <p className="mb-4">
              Bạn có chắc chắn muốn xóa <b>{policyToDelete.title}</b>?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setPolicyToDelete(null);
                }}
              >
                Hủy
              </Button>
              <Button
                variant="danger"
                onClick={async () => {
                  if (policyToDelete?.id) {
                    await handleDeletePolicy(policyToDelete.id);
                  }
                  setShowDeleteModal(false);
                  setPolicyToDelete(null);
                }}
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PolicyManagement;
