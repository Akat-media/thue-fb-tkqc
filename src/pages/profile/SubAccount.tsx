import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Select, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useUserStore } from '../../stores/useUserStore';
import { z } from 'zod';
import BaseHeader from '../../api/BaseHeader';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenV2, setIsModalOpenV2] = useState(false);
  const [pointValue, setPointValue] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [pointError, setPointError] = useState('');
  const [accountType, setAccountType] = useState<string | undefined>('MAIN');

  const pointSchema = z.object({
    point: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: t('profile.givePointModal.rule'),
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
      title: t('profile.form.username'),
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: t('profile.form.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('profile.form.points'),
      dataIndex: 'points',
      key: 'points',
      render: (_, { points }) => Number(points).toLocaleString('vi-VN'),
    },
    {
      title: t('profile.history.accountType'),
      key: 'account_type',
      dataIndex: 'account_type',
      render: (_, { account_type }) => {
        const color = account_type === 'MAIN' ? 'green' : 'geekblue';
        return (
          <Tag color={color} key={account_type}>
            {t(
              account_type === 'MAIN'
                ? 'profile.history.account.main'
                : 'profile.history.account.sub'
            )}
          </Tag>
        );
      },
    },
    {
      title: t('profile.menu.account'),
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
                {t('profile.button.givePoint')}
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
                {t('profile.button.changeType')}
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
        <h3 className="text-[20px] font-semibold">
          {t('profile.history.subAccount')}
        </h3>
      ) : (
        <h3 className="text-[20px] font-semibold">
          {t('profile.history.mainAccount')}
        </h3>
      )}
      <Table<DataType> columns={columns} dataSource={data} />
      <Modal
        centered
        title={t('profile.givePointModal.title')}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={t('profile.givePointModal.okText')}
        cancelText={t('profile.givePointModal.cancelText')}
      >
        <Form.Item
          validateStatus={pointError ? 'error' : ''}
          help={pointError || ''}
        >
          <Input
            className="py-2"
            type="number"
            placeholder={t('profile.givePointModal.placeholder')}
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
        title={t('profile.changeTypeAccount.title')}
        open={isModalOpenV2}
        onOk={handleOkVerify}
        onCancel={handleCancelVerify}
        okText={t('profile.changeTypeAccount.okText')}
        cancelText={t('profile.changeTypeAccount.cancelText')}
      >
        <p className="pb-4">{t('profile.changeTypeAccount.question')}</p>
        <Select
          size="large"
          style={{ width: '100%' }}
          placeholder={t('profile.changeTypeAccount.placeholder')}
          value={accountType}
          onChange={(value) => setAccountType(value)}
        >
          <Option value="MAIN">{t('profile.changeTypeAccount.main')}</Option>
          <Option value="SUB">{t('profile.changeTypeAccount.sub')}</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default SubAccount;
