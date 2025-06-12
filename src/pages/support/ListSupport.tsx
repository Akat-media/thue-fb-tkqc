import React from "react";
import Layout from "../../components/layout/Layout.tsx";
// import SupportRequests from "./SupportRequests.tsx";
import SupportDashboard from "./SupportDashboard.tsx";

const ListSupport: React.FC = () => {
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="">
                    <SupportDashboard />
                </div>
            </div>
        </Layout>
    )
}

export default ListSupport;
