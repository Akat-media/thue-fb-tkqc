import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Spin, Typography, Button } from 'antd';
import BaseHeader, { BaseUrl } from '../../api/BaseHeader';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const cancel = params.get('cancel'); 
  
  console.log('params',cancel)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        setStatus('error');
        setMessage('Không tìm thấy token xác thực.');
      }, 3000);
      return;
    }

    const verify = async () => {
      try {
        const start = Date.now();
        const res = await axios.post('/verify-email', { token , cancel }, { baseURL: BaseUrl });
        const delay = Math.max(3000 - (Date.now() - start), 0);
        setTimeout(() => {
          setStatus('success');
          setMessage(res.data.message || 'Xác thực thành công!');
        }, delay);
      } catch (err: any) {
        const delay = Math.max(3000 - (Date.now() - err.config?.startTime || 0), 0);
        setTimeout(() => {
          setStatus('error');
          setMessage(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
        }, delay);
      }
    };

    verify();
  }, [token]);

  const handleResendEmail = async () => {
    const email = params.get('email'); 
    setResending(true);
    if (!email || !email) {
      toast.error('Không tìm thấy thông tin người dùng.');
      setStatus('error');
      return;
    }
    try {
      const res = await axios.post('/resend-verification', { email: email }, { baseURL: BaseUrl });
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gửi lại thất bại');
    } finally {
      setResending(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
      {status === 'loading' ? (
        <Spin tip="Đang xác thực..." size="large" />
      ) : (
        <>
          <Title level={3} type={status === 'success' ? 'success' : 'danger'}>
            {status === 'success'
              ? 'Xác thực thành công!'
              : 'Xác thực thất bại'}
          </Title>
          <Text type={status === 'success' ? 'success' : 'danger'}>
            {message}
          </Text>
          {!cancel ? status === 'success' ? (
            <Link to="/login">
              <Button type="primary" className="mt-4">
                Đăng nhập
              </Button>
            </Link>
          ) : (
            <Button
              type="primary"
              className="mt-4"
              onClick={handleResendEmail}
              loading={resending}
            >
              Gửi lại email xác thực
            </Button>
          ) : <></>}
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
