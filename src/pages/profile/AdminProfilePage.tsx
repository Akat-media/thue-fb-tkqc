import React from "react";
import Layout from "../../components/layout/Layout";
import AccountPage from "./AccountPage";

const AdminProfilePage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto">
        <AccountPage />
      </div>
    </Layout>
  );
};

export default AdminProfilePage;