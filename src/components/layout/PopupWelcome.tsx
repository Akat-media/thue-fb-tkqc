import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';

const PopupWelcome = () => {
  const navigate = useNavigate();
  // Chỉ hiển thị popup lần đầu tiên
  const [showModal, setShowModal] = useState(() => {
    const lastShown = localStorage.getItem("hasSeenWelcomeModal")
    console.log("lastShown", lastShown)
    if (!lastShown) return true

    const twoHoursInMs = 2 * 60 * 60 * 1000 // 2 giờ
    const timeDiff = Date.now() - Number.parseInt(lastShown)
    return timeDiff >= twoHoursInMs
  })

  const modalImageWidth = 800;
  const modalImageHeight = 600;
  const scrollPos = useRef(0)

  useEffect(() => {
    if (showModal) {
      scrollPos.current = window.pageYOffset
      document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        top: -${scrollPos.current}px;
        width: 100%;
      `
    } else {
      document.body.style.cssText = ""
      window.scrollTo(0, scrollPos.current)
    }
  }, [showModal])
  const handleCloseWelcomeModal = () => {
    setShowModal(false);
    localStorage.setItem('hasSeenWelcomeModal', Date.now().toString());
  };

  const handleRentNow = () => {
    handleCloseWelcomeModal()
    navigate("/price")
  }
  return (
   <>
   <style>{`
        @keyframes smoothFloat {
          0% {
            transform: translateX(-50%) translateY(0px);
          }
          50% {
            transform: translateX(-50%) translateY(-10px);
          }
          100% {
            transform: translateX(-50%) translateY(0px);
          }
        }
        
        @keyframes gentleGlow {
          0% {
            box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4), 0 0 0 0 rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 8px 25px rgba(30, 64, 175, 0.6), 0 0 0 8px rgba(59, 130, 246, 0.15);
          }
          100% {
            box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4), 0 0 0 0 rgba(59, 130, 246, 0.3);
          }
        }

        .rent-button {
          animation: smoothFloat 3s ease-in-out infinite, gentleGlow 4s ease-in-out infinite;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .rent-button:hover {
          animation: none;
          transform: translateX(-50%) translateY(-8px) scale(1.05) !important;
          background: linear-gradient(135deg, #1d4ed8, #2563eb) !important;
          box-shadow: 0 12px 30px rgba(30, 64, 175, 0.8) !important;
        }
      `}</style>
    <Modal
      open={showModal}
      onCancel={handleCloseWelcomeModal}
      footer={null}
      centered
      width={modalImageWidth}
      closable={false}
      styles={{
        content: {
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden',
        },
        body: {
          padding: 0,
          height: modalImageHeight,
        },
      }}
    >
      <div style={{ position: "relative", height: "100%" }}>
        <img
          src="https://akamedia.vn/assets/images/news-and-events/content/thue-tai-khoan-quang-cao-facebook%20(3).png"
          alt="Welcome"
          style={{
            width: "100%",
            height: modalImageHeight,
            objectFit: "cover",
            display: "block",
          }}
        />

        <Button
          type="primary"
          size="large"
          className="rent-button"
          onClick={handleRentNow}
          style={{
            position: "absolute",
            top: "86%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #1e40af, #3b82f6)",
            borderColor: "transparent",
            height: 60,
            fontSize: 18,
            fontWeight: 600,
            borderRadius: 50,
            minWidth: 183,
            boxShadow: "0 4px 15px rgba(30, 64, 175, 0.4)",
            zIndex: 10,
            color: "white",
            border: "2px solid white",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #1d4ed8, #2563eb)"
            e.currentTarget.style.transform = "translateX(-50%) translateY(-2px) scale(1.05)"
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 64, 175, 0.6)"
            e.currentTarget.style.border = "2px solid #f8fafc"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #1e40af, #3b82f6)"
            e.currentTarget.style.transform = "translateX(-50%) translateY(0) scale(1)"
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(30, 64, 175, 0.4)"
            e.currentTarget.style.border = "2px solid white"
          }}
        >
          THUÊ NGAY
        </Button>

        {/* Nút đóng */}
        <Button
          type="text"
          onClick={handleCloseWelcomeModal}
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          ✕
        </Button>
      </div>
    </Modal>
   </>
  );
};

export default PopupWelcome;
