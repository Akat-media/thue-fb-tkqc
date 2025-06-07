const campaigns = [
  {
    title: "Uyên Vũ Công Sở 06/2025",
    ctr: "2.8%",
    ctrColor: "text-green-500",
    reach: "458K",
    cost: "105.5M ₫",
  },
  {
    title: "Ngọc Trương 05/2025",
    ctr: "3.2%",
    ctrColor: "text-green-500",
    reach: "356K",
    cost: "89.3M ₫",
  },
  {
    title: "AKA Ads QTTN",
    ctr: "2.5%",
    ctrColor: "text-green-500",
    reach: "289K",
    cost: "68.5M ₫",
  },
];

const TopCampaignsCard = () => {
  return (
    <div className="w-full bg-white rounded-xl shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-blue-900">TOP 3</h2>
        <a
          href="#"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Xem tất cả
        </a>
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

            <div className="mt-2 sm:mt-0 text-sm sm:text-right text-left">
              <p className={`${c.ctrColor} font-medium`}>{c.ctr} CTR</p>
              <p className="text-gray-600">{c.reach} tiếp cận</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCampaignsCard;
