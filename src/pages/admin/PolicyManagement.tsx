import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import Button from "../../components/ui/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BaseHeader from "../../api/BaseHeader";

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

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await BaseHeader({
        method: "get",
        url: "policies",
      });
      setPolicies(response.data.data || []);
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Không thể tải chính sách. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPolicy = () => {
    setEditingPolicy({
      title: "Chính sách mới",
      message: "Nội dung mới",
    });
  };

  const handleEditPolicy = (policy: PolicySection) => {
    setEditingPolicy({ ...policy });
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chính sách này?")) return;

    try {
      const response = await BaseHeader({
        method: "delete",
        url: `policies/${policyId}`,
      });

      if (response.data.success) {
        toast.success("Xóa chính sách thành công");
        fetchPolicies();
      } else {
        toast.error(response.data.message || "Không thể xóa chính sách");
      }
    } catch (error: any) {
      console.error("Error deleting policy:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể xóa chính sách. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    }
  };

  const handleSavePolicy = async () => {
    if (!editingPolicy) return;
    if (!editingPolicy.title.trim()) {
      toast.warning("Tiêu đề không được để trống");
      return;
    }

    if (!editingPolicy.message.trim()) {
      toast.warning("Nội dung không được để trống");
      return;
    }

    try {
      let response;

      if (editingPolicy.id) {
        response = await BaseHeader({
          method: "put",
          url: `policies/${editingPolicy.id}`,
          data: editingPolicy,
        });

        if (response.data.success) {
          toast.success("Cập nhật chính sách thành công");
        } else {
          toast.error(response.data.message || "Không thể cập nhật chính sách");
        }
      } else {
        response = await BaseHeader({
          method: "post",
          url: "/policies",
          data: editingPolicy,
        });

        if (response.data.success) {
          toast.success("Thêm mới chính sách thành công");
        } else {
          toast.error(response.data.message || "Không thể thêm chính sách");
        }
      }

      setEditingPolicy(null);
      fetchPolicies();
    } catch (error: any) {
      console.error("Error saving policy:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể lưu chính sách. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    }
  };

  return (
    <Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
              {editingPolicy ? (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg text-blue-900 font-semibold mb-4">
                    {editingPolicy.id
                      ? "Chỉnh sửa chính sách"
                      : "Thêm chính sách mới"}
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
              ) : null}

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
                            onClick={() => handleEditPolicy(policy)}
                            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              policy.id && handleDeletePolicy(policy.id)
                            }
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {policy.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default PolicyManagement;
