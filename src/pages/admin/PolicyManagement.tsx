import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import BaseHeader from "../../api/BaseHeader";

interface PolicySection {
  id?: string;
  title: string;
  content: string[];
}

const PolicyManagement: React.FC = () => {
  const [policies, setPolicies] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState<PolicySection | null>(
    null
  );
  const [newContentItem, setNewContentItem] = useState("");

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
      content: ["Nội dung mới"],
    });
  };

  const handleEditPolicy = (policy: PolicySection) => {
    setEditingPolicy({ ...policy });
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chính sách này?")) return;

    try {
      await BaseHeader({
        method: "delete",
        url: `policies/${policyId}`,
      });
      toast.success("Xóa chính sách thành công");
      fetchPolicies();
    } catch (error) {
      console.error("Error deleting policy:", error);
      toast.error("Không thể xóa chính sách. Vui lòng thử lại sau.");
    }
  };

  const handleSavePolicy = async () => {
    if (!editingPolicy) return;

    try {
      if (editingPolicy.id) {
        await BaseHeader({
          method: "put",
          url: `policies/${editingPolicy.id}`,
          data: editingPolicy,
        });
        toast.success("Cập nhật chính sách thành công");
      } else {
        await BaseHeader({
          method: "post",
          url: "policies",
          data: editingPolicy,
        });
        toast.success("Thêm chính sách thành công");
      }
      setEditingPolicy(null);
      fetchPolicies();
    } catch (error) {
      console.error("Error saving policy:", error);
      toast.error("Không thể lưu chính sách. Vui lòng thử lại sau.");
    }
  };

  const handleAddContentItem = () => {
    if (!editingPolicy || !newContentItem.trim()) return;
    setEditingPolicy({
      ...editingPolicy,
      content: [...editingPolicy.content, newContentItem],
    });
    setNewContentItem("");
  };

  const handleRemoveContentItem = (index: number) => {
    if (!editingPolicy) return;
    const newContent = [...editingPolicy.content];
    newContent.splice(index, 1);
    setEditingPolicy({
      ...editingPolicy,
      content: newContent,
    });
  };

  return (
    <Layout>
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
            <div className="text-center py-10">Đang tải...</div>
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
                      Tiêu đề
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung
                    </label>
                    <ul className="space-y-2 mb-4">
                      {editingPolicy.content.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const newContent = [...editingPolicy.content];
                              newContent[idx] = e.target.value;
                              setEditingPolicy({
                                ...editingPolicy,
                                content: newContent,
                              });
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                          />
                          <button
                            onClick={() => handleRemoveContentItem(idx)}
                            className="ml-2 p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>

                    <div className="flex">
                      <input
                        type="text"
                        value={newContentItem}
                        onChange={(e) => setNewContentItem(e.target.value)}
                        placeholder="Thêm nội dung mới"
                        className="flex-1 p-2 border border-gray-300 rounded-l-md"
                      />
                      <button
                        onClick={handleAddContentItem}
                        className="bg-blue-500 text-white px-3 py-2 rounded-r-md hover:bg-blue-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
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

              <div className="space-y-4">
                {policies.map((policy, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-blue-50">
                      <h3 className="text-lg font-semibold text-blue-900">
                        {policy.title}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditPolicy(policy)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            policy.id && handleDeletePolicy(policy.id)
                          }
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        {policy.content.map((item, idx) => (
                          <li key={idx} className="text-sm">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default PolicyManagement;
