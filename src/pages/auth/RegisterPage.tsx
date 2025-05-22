import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { register, isLoading } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name) {
      newErrors.name = 'Họ tên là bắt buộc';
    }

    if (!email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!phone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(name, email, phone, password);
      addNotification('Đăng ký thành công', 'Tài khoản của bạn đã được tạo!', 'success');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      addNotification('Đăng ký thất bại', 'Có lỗi xảy ra trong quá trình đăng ký', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản mới
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            đăng nhập nếu đã có tài khoản
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Đăng ký</CardTitle>
            <CardDescription>
              Tạo tài khoản mới để truy cập vào hệ thống
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div>
                <Input
                  id="name"
                  type="text"
                  label="Họ tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  icon={<User className="h-5 w-5 text-gray-400" />}
                  placeholder="Nguyễn Văn A"
                  error={errors.name}
                  fullWidth
                />
              </div>

              <div>
                <Input
                  id="email"
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="h-5 w-5 text-gray-400" />}
                  placeholder="name@example.com"
                  error={errors.email}
                  fullWidth
                />
              </div>

              <div>
                <Input
                  id="phone"
                  type="tel"
                  label="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                  placeholder="0901234567"
                  error={errors.phone}
                  fullWidth
                />
              </div>

              <div>
                <Input
                  id="password"
                  type="password"
                  label="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                  placeholder="••••••••"
                  error={errors.password}
                  fullWidth
                />
              </div>

              <div>
                <Input
                  id="confirmPassword"
                  type="password"
                  label="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  icon={<Lock className="h-5 w-5 text-gray-400" />}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  fullWidth
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  Tôi đồng ý với{' '}
                  <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                    Điều khoản sử dụng
                  </Link>{' '}
                  và{' '}
                  <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
              >
                Đăng ký
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;