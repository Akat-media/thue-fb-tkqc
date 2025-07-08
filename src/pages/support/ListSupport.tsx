import React from 'react';
// import SupportRequests from "./SupportRequests.tsx";
import SupportDashboard from './SupportDashboard.tsx';

const ListSupport: React.FC = () => {
  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="">
          <SupportDashboard />
        </div>
      </div>
    </>
  );
};

export default ListSupport;
