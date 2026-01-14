import { Spin } from 'antd';

const LoadingOverlay = ({ loading, children }: any) => {
  return (
    <div className="relative">
      {children}

      {loading && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center
                     bg-black/40 backdrop-blur-sm"
        >
          <Spin tip="Loading..." size="large" />
        </div>
      )}
    </div>
  );
};

export default LoadingOverlay;
