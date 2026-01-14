import { InboxOutlined } from '@ant-design/icons';

const EmptyState = ({
  title = 'Không có dữ liệu',
  description = 'Hiện tại chưa có dữ liệu để hiển thị',
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="mb-4 flex h-16 w-16 text-[20px] items-center justify-center rounded-full bg-gray-100">
        <InboxOutlined className="text-3xl text-gray-400" />
      </div>

      <h3 className="text-base font-semibold text-gray-700">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
