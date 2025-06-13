import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import BaseHeader from "../../api/BaseHeader";
import Button from "../../components/ui/Button";

interface BudgetItem {
  id?: string;
  name: string;
  description: string[];
  amount: number;
  start_date: string;
  end_date: string;
  currency: string;
  percentage: number;
}

const PricingManagement: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [editing, setEditing] = useState<BudgetItem | null>(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await BaseHeader({ method: "get", url: "/budget" });
      const data = (res.data.data || []).map((item: any) => ({
        ...item,
        description: Array.isArray(item.description)
          ? item.description
          : typeof item.description === "string"
          ? [item.description]
          : [],
      }));
      setBudgets(data);
    } catch (err) {
      toast.error("Lỗi tải dữ liệu!");
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    if (!editing.name.trim()) {
      toast.warning("Tiêu đề không được để trống");
      return;
    }

    if (!editing.amount) {
      toast.warning("Giá tiền không được để trống");
      return;
    }

    if (!editing.description.length) {
      toast.warning("Phải có ít nhất một mô tả");
      return;
    }

    const payload = {
      ...editing,
      start_date: editing.start_date
        ? new Date(editing.start_date).toISOString()
        : "",
      end_date: editing.end_date
        ? new Date(editing.end_date).toISOString()
        : "",
      description: editing.description,
    };

    try {
      const method = editing.id ? "put" : "post";
      const url = editing.id ? `/budget/${editing.id}` : `/budget`;

      const res = await BaseHeader({
        method,
        url,
        data: payload,
      });

      if (res.data.success) {
        toast.success(
          editing.id ? "Cập nhật thành công!" : "Thêm mới thành công!"
        );
        setEditing(null);
        fetchBudgets();
      } else {
        toast.error(res.data.message || "Có lỗi xảy ra!");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Không thể lưu dữ liệu, vui lòng thử lại."
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xác nhận xoá?")) return;
    try {
      await BaseHeader({ method: "delete", url: `/budget/${id}` });
      toast.success("Đã xoá");
      fetchBudgets();
    } catch {
      toast.error("Lỗi khi xoá!");
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
              Quản lý bảng giá thuê
            </h2>
            <Button
              onClick={() =>
                setEditing({
                  name: "",
                  description: [""],
                  amount: 0,
                  start_date: "",
                  end_date: "",
                  currency: "VND",
                  percentage: 0,
                })
              }
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm bảng giá
            </Button>
          </div>

          {editing && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-lg text-blue-900 font-semibold mb-4">
                {editing.id ? "Chỉnh sửa gói giá" : "Thêm gói giá mới"}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên ngân sách"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={editing.amount}
                  onChange={(e) =>
                    setEditing({ ...editing, amount: Number(e.target.value) })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập số tiền ngân sách"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editing.description.join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      description: e.target.value.split("\n"),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mỗi dòng là một mô tả"
                />
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="date"
                    value={
                      editing.start_date ? editing.start_date.slice(0, 10) : ""
                    }
                    onChange={(e) =>
                      setEditing({ ...editing, start_date: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày kết thúc
                  </label>
                  <input
                    type="date"
                    value={
                      editing.end_date ? editing.end_date.slice(0, 10) : ""
                    }
                    min={new Date().toISOString().slice(0, 10)} // chỉ cho phép chọn ngày từ hôm nay trở đi
                    onChange={(e) =>
                      setEditing({ ...editing, end_date: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tiền tệ
                </label>
                <input
                  type="text"
                  value={editing.currency}
                  onChange={(e) =>
                    setEditing({ ...editing, currency: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VND"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phần trăm (%) chiết khấu thêm
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.percentage}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      percentage: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập phần trăm (%)"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" /> Lưu
                </Button>
              </div>
            </div>
          )}

          {budgets.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">Chưa có bảng giá nào</p>
              <Button
                onClick={() =>
                  setEditing({
                    name: "",
                    description: [""],
                    amount: 0,
                    start_date: "",
                    end_date: "",
                    currency: "VND",
                    percentage: 0,
                  })
                }
                className="flex items-center mx-auto"
              >
                <Plus className="w-4 h-4 mr-2" /> Thêm bảng giá đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((b, index) => (
                <div
                  key={b.id || index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-blue-50">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {b.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditing(b)}
                        className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => b.id && handleDelete(b.id)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Số tiền:{" "}
                      <span className="font-medium">
                        {b.amount} {b.currency}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Thời gian:{" "}
                      <span className="font-medium">
                        {b.start_date?.slice(0, 10)} -{" "}
                        {b.end_date?.slice(0, 10)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Phần trăm:{" "}
                      <span className="font-medium">{b.percentage}%</span>
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {b.description.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default PricingManagement;
