import React from "react";

const Deposit = () => {
    return (
        <div className="bg-gradient-to-r from-green-100 to-green-200">
            <style>
                {`
                  @import url('https://fonts.googleapis.com/css2?family=Ancizar+Serif:ital,wght@0,300..900;1,300..900&family=Hubot+Sans:ital,wght@0,200..900;1,200..900&family=Mona+Sans:ital,wght@0,200..900;1,200..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Public+Sans:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
                  
                  .font-mona {
                    font-family: 'Mona Sans', sans-serif;
                  }
                `}
            </style>
            <div className="flex flex-row mx-[84px] mt-[64px] mb-[80px] bg-white">
                <div className="left flex flex-col p-[40px]">
                   <div className="px-[38px]">
                       <div className="font-mona text-[28px] font-semibold leading-[36.4px] mb-[16px]">Nhập số tiền</div>

                       <div className="flex flex-row justify-between items-center border border-gray-300 rounded-lg h-[76px] w-[576px]  px-5 py-6">
                           <span className="font-mona text-[36px] font-semibold">500.000</span>
                           <span className="font-mona text-[28px] font-medium leading-[36.4px] text-[#9497A0]">VNĐ</span>
                       </div>
                   </div>
                </div>

                <div className="right"></div>
            </div>
        </div>
    )
}

export default Deposit;
