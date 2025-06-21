import React, { useEffect, useState } from 'react';
import BaseHeader from '../../../../api/BaseHeader';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

interface BudgetItem {
  id?: string;
  name: string;
  description: string[];
  amount: number;
  start_date: string;
  end_date: string;
  currency: string;
  percentage: number;
  subtitle: string;
  overview: string;
}
type UseManagerBudgetProps = {
  form: any;
};
const useManagerBudget = ({ form }: UseManagerBudgetProps) => {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  useEffect(() => {
    fetchBudgets();
  }, []);
  const fetchBudgets = async () => {
    try {
      const res = await BaseHeader({ method: 'get', url: '/budget' });
      const data = (res.data.data || []).map((item: any) => ({
        ...item,
        description: Array.isArray(item.description)
          ? item.description
          : typeof item.description === 'string'
          ? [item.description]
          : [],
      }));
      setBudgets(data);
    } catch {
      toast.error('Lỗi tải dữ liệu!');
    }
  };

  const handleSave = async (data: any) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
      percentage: Number(data.percentage),
      start_date: data.start_date
        ? dayjs(data.start_date).startOf('day').toDate().toISOString()
        : '',
      end_date: data.end_date
        ? dayjs(data.end_date).startOf('day').toDate().toISOString()
        : '',
      description:
        typeof data.description === 'string'
          ? data.description.split('\n')
          : data.description,
    };
    try {
      const method = data?.id ? 'put' : 'post';
      const url = data?.id ? `/budget/${data.id}` : `/budget`;
      const res = await BaseHeader({ method, url, data: payload });

      if (res.data.success) {
        toast.success(
          data?.id ? 'Cập nhật thành công!' : 'Thêm mới thành công!'
        );
        setIsOpenModal(false);
        form.resetFields();
        fetchBudgets();
      } else {
        toast.error(res.data.message || 'Có lỗi xảy ra!');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          'Không thể lưu dữ liệu, vui lòng thử lại.'
      );
    }
  };
  console.log('budgets111', budgets);
  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xoá?')) return;
    try {
      await BaseHeader({ method: 'delete', url: `/budget/${id}` });
      toast.success('Đã xoá');
      fetchBudgets();
    } catch {
      toast.error('Lỗi khi xoá!');
    }
  };

  return {
    budgets,
    isOpenModal,
    setIsOpenModal,
    setBudgets,
    handleSave,
    handleDelete,
  };
};
export default useManagerBudget;
