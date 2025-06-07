import styled from "styled-components";
import img from "../../assets/bg-money-info-mb.png";
import avatar from "../../../public/avatar.jpg";
import { Dispatch, SetStateAction } from "react";
import { useUserStore } from "../../stores/useUserStore";
interface Props {
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
}
const Subheader = ({ active, setActive }: Props) => {
  const userobj = useUserStore((state) => state.user);
  return (
    <Container img={img}>
      <div className="bg-info mb-5 hidden w-full justify-between rounded-lg p-4 md:flex">
        <div className="flex">
          <a
            className=" relative flex min-w-[284px] flex-col justify-between "
            href="/account/profile"
          >
            <div className="flex w-full flex-row justify-between">
              <div className="flex w-full flex-row">
                <span
                  className="rounded-full ant-avatar ant-avatar-circle ant-avatar-icon shrink-1 !h-9 !w-9 !m-[5px] !h-[50px] !w-[50px] !text-[24px] css-1k979oh"
                  style={{ backgroundColor: "rgb(184, 184, 184)" }}
                >
                  <img className="rounded-full" src={avatar} alt="avatar" />
                </span>
                <div className="ml-3 flex flex-col justify-center py-[5px]">
                  <span className="text-white text-16 line-clamp-1 flex w-[190px] flex-col gap-y-2 text-ellipsis font-medium leading-6">
                    {userobj?.phone}
                    <div className="text-12 flex gap-2 font-medium leading-4">
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_11651_14382)">
                          <path
                            d="M0.5 8C0.5 3.86324 3.86324 0.5 8 0.5C12.1368 0.5 15.5 3.86324 15.5 8C15.5 12.1368 12.1368 15.5 8 15.5C3.86324 15.5 0.5 12.1368 0.5 8Z"
                            fill="white"
                            stroke="#74CF00"
                          />
                          <path
                            d="M10.3439 12.3361C10.1759 12.3361 10.0319 12.3121 9.88786 12.2401C9.02386 11.8561 7.34386 11.0161 5.85586 9.52808C4.36786 8.04008 3.50386 6.33607 3.11986 5.47207C2.92786 5.04007 3.02386 4.53607 3.38386 4.17607L4.29586 3.26407C4.41586 3.14407 4.55986 3.04807 4.72786 3.02407C4.96786 2.97607 5.20786 3.07207 5.37586 3.24007L6.55186 4.41607C6.86386 4.72807 6.86386 5.23208 6.55186 5.56808L5.61586 6.50408C5.51986 6.60008 5.49586 6.74407 5.54386 6.86407C5.71186 7.22407 6.09586 7.96808 6.74386 8.61608C7.39186 9.26408 8.13586 9.64808 8.49586 9.81608C8.61586 9.86408 8.75986 9.84007 8.85586 9.74407L9.81586 8.78407C9.93586 8.66407 10.0559 8.59208 10.2239 8.56808C10.4639 8.52008 10.7039 8.59207 10.8959 8.78407L12.1199 10.0081C12.4079 10.2961 12.4079 10.7761 12.1199 11.0641L11.1839 12.0001C10.9679 12.2161 10.6559 12.3361 10.3439 12.3361Z"
                            fill="#74CF00"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_11651_14382">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_10509_64063)">
                          <path
                            d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
                            fill="#F3F3F3"
                          />
                          <path
                            d="M3.6606 7.8268L11.3739 4.8528C11.7319 4.72347 12.0446 4.94014 11.9286 5.48147L11.9293 5.4808L10.6159 11.6681C10.5186 12.1068 10.2579 12.2135 9.89326 12.0068L7.89326 10.5328L6.9286 11.4621C6.82193 11.5688 6.73193 11.6588 6.52526 11.6588L6.66726 9.62347L10.3739 6.2748C10.5353 6.1328 10.3379 6.05281 10.1253 6.19414L5.5446 9.07814L3.56993 8.46214C3.14126 8.32614 3.13193 8.03347 3.6606 7.8268Z"
                            fill="#B8B8B8"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_10509_64063">
                            <rect width={16} height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-center">
                <svg
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.29006 15.8805L13.1701 12.0005L9.29006 8.12047C8.90006 7.73047 8.90006 7.10047 9.29006 6.71047C9.68006 6.32047 10.3101 6.32047 10.7001 6.71047L15.2901 11.3005C15.6801 11.6905 15.6801 12.3205 15.2901 12.7105L10.7001 17.3005C10.3101 17.6905 9.68006 17.6905 9.29006 17.3005C8.91006 16.9105 8.90006 16.2705 9.29006 15.8805Z"
                    fill="#ECFFF4"
                  />
                </svg>
              </div>
            </div>
          </a>
          <div
            className="mx-3 h-[60px] w-[1px]"
            style={{
              background:
                "linear-gradient(90deg, rgb(1, 171, 77) 0%, rgb(1, 171, 77) 42.52%, rgb(1, 171, 77) 100%)",
            }}
          />
          <div className="text-secondv2-green1 text-16 items-left justify-left flex min-w-[150px] flex-col gap-y-2 font-normal">
            <div className="flex flex-row gap-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 19 18"
                fill="none"
              >
                <path
                  d="M7 13V5C7 3.9 7.89 3 9 3H18V2C18 0.9 17.1 0 16 0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V15H9C7.89 15 7 14.1 7 13ZM10 5C9.45 5 9 5.45 9 6V12C9 12.55 9.45 13 10 13H19V5H10ZM13 10.5C12.17 10.5 11.5 9.83 11.5 9C11.5 8.17 12.17 7.5 13 7.5C13.83 7.5 14.5 8.17 14.5 9C14.5 9.83 13.83 10.5 13 10.5Z"
                  fill="#FFDA55"
                />
              </svg>
              <span className="text-[#FFDA55] text-18 font-medium leading-6">
                Số dư
              </span>
            </div>
            <strong className="text-[#FFDA55] text-16 text-left font-bold leading-6">
              {userobj?.points?.toLocaleString("vi-VN")} point
            </strong>
          </div>
        </div>
        <div className="flex gap-10 overflow-hidden">
          <a
            onClick={() => {
              setActive("money");
            }}
            className={`${
              active === "money" ? "bg-[#FFDA55] " : "bg-white "
            }text-pri-darkest text-14 border-right-border-pc 
            relative flex h-[60px] min-w-[108px] flex-col items-center rounded-lg
              py-1.5 font-bold leading-6`}
            href="#"
          >
            <svg
              className="h-6 w-6"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.7514 7.04997C17.5114 7.00997 17.2614 6.99998 17.0014 6.99998H7.00141C6.72141 6.99998 6.45141 7.01998 6.19141 7.05998C6.33141 6.77998 6.53141 6.52001 6.77141 6.28001L10.0214 3.02C11.3914 1.66 13.6114 1.66 14.9814 3.02L16.7314 4.78996C17.3714 5.41996 17.7114 6.21997 17.7514 7.04997Z"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 19C9 19.75 8.79 20.46 8.42 21.06C7.73 22.22 6.46 23 5 23C3.54 23 2.27 22.22 1.58 21.06C1.21 20.46 1 19.75 1 19C1 16.79 2.79 15 5 15C7.21 15 9 16.79 9 19Z"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.49172 18.9795H3.51172"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M5 17.5195V20.5095"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M22 12V17C22 20 20 22 17 22H7.63C7.94 21.74 8.21 21.42 8.42 21.06C8.79 20.46 9 19.75 9 19C9 16.79 7.21 15 5 15C3.8 15 2.73 15.53 2 16.36V12C2 9.28 3.64 7.38 6.19 7.06C6.45 7.02 6.72 7 7 7H17C17.26 7 17.51 7.00999 17.75 7.04999C20.33 7.34999 22 9.26 22 12Z"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 12.5H19C17.9 12.5 17 13.4 17 14.5C17 15.6 17.9 16.5 19 16.5H22"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
            Nạp tiền
          </a>
          <a
            onClick={() => {
              setActive("points");
            }}
            className={`${
              active === "points" ? "bg-[#FFDA55] " : "bg-white "
            }text-pri-darkest text-14 border-right-border-pc 
                      relative flex h-[60px] min-w-[108px] flex-col items-center rounded-lg
                        py-1.5 font-bold leading-6`}
            href="#"
          >
            <svg
              className="h-6 w-6"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.5 13.7502C9.5 14.7202 10.25 15.5002 11.17 15.5002H13.05C13.85 15.5002 14.5 14.8202 14.5 13.9702C14.5 13.0602 14.1 12.7302 13.51 12.5202L10.5 11.4702C9.91 11.2602 9.51001 10.9402 9.51001 10.0202C9.51001 9.18023 10.16 8.49023 10.96 8.49023H12.84C13.76 8.49023 14.51 9.27023 14.51 10.2402"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M12 7.5V16.5"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M17 3V7H21"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M22 2L18 6"
                stroke="#01AB4D"
                strokeWidth={2}
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
            Đổi điểm
          </a>
        </div>
      </div>
    </Container>
  );
};
const Container = styled.div<{
  img: string;
}>`
  .bg-info {
    background: url(${(props) => props.img}) 900.627px 0 / 14.458% 60% no-repeat,
      linear-gradient(180deg, #01ab4d, #017d38);
  }
`;
export default Subheader;
