import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'antd';
import FieldForm from '../../../../components/form/FieldForm';
import dayjs from 'dayjs';

export interface VoucherFormValues {
  name: string;
  code: string;
  description: string;
  discount: number;
  type: 'fixed' | 'percentage';
  max_usage: number;
  expires_at: string;
}

interface VoucherFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: VoucherFormValues) => void;
  initialValues?: Partial<VoucherFormValues>;
  loading?: boolean;
}

const VoucherForm: React.FC<VoucherFormProps> = ({ visible, onClose, onSubmit, initialValues, loading }) => {
  const [form] = Form.useForm();
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  
  console.log('form111', form.getFieldValue('type'));
  
  useEffect(() => {
    if (visible) {
      form.resetFields();
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          expires_at: initialValues.expires_at ? dayjs(initialValues.expires_at) : null,
        });
        setDiscountType(initialValues.type || 'fixed');
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: any) => {
    console.log('values11111', values);
    const submitValues = {
      ...values,
      max_usage: Number(values.max_usage),
      discount: Number(values.discount), 
      expires_at: values.expires_at,
    };
    onSubmit(submitValues);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleTypeChange = (value: 'fixed' | 'percentage') => {
    setDiscountType(value);
    // Reset discount value when changing type
    form.setFieldValue('discount', '');
  };

  return (
    <Modal
      open={visible}
      title={initialValues?.name ? 'Sửa voucher' : 'Thêm voucher'}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'fixed',
          max_usage: 1,
          discount: 0,
        }}
      >
        <FieldForm
          type="input"
          name="name"
          label="Tên voucher"
          required
          placeholder="Nhập tên voucher"
        />
        
        <FieldForm
          type="input"
          name="code"
          label="Mã voucher"
          required
          placeholder="Nhập mã voucher"
        />
        
        <FieldForm
          type="textarea"
          name="description"
          label="Mô tả"
          placeholder="Nhập mô tả"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FieldForm
            type="input"
            inputType="number"
            name="discount"
            label="Giá trị giảm"
            required
            placeholder={discountType === 'fixed' ? 'Nhập giá trị (VND)' : 'Nhập phần trăm (%)'}
            min={1}
            max={discountType === 'percentage' ? 100 : undefined}
          />
          
          <FieldForm
            type="select"
            name="type"
            label="Loại giảm giá"
            required
            options={[
              { value: 'fixed', label: 'Giá trị VNĐ' },
              { value: 'percentage', label: 'Phần trăm' },
            ]}
            onChange={handleTypeChange}
          />
        </div>
        
        <FieldForm
          type="input"
          inputType="number"
          name="max_usage"
          label="Số lượt tối đa"
          required
          placeholder="Nhập số lượt tối đa"
          min={1}
        />
        
        <FieldForm
          type="date"
          name="expires_at"
          label="Ngày hết hạn"
          required
          format="YYYY-MM-DD"
          disabledDate={(current: any) => current && current < dayjs().startOf('day')}
        />
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button onClick={handleCancel}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.name ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default VoucherForm;
