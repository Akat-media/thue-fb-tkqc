import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button, Form, Modal } from 'antd';
import FieldForm from '../../../../components/form/FieldForm';
import dayjs, { Dayjs } from 'dayjs';
import useManagerBudget from './hook';

const PricingManagement: React.FC = () => {
  const [form] = Form.useForm();
  const { budgets, isOpenModal, setIsOpenModal, handleSave, handleDelete } =
    useManagerBudget({ form });
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <main className="w-full mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">
              Quản lý bảng giá thuê
            </h2>
            <Button
              onClick={() => {
                setIsOpenModal(true);
                form.resetFields();
              }}
              type="primary"
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm bảng giá
            </Button>
          </div>

          {budgets.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">Chưa có bảng giá nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget, index) => (
                <div
                  key={budget.id || index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white to-blue-50">
                    <h3 className="text-lg font-semibold text-blue-900">
                      {budget.name}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setIsOpenModal(true);
                          form.setFieldsValue({
                            ...budget,
                            start_date: budget.start_date
                              ? dayjs(budget.start_date)
                              : undefined,
                            end_date: budget.end_date
                              ? dayjs(budget.end_date)
                              : undefined,
                            description: Array.isArray(budget.description)
                              ? budget.description.join('\n')
                              : budget.description || '',
                          });
                        }}
                        className="p-1 text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => budget.id && handleDelete(budget.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Số tiền:{' '}
                      <span className="font-medium">
                        {budget.amount} {budget.currency}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Thời gian:{' '}
                      <span className="font-medium">
                        {budget.start_date.slice(0, 10)} /{' '}
                        {budget.end_date.slice(0, 10)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Phần trăm:{' '}
                      <span className="font-medium">{budget.percentage}%</span>
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {budget.description.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Modal
            open={isOpenModal}
            onCancel={() => {
              form.resetFields();
              setIsOpenModal(false);
            }}
            title={
              form.getFieldValue('id')
                ? 'Chỉnh sửa gói giá'
                : 'Thêm gói giá mới'
            }
            footer={null}
            destroyOnClose
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSave}
              initialValues={{ currency: 'VND' }}
            >
              <FieldForm
                type="input"
                name="name"
                label="Tiêu đề"
                required
                placeholder="Nhập tên ngân sách"
              />
              <FieldForm
                type="input"
                inputType="number"
                name="amount"
                label="Giá tiền"
                required
                placeholder="0"
              />
              <FieldForm
                type="textarea"
                name="description"
                label="Mô tả"
                required
                placeholder="Mỗi dòng là một mô tả"
              />
              <div className="grid grid-cols-2 gap-4">
                <FieldForm
                  type="date"
                  name="start_date"
                  label="Ngày bắt đầu"
                  required
                />
                <FieldForm
                  type="date"
                  name="end_date"
                  label="Ngày kết thúc"
                  required
                  disabledDate={(current: Dayjs | null) =>
                    current && current < dayjs().startOf('day')
                  }
                />
              </div>
              <FieldForm
                type="input"
                name="currency"
                label="Đơn vị tiền tệ"
                placeholder="VND"
                required
              />
              <FieldForm
                type="input"
                name="percentage"
                label="Phần trăm (%) chiết khấu thêm"
                placeholder="Nhập phần trăm (%)"
                inputType="number"
                min={0}
                max={100}
              />
              <FieldForm type="hidden" name="id" label={''} />
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  onClick={() => {
                    form.resetFields();
                    setIsOpenModal(false);
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </div>
            </Form>
          </Modal>
        </main>
      </div>
    </>
  );
};

export default PricingManagement;
