import { useMemo } from "react";
import { UserInfo } from "../HomePage";
import { Link } from "react-router-dom";

type DataChart = {
  data: UserInfo[]
}

const TopCampaignsCard: React.FC<DataChart> = ({ data }) => {
  const campaigns = useMemo(() => {
    return data?.length > 0 ? data.map((user) => {
      return {
        title: user.username,
        cost: `${user.totalAmount.toLocaleString()} ₫`,
      }
    }).slice(0,3) : []
  },[data])
  console.log("campaigns",campaigns)
  return (
    <div className="w-full bg-white rounded-xl ">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-900">TOP 3</h2>
        <Link
          to ="/adsaccountmanager"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="space-y-3">
        {campaigns.map((c, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg px-4 py-3"
          >
            <div>
              <p className="font-semibold text-purple-600">{c.title}</p>
              <p className="text-sm text-gray-500">{c.cost}</p>
            </div>

            {/* <div className="mt-2 sm:mt-0 text-sm sm:text-right text-left">
              <p className={`${c.ctrColor} font-medium`}>{c.ctr} CTR</p>
              <p className="text-gray-600">{c.reach} tiếp cận</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCampaignsCard;
