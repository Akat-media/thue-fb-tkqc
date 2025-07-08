import { Table, TableProps, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../stores/useUserStore';
import BaseHeader from '../../api/BaseHeader';
interface DataType {
  key: string;
  fromUser: string;
  fromUserEmail: string;
  toUser: string;
  toUserEmail: string;
  account_type: string;
  amount: string;
}
const HistoryGivePoints = () => {
  const { user } = useUserStore();
  const [data, setData] = useState<any>([]);
  const hanleCallAPi = async () => {
    try {
      const res = await BaseHeader({
        method: 'get',
        url: `/give-points/${user?.id ?? ''}`,
      });
      if (res.status === 200) {
        const result = res.data.data.map((item: any) => ({
          ...item,
          key: item.id,
          fromUser: item.fromUser.username,
          fromUserEmail: item.fromUser.email,
          toUser: item.toUser.username,
          toUserEmail: item.toUser.email,
          account_type: item.toUser.account_type,
        }));
        console.log(result);
        setData(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    hanleCallAPi();
  }, [user]);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Username',
      dataIndex: 'fromUser',
      key: 'fromUser',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'fromUserEmail',
      key: 'fromUserEmail',
    },
    {
      title: 'Points',
      dataIndex: 'amount',
      key: 'amount',
      render: (_, { amount }) => {
        console.log(amount);
        return Number(amount).toLocaleString('vi-VN');
      },
    },
    {
      title: 'To User',
      dataIndex: 'toUser',
      key: 'toUser',
    },
    {
      title: 'To User Email',
      dataIndex: 'toUserEmail',
      key: 'toUserEmail',
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
  ];
  return (
    <div>
      {user?.account_type == 'MAIN' ? (
        <h3 className="text-[20px] font-semibold">Main Account</h3>
      ) : (
        <h3 className="text-[20px] font-semibold">Sub Account</h3>
      )}
      <Table<DataType> columns={columns} dataSource={data} />
    </div>
  );
};

export default HistoryGivePoints;
