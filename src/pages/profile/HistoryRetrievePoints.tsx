import { Table, TableProps, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import BaseHeader from '../../api/BaseHeader';
import { useTranslation } from 'react-i18next';

interface DataType {
  key: string;
  fromUser: string;
  fromUserEmail: string;
  toUser: string;
  toUserEmail: string;
  account_type: string;
  amount: string;
}

const HistoryRetrievePoints = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [data, setData] = useState<DataType[]>([]);

  const hanleCallAPi = async () => {
    try {
      const res = await BaseHeader({
        method: 'get',
        url: `/retrieve-points/${user?.id ?? ''}`,
      });
      if (res.status === 200) {
        const result = res.data.data.map((item: any) => ({
          ...item,
          key: item.id,
          fromUser: item.fromUser.username,
          fromUserEmail: item.fromUser.email,
          toUser: item.toUser.username,
          toUserEmail: item.toUser.email,
          account_type: item.fromUser.account_type,
        }));
        setData(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    hanleCallAPi();
  }, [user]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: t('profile.history.username'),
      dataIndex: 'fromUser',
      key: 'fromUser',
      render: (text) => <a>{text}</a>,
    },
    {
      title: t('profile.history.email'),
      dataIndex: 'fromUserEmail',
      key: 'fromUserEmail',
    },
    {
      title: t('profile.history.points'),
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => Number(amount).toLocaleString('vi-VN'),
    },
    {
      title: t('profile.history.toUser'),
      dataIndex: 'toUser',
      key: 'toUser',
    },
    {
      title: t('profile.history.toUserEmail'),
      dataIndex: 'toUserEmail',
      key: 'toUserEmail',
    },
    {
      title: t('profile.history.accountType'),
      key: 'account_type',
      dataIndex: 'account_type',
      render: (_, { account_type }) => {
        const isMain = account_type === 'MAIN';
        const color = isMain ? 'green' : 'geekblue';
        const label = isMain
          ? t('profile.history.account.main')
          : t('profile.history.account.sub');
        return <Tag color={color}>{label}</Tag>;
      },
    },
  ];

  return (
    <div>
      <h3 className="text-[20px] font-semibold">
        {user?.account_type === 'MAIN'
          ? t('profile.history.mainAccount')
          : t('profile.history.subAccount')}
      </h3>
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default HistoryRetrievePoints;
