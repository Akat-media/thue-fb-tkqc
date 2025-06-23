import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import BaseHeader from '../../../../api/BaseHeader';
import { toast } from 'react-toastify';
import VoucherForm, { VoucherFormValues } from './VoucherForm';
import Layout from '../../../../components/layout/Layout';
import { Plus } from 'lucide-react';

const columnsBase = [
  { title: 'Tên', dataIndex: 'name', key: 'name' },
  { title: 'Mã', dataIndex: 'code', key: 'code' },
  { title: 'Mô tả', dataIndex: 'description', key: 'description' },
  { title: 'Giảm giá', dataIndex: 'discount', key: 'discount' },
  { title: 'Loại', dataIndex: 'type', key: 'type' },
  { title: 'Số lượng', dataIndex: 'max_usage', key: 'max_usage' },
  { title: 'HSD', dataIndex: 'expires_at', key: 'expires_at', render: (date: string) => new Date(date).toLocaleDateString() },
];
export interface Voucher {
  id: string;
  name: string;
  code: string;
  description: string;
  discount: number;
  type: 'fixed' | 'percentage';
  max_usage: number;
  expires_at: Date;   
}


const VoucherManager = () => {
  const [data, setData] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  console.log('data', data);
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await BaseHeader.get('/voucher');
      const formatData = res.data.map((item:Voucher) => {
        return {
          ...item,
          type: item.type === 'fixed' ? 'VNĐ' : '%',
        }
      })
      setData(formatData);
    } catch (err: any) {
      toast.error('Lỗi khi tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleAdd = () => {
    setEditingVoucher(null);
    setModalVisible(true);
  };

  const handleEdit = (voucher: any) => {
    setEditingVoucher({
      ...voucher,
      expires_at: voucher.expires_at?.slice(0, 10),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await BaseHeader.delete(`/voucher/${id}`);
      toast.success('Xóa voucher thành công');
      fetchVouchers();
    } catch (err: any) {
      toast.error('Lỗi khi xóa voucher');
    }
  };

  const handleModalSubmit = async (values: VoucherFormValues) => {
    setModalLoading(true);
    try {
      if (editingVoucher) {
        await BaseHeader.put(`/voucher/${editingVoucher.id}`, values);
        toast.success('Cập nhật voucher thành công');
      } else {
        await BaseHeader.post('/voucher', values);
        toast.success('Thêm voucher thành công');
      }
      setModalVisible(false);
      fetchVouchers();
    } catch (err: any) {
      toast.error('Lỗi khi lưu voucher');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <main className="w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-blue-900">Quản lý Voucher</h2>
          <Button type="primary" onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" /> Thêm voucher
          </Button>
        </div>
        <Table
          columns={[
            ...columnsBase,
            {
              title: 'Hành động',
              key: 'action',
              render: (_: any, record: any) => (
                <Space>
                  <Button type="link" onClick={() => handleEdit(record)}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Bạn chắc chắn muốn xóa voucher này?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button type="link" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
        <VoucherForm
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleModalSubmit}
          initialValues={editingVoucher || undefined}
          loading={modalLoading}
        />
      </main>
    </div>
  );
};

export default VoucherManager;
