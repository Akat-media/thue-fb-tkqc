import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AccountSidebar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("/avatar.jpg");

  useEffect(() => {
    const user = localStorage.getItem("user");
    const initialUser = user ? JSON.parse(user).user : {};
    if (initialUser.images && initialUser.images.length > 0) {
      setPreview(initialUser.images[0]);
    } else {
      setPreview("/avatar.jpg");
    }
  }, []);

  const user = localStorage.getItem("user");
  const initialUser = user ? JSON.parse(user).user : {};
  const userId = initialUser.id;

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId) {
      toast.error("Không tìm thấy ID người dùng!");
      return;
    }
    const formData = new FormData();
    formData.append("username", initialUser.username || "");
    formData.append("email", initialUser.email || "");
    formData.append("phone", initialUser.phone || "");
    formData.append("images", file);

    try {
      await axios.put(
        `https://api-rent.duynam.store/api/v1/user/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const res = await axios.get(
        `https://api-rent.duynam.store/api/v1/user/${userId}`
      );
      if (res.data && res.data.user) {
        localStorage.setItem("user", JSON.stringify({ user: res.data.user }));
        if (res.data.user.images && res.data.user.images.length > 0) {
          setPreview(res.data.user.images[0]);
        }
      }
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (err) {
      toast.error("Có lỗi khi cập nhật ảnh đại diện!");
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="bg-white rounded-xl p-6 shadow-md w-full max-w-xs">
        <div className="flex justify-center mb-10">
          <img
            src={preview}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow"
          />
        </div>
        <p className="text-sm text-center text-gray-500 mb-6">
          Cho phép ảnh *.jpeg, *.jpg, *.png, *.gif <br />
          Dung lượng tối đa 3 Mb
        </p>
        <button
          className="w-full bg-red-100 text-red-600 hover:bg-red-200 font-semibold py-2 px-4 rounded-lg transition"
          onClick={handleButtonClick}
          type="button"
        >
          Đổi ảnh đại diện
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default AccountSidebar;
