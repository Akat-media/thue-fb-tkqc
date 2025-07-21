import React, {useEffect, useMemo, useState} from "react";
import debounce from "lodash.debounce";
import {Calendar, CircleUserRound, Contact, DollarSign, Gift, Pencil, TicketPercent} from "lucide-react";
import BaseHeader, {BaseUrl} from "../../../api/BaseHeader.ts";
import usePagination from "../../../hook/usePagination.tsx";
import Pagination from "../account/Pagination.tsx";
import {usePageStore} from "../../../stores/usePageStore.ts";

const CashBackForm = () => {
    const [query, setQuery] = useState('');
    const [data, setData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedReward, setEditedReward] = useState<number>(0);

    const { currentPage, pageSize, setCurrentPage } = usePagination(1, 10);
    const totalPages = Math.ceil(totalItems / pageSize);
    const { formatDateToVN } = usePageStore();

    const fetchData = async (searchQuery = '') => {
        try {
            const params = {
                page: currentPage,
                pageSize: pageSize,
                ...(searchQuery && { search: searchQuery.trim() }),
            };

            const response = await BaseHeader({
                method: 'get',
                url: '/ad_rewards',
                baseURL: BaseUrl,
                params,
            });
            console.log("response: ",response.data?.data)
            setData(response.data?.data?.data || []);
            setTotalItems(response.data?.data?.pagination.totalRecords || 0);
        } catch (err: any) {
            console.error('Error fetching data:', err.message || err);
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleUpdateReward = async (id: string) => {
        try {
            await BaseHeader({
                method: 'put',
                url: `/ad_rewards/${id}`,
                baseURL: BaseUrl,
                data: {
                    rewards_earned: editedReward,
                },
            });

            setEditingId(null);
            fetchData();
        } catch (err) {
            console.error('Lỗi khi cập nhật reward:', err);
        }
    };

    const handleSyncLark = async () => {
        try {
            await BaseHeader({
                method: 'post',
                url: `/asyc_ad_rewards`,
                baseURL: BaseUrl,

            });
            fetchData();
        } catch (err) {
            console.error('Lỗi khi sync:', err);
        }
    }


    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);


    const debounceSearch = useMemo(() => {
        return debounce((value: string) => {
            fetchData(value);
        }, 800);
    }, []);
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setCurrentPage(1);
        debounceSearch(e.target.value);
    }

    useEffect(() => {
        return () => {
            debounceSearch.cancel();
        };
    }, [debounceSearch]);

    return (
        <div className="flex flex-col">
            {/*header*/}
            <div className="flex md:flex-row flex-col justify-between py-3">
                <div>
                    <input
                        type="text"
                        className="px-2 py-2 md:w-[350px] w-full border border-gray-300 rounded-lg"
                        placeholder="Tìm kiếm theo số tiền"
                        value={query}
                        onChange={handleSearch}

                    />
                </div>
                <div className="my-3 md:my-0 ">
                    <button
                        className="w-full px-4 py-2 border rounded-lg text-white font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        onClick={handleSyncLark}
                    >
                        Đồng bộ về lark
                    </button>
                </div>
            </div>

            <div className="sm:rounded-lg sm:border sm:border-gray-300 my-4">
                {/*form desktop*/}
                <div className="hidden sm:block max-h-[900px] overflow-y-auto">
                    <table className="w-full table-auto border border-gray-300 border-collapse bg-white text-sm text-gray-800">
                        <thead className="bg-[#f5f5ff] text-sm text-center font-semibold uppercase text-[#2b3245] sticky top-0 z-10 whitespace-nowrap">
                        <tr>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    ID tài khoản quảng cáo
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Tên tài khoản quảng cáo
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[200px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Số tiền đã chi tiêu tối thiểu để đủ điều kiện
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[200px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Số tiền đã chi tiêu đủ điều kiện
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Phần thưởng đã đạt được
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Sản phẩm đáng chú ý
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Khuyến mãi
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Thời gian bắt đầu
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Thời gian kết thúc
                                </div>
                            </th>
                            <th className="px-4 py-3 border border-gray-200 min-w-[150px]">
                                <div className="flex items-center justify-center gap-2">
                                    <Contact className="w-4 h-4 text-gray-500" />
                                    Ngày thanh toán
                                </div>
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {data.map((item: any) => {
                            return (
                                <tr key={item.id}>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {item.ad_account_id}
                                    </td>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {item.ad_account_name}
                                    </td>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {item.minimum_amount_spent}
                                    </td>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {item.qualifying_amount_spent}
                                    </td>

                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {editingId === item.id ? (
                                            <div className="flex items-center gap-2 justify-center">
                                                <input
                                                    type="text"
                                                    className="border px-2 py-1 rounded w-24 text-sm"
                                                    value={editedReward}
                                                    onChange={(e) => setEditedReward(Number(e.target.value))}
                                                />
                                                <button
                                                    className="text-green-600 font-semibold text-sm"
                                                    onClick={() => handleUpdateReward(item.id)}
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    className="text-gray-400 text-sm"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Hủy
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <span>{item.rewards_earned}</span>
                                                <button
                                                    className="text-blue-600 hover:text-blue-800"
                                                    onClick={() => {
                                                        setEditingId(item.id);
                                                        setEditedReward(item.rewards_earned || '');
                                                    }}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {item.featured_product}
                                    </td>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {item.promotion}
                                    </td>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {formatDateToVN(item.created_at)}
                                    </td>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        {formatDateToVN(item.updated_at)}
                                    </td>
                                    <td className="text-center px-2 py-2 border border-gray-100">
                                        { item.date_of_deposit ? formatDateToVN(item.date_of_deposit) : "Chưa thanh toán"}
                                    </td>

                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/*form mobile */}
                <div className="sm:hidden block space-y-4">
                    {data.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Không có dữ liệu
                        </div>
                    ) : (
                        data.map((item: any) => (
                            <div key={item.id} className="rounded-xl border border-gray-200 py-4 px-4 bg-white shadow-sm">
                                {/* Header */}
                                <div className="flex items-center mb-4">
                                    <div className="border rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 flex justify-center items-center">
                                        <CircleUserRound className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="px-3">
                                        <div className="font-semibold text-lg text-gray-800 max-w-48">
                                            {item.ad_account_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            ID: {item.ad_account_id}
                                        </div>
                                    </div>
                                </div>

                                {/* Main content */}
                                <div className="space-y-3">
                                    {/* Minimum Amount */}
                                    <div className="flex flex-row items-center border-0 bg-gray-50/70 rounded-xl h-12 px-4">
                                        <div className="w-8 h-8 bg-orange-400 rounded-lg flex justify-center items-center">
                                            <DollarSign className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="px-3 flex-1">
                                            <div className="text-xs text-gray-500">Số tiền tối thiểu</div>
                                            <div className="text-sm font-medium">{item.minimum_amount_spent}</div>
                                        </div>
                                    </div>

                                    {/* Qualifying Amount */}
                                    <div className="flex flex-row items-center border-0 bg-gray-50/70 rounded-xl h-12 px-4">
                                        <div className="w-8 h-8 bg-green-400 rounded-lg flex justify-center items-center">
                                            <DollarSign className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="px-3 flex-1">
                                            <div className="text-xs text-gray-500">Số tiền đủ điều kiện</div>
                                            <div className="text-sm font-medium">{item.qualifying_amount_spent}</div>
                                        </div>
                                    </div>

                                    {/* Rewards Earned */}
                                    <div className="flex flex-row items-center border-0 bg-gray-50/70 rounded-xl px-4 py-3">
                                        <div className="w-8 h-8 bg-yellow-400 rounded-lg flex justify-center items-center">
                                            <Gift className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="px-3 flex-1">
                                            <div className="text-xs text-gray-500">Phần thưởng đã đạt được</div>
                                            {editingId === item.id ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <input
                                                        type="text"
                                                        className="border px-2 py-1 rounded w-20 text-sm"
                                                        value={editedReward}
                                                        onChange={(e) => setEditedReward(Number(e.target.value))}
                                                    />
                                                    <button
                                                        className="text-green-600 font-semibold text-xs px-2 py-1 bg-green-50 rounded"
                                                        onClick={() => handleUpdateReward(item.id)}
                                                    >
                                                        Lưu
                                                    </button>
                                                    <button
                                                        className="text-gray-400 text-xs px-2 py-1 bg-gray-50 rounded"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-medium">{item.rewards_earned}</span>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 p-1"
                                                        onClick={() => {
                                                            setEditingId(item.id);
                                                            setEditedReward(item.rewards_earned || '');
                                                        }}
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Featured Product */}
                                    {item.featured_product && (
                                        <div className="flex flex-row items-center border-0 bg-gray-50/70 rounded-xl h-12 px-4">
                                            <div className="w-8 h-8 bg-purple-400 rounded-lg flex justify-center items-center">
                                                <TicketPercent className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="px-3 flex-1">
                                                <div className="text-xs text-gray-500">Sản phẩm đáng chú ý</div>
                                                <div className="text-sm font-medium">{item.featured_product}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Promotion */}
                                    {item.promotion && (
                                        <div className="flex flex-row items-center border-0 bg-gray-50/70 rounded-xl h-12 px-4">
                                            <div className="w-8 h-8 bg-red-400 rounded-lg flex justify-center items-center">
                                                <Gift className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="px-3 flex-1">
                                                <div className="text-xs text-gray-500">Khuyến mãi</div>
                                                <div className="text-sm font-medium">{item.promotion}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className="grid grid-cols-1 gap-2 pt-2">
                                        {item.created_at && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>Bắt đầu: {formatDateToVN(item.created_at)}</span>
                                            </div>
                                        )}
                                        {item.updated_at && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>Kết thúc: {formatDateToVN(item.updated_at)}</span>
                                            </div>
                                        )}
                                        {(
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3" />
                                                <span>Thanh toán: { item.date_of_deposit ? formatDateToVN(item.date_of_deposit) : "Chưa thanh toán"}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 px-4 pb-4 space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-sm text-gray-600">
                            Hiển thị {(currentPage - 1) * pageSize + 1} -{' '}
                            {(currentPage - 1) * pageSize + data.length} của {totalItems} mục
                        </div>

                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

        </div>
    )
}

export default CashBackForm;
