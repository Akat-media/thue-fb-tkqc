import React, { useEffect, useState } from 'react';
import { Modal, Spin } from 'antd';
import { useSearchParams } from 'react-router-dom'; // nếu dùng react-router v6+
import axios from 'axios';
import { BaseUrlSocket } from '../../api/BaseHeader';

const Paypal = () => {
  const [searchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const handleCall = async () => {
    try {
      const token = searchParams.get('token');
      if (token) {
        await axios
          .post(`${BaseUrlSocket}/paypal/verify?token=${token}`)
          .then((res) => {
            setModalContent({
              title: 'Thanh toán thành công',
              content: 'Cảm ơn bạn đã thanh toán. Giao dịch đã được xử lý.',
            });
            setIsModalVisible(true);
            setLoading(false);
          })
          .catch((err) => {
            setModalContent({
              title: 'Thanh toán thất bại',
              content:
                'Đã xảy ra lỗi khi xác nhận giao dịch. Vui lòng thử lại.',
            });
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleCall();
  }, []);

  return (
    <div className="text-center mt-24">
      {loading ? <Spin size="large" /> : null}
      {isModalVisible && (
        <Modal
          cancelButtonProps={{ style: { display: 'none' } }}
          open={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
          okText="Đóng"
          centered
        >
          <h3 className="text-[24px] font-semibold">{modalContent.title}</h3>
          <p className="mt-2 text-gray-700 text-[18px]">
            {modalContent.content}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Paypal;
