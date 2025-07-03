import { Menu, Dropdown, Divider } from 'antd';

const DropdownCustom = () => {
  const menu = (
    <Menu>
      <Menu.Item>Đóng</Menu.Item>
      <Menu.Item>Đóng</Menu.Item>
      {/* <Divider /> */}
      <Menu.Item>Xem kết quả</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a onClick={(e) => e.preventDefault()}>Chọn loại tài khoản</a>
    </Dropdown>
  );
};

export default DropdownCustom;
