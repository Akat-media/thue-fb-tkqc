import React from "react";
import AccountPage from "./AccountPage.tsx";

const ProfilePage: React.FC = () => {

    return (
        <div>
            {/*<Navbar />*/}

            <div className="max-w-[1200px] mx-auto">
                <AccountPage />
            </div>
        </div>
    )
}

export default ProfilePage
