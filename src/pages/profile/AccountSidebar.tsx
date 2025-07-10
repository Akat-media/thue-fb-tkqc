import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
import { toast } from "react-toastify";
import { BaseUrl } from "../../api/BaseHeader";
import BaseHeader from "../../api/BaseHeader";
import { useUserStore } from "../../stores/useUserStore";
import { useTranslation } from "react-i18next";

const AccountSidebar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("/avatar.jpg");
  const [isLoading, setIsLoading] = useState(false);
  const { setUser} = useUserStore();
  useEffect(() => {
    updateAvatarFromStorage();
  }, []);
  const { t } = useTranslation();
  const updateAvatarFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const userData = JSON.parse(userStr);
      const user = userData.user || userData;

      if (user && user.images) {
        setPreview(`${user.images}?t=${Date.now()}`);
      }
    } catch (error) {
      console.error("Error loading avatar:", error);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Không tìm thấy thông tin người dùng!");
      return;
    }

    const userData = JSON.parse(userStr);
    const user = userData.user || userData;
    const userId = user.id;

    if (!userId) {
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }

    const formData = new FormData();
    formData.append("username", user.username || "");
    formData.append("email", user.email || "");
    formData.append("phone", user.phone || "");
    formData.append("images", file);

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await BaseHeader({
        method: "put",
        url: `/user/${userId}`,
        baseURL: BaseUrl,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.data.success) {
        const updatedUser = response.data.data;

        const oldAccessToken = localStorage.getItem("access_token");
        const oldRefreshToken = localStorage.getItem("refresh_token");
        const userRaw = localStorage.getItem("user");
        const mergedUser = userRaw
          ? { ...JSON.parse(userRaw), user: updatedUser }
          : { user: updatedUser };

        localStorage.setItem("user", JSON.stringify(mergedUser));
        if (oldAccessToken)
          localStorage.setItem("access_token", oldAccessToken);
        if (oldRefreshToken)
          localStorage.setItem("refresh_token", oldRefreshToken);

        if (updatedUser.images) {
          setPreview(`${updatedUser.images}?t=${Date.now()}`);
        }
        setUser({ ...user, images: updatedUser.images });
        toast.success("Cập nhật ảnh đại diện thành công!");
      } else {
        toast.error(response.data.message || "Cập nhật ảnh thất bại!");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-xs">
        <div className="flex justify-center mb-10">
          <img
            src={preview}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow object-cover"
          />
        </div>
        <p className="text-sm text-center text-gray-500 mb-6">
          {t('profile.avatar.avatarHint1')} <br />
          {t('profile.avatar.avatarHint2')}
        </p>
        <button
          className={`w-full ${
            isLoading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-red-100 text-red-600 hover:bg-red-200'
          } font-semibold py-2 px-4 rounded-lg transition`}
          onClick={handleButtonClick}
          type="button"
          disabled={isLoading}
        >
          {isLoading ? t('profile.avatar.loading') : t('profile.avatar.changeAvatar')}
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default AccountSidebar;
