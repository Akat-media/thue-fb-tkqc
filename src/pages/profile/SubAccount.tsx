import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useUserStore } from '../../stores/useUserStore';
import { z } from 'zod';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';
const { Option } = Select;

interface DataType {
  key: string;
  username: string;
  email: string;
  account_type: string;
  points: string;
}
const SubAccount = () => {
  const { user, fetchUser } = useUserStore();
  const [data, setData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenV2, setIsModalOpenV2] = useState(false);
  const [pointValue, setPointValue] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [pointError, setPointError] = useState('');
  const [accountType, setAccountType] = useState<string | undefined>('MAIN');

  const pointSchema = z.object({
    point: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Điểm phải là số dương',
    }),
  });
  const showModal = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };
  const showModalVerify = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpenV2(true);
  };
  const handleOk = async () => {
    const result = pointSchema.safeParse({ point: pointValue });

    if (!result.success) {
      const msg = result.error.issues[0].message;
      setPointError(msg);
      return;
    }
    console.log('Tặng điểm:', pointValue, 'cho:', selectedRecord);
    try {
      const res = await BaseHeader({
        method: 'post',
        url: '/give-points',
        data: {
          fromId: user?.id ?? '',
          toId: selectedRecord?.key ?? '',
          amount: pointValue ? Number(pointValue) : null,
        },
      });
      if (res.status === 200) {
        setIsModalOpen(false);
        setPointValue('');
        toast.success('Tặng điểm thành công');
        fetchUser();
      } else {
        setIsModalOpen(false);
        setPointValue('');
        toast.error('Tặng điểm thất bại');
        fetchUser();
      }
    } catch (error) {
      console.log(error);
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
      ) {
        setPointError((error as any).response.data.message);
      } else {
        setPointError('Đã xảy ra lỗi');
      }
    }
  };
  const handleOkVerify = async () => {
    try {
      const res = await BaseHeader({
        method: 'post',
        url: '/change-account-type',
        data: {
          fromId: user?.id ?? '',
          toId: selectedRecord?.key ?? '',
          type: accountType,
        },
      });
      if (res.status === 200) {
        setIsModalOpenV2(false);
        toast.success('Đổi loại tài khoản thành công');
        fetchUser();
      } else {
        setIsModalOpenV2(false);
        toast.error('Đổi loại tài khoản thất bại');
        fetchUser();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPointValue('');
    setPointError('');
  };
  const handleCancelVerify = () => {
    setIsModalOpenV2(false);
  };
  useEffect(() => {
    if (user?.account_type == 'MAIN') {
      setData(
        user.invitedUsers.map((item) => ({
          key: item?.id,
          username: item?.username,
          email: item?.email,
          account_type: item?.account_type,
          points: item?.points,
        }))
      );
    } else if (user?.account_type == 'SUB') {
      const invitedBy = user?.invitedBy;
      setData([
        {
          key: invitedBy?.id,
          username: invitedBy?.username,
          email: invitedBy?.email,
          account_type: invitedBy?.account_type,
          points: invitedBy?.points,
        },
      ]);
    }
  }, [user]);
  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      render: (_, { points }) => {
        console.log(points);
        return Number(points).toLocaleString('vi-VN');
      },
    },
    {
      title: 'Loại tài khoản',
      key: 'account_type',
      dataIndex: 'account_type',
      render: (_, { account_type }) => {
        const color = account_type == 'MAIN' ? 'green' : 'geekblue';
        return (
          <Tag color={color} key={account_type}>
            {account_type.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {user?.account_type == 'MAIN' && (
            <>
              <Button
                size="large"
                className="py-2"
                type="primary"
                onClick={() => showModal(record)}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Tặng điểm
              </Button>
              <Button
                size="large"
                onClick={() => showModalVerify(record)}
                className="py-2"
                type="default"
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  borderColor: '#1890ff',
                }}
              >
                Đổi loại tài khoản
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];
  return (
    <div>
      {user?.account_type == 'MAIN' ? (
        <h3 className="text-[20px] font-semibold">Sub Account</h3>
      ) : (
        <h3 className="text-[20px] font-semibold">Main Account</h3>
      )}
      <Table<DataType> columns={columns} dataSource={data} />
      <Modal
        centered
        title="Tặng điểm"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form.Item
          validateStatus={pointError ? 'error' : ''}
          help={pointError || ''}
        >
          <Input
            className="py-2"
            type="number"
            placeholder="Nhập số điểm"
            value={pointValue}
            onChange={(e) => {
              setPointValue(e.target.value);
              setPointError('');
            }}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') {
                e.preventDefault();
              }
            }}
            onWheel={(e) => e.currentTarget.blur()}
          />
        </Form.Item>
      </Modal>
      <Modal
        centered
        title="Xác nhận đổi tài khoản"
        open={isModalOpenV2}
        onOk={handleOkVerify}
        onCancel={handleCancelVerify}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p className="pb-4">Bạn có muốn đổi sang loại tài khoản nào?</p>
        <Select
          size="large"
          style={{ width: '100%' }}
          placeholder="Chọn loại tài khoản"
          value={accountType}
          onChange={(value) => setAccountType(value)}
        >
          <Option value="MAIN">Tài khoản chính (MAIN)</Option>
          <Option value="SUB">Tài khoản phụ (SUB)</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default SubAccount;
