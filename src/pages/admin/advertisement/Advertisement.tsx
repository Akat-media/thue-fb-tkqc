import './style.css';
import {useState} from "react";
import {
    RefreshCw,
    MoreHorizontal,
    Search,
    Folder,
    SendHorizontal,
    MailOpen,
    Plus,
    SlidersHorizontal,
    FolderUp,
    LayoutDashboard,
    PanelTop
} from 'lucide-react';

const Advertisement = () => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSearch, setSelectedSearch] = useState(false);

    const [count, setCount] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState({
        active: false,
        displayOnSearchBar: false,
        name: '',
    });

    const handleSelectedFilter = (name: any) => {
        if (selectedFilter.name === name) {
            setCount(0);
            setSelectedFilter({
                active: true,
                displayOnSearchBar: true,
                name: 'one',
            });
        } else {
            setSelectedFilter({
                active: true,
                displayOnSearchBar: true,
                name: name,
            });
            setCount(count + 1);
        }
        if (name === 'one') {
            setCount(0);
        }

    }

    return (
        <div className="page-fix">
            <div className="section-1 flex-col sm:flex-row">
                <div className="inner-left">
                    <div className="inner-text-1">Chiến dịch</div>

                    <div className="relative w-[220px] sm:w-[286px]">
                        <select
                            className="w-full h-[46px] text-sm border border-gray-300 rounded-lg pr-10 pl-3 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white truncate overflow-hidden whitespace-nowrap"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Akamedia Nhat Dam 1</option>
                            <option value="pending">Chiến dịch 2</option>
                            <option value="in-progress">Chiến dịch 3</option>
                            <option value="resolved">Chiến dịch 4</option>
                        </select>

                        {/* Icon mũi tên xuống */}
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>

                </div>


                <div className="inner-right">
                    <div className="inner-text-2">Thời gian cập nhật: vừa xong</div>
                    <div className="button hover:bg-gray-200" onClick={() => window.location.reload()}>
                        <RefreshCw className="w-5 h-5 cursor-pointer" />

                    </div>
                    <div className="button hover:bg-gray-200">
                        <MoreHorizontal  className="w-5 h-5 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Section 2: Bộ lọc và chế độ xem */}
            <div className="section-2">
                <div className="section-3 flex flex-col sm:flex-row ">
                    <div className="sm:inner-left">
                        {/* Các nút menu trái */}
                        <div
                            className="button button-circle active hover:bg-gray-200 mr-3 mb-2 sm:mb-0"
                            onClick={ () => setSelectedSearch(!selectedSearch) }
                        >
                            <div className="inner-icon">
                                <Search className="w-5 h-5 cursor-pointer" />
                            </div>
                            {/*<div className="inner-badge">{count}</div>*/}
                        </div>
                        <div
                            className={`button button-round hover:bg-gray-200 mr-2 mb-2 sm:mb-0 bg-white
                                ${selectedFilter.name === 'one' ? 'active' : ''} 
                            `}
                            onClick={() => handleSelectedFilter('one')}
                        >
                            <Folder className="w-5 h-5 cursor-pointer"/>
                            <div className="inner-text">Tất cả quảng cáo</div>
                        </div>
                        <div
                            className={`button button-round hover:bg-gray-200 mr-2 mb-2 sm:mb-0 bg-white
                                ${selectedFilter.name === 'two' ? 'active' : ''} 
                            `}
                            onClick={() => handleSelectedFilter('two')}
                        >
                            <SendHorizontal className="w-5 h-5 cursor-pointer"/>
                            <div className="inner-text">Quảng cáo đang hoạt động</div>
                        </div>
                        <div
                            className={`button button-round hover:bg-gray-200 mr-2 mb-2 sm:mb-0 bg-white
                                ${selectedFilter.name === 'three' ? 'active' : ''} 
                            `}
                            onClick={() => handleSelectedFilter('three')}
                        >
                            <MailOpen className="w-5 h-5 cursor-pointer"/>
                            <div className="inner-text">Có phân phối</div>
                        </div>
                        <div className="button button-none hover:bg-gray-200">
                            <Plus className="w-5 h-5 cursor-pointer"/>
                            <div className="inner-text">Xem thêm</div>
                        </div>
                    </div>

                    <div className="inner-right">
                        <div className="button"><div className="inner-text">Tạo chế độ xem</div></div>
                        <div className="button">
                            <SlidersHorizontal className="w-5 h-5 cursor-pointer"/>
                        </div>
                    </div>
                </div>


                {selectedSearch && (
                    <div className="section-4">
                        {/*<div className="inner-tag">*/}
                        {/*    <span className="inner-tag-1">Chiến dịch là</span>*/}
                        {/*    <span className="inner-tag-2">Đã chọn 3</span>*/}
                        {/*    <span className="inner-tag-close"><i className="fa-solid fa-xmark" /></span>*/}
                        {/*</div>*/}
                        <div className="inner-input">
                            <input type="text" placeholder="Tìm kiếm theo tên, ID hoặc số liệu" />
                        </div>
                        <div className="inner-delete">Xóa</div>
                    </div>
                )}

                {/* Section 5: Tab hiển thị */}
                <div className="section-5 flex flex-col 2xl:flex-row">
                    <div className="inner-left flex flex-col 2xl:flex-row">
                        <div className="inner-button active w-[307px]">
                            <FolderUp />
                            <div className="inner-text">Chiến dịch</div>
                            {/*<div className="inner-tag">*/}
                            {/*    <span className="inner-tag-1">Đã chọn 3 mục</span>*/}
                            {/*    <span className="inner-tag-close"><i className="fa-solid fa-xmark" /></span>*/}
                            {/*</div>*/}
                        </div>
                        <div className="inner-button w-[307px]">
                            <LayoutDashboard />
                            <div className="inner-text">Nhóm quảng cáo</div>
                        </div>
                        <div className="inner-button w-[307px]">
                            <PanelTop />
                            <div className="inner-text">Quảng cáo </div>
                        </div>
                    </div>

                    <div className="inner-right">
                        <div className="button">
                            <div className="inner-icon"><i className="fa-regular fa-calendar-days" /></div>
                            <span className="inner-text">Tháng này: 1 Tháng 7, 2025 – 31 Tháng 7, 2025</span>
                            <div className="inner-icon-down"><i className="fa-solid fa-caret-down" /></div>
                        </div>
                    </div>
                </div>

                {/* Section 6: Hành động & báo cáo */}
                <div className="section-6 flex flex-row overflow-x-auto whitespace-nowrap gap-2 p-2">
                    <div className="inner-left">
                        <div className="button button-green">
                            <Plus className="w-5 h-5 cursor-pointer" />
                            <div className="inner-text">Tạo</div>
                        </div>

                        {/* Sao chép */}
                        <div className="button-group">
                            <div className="button">
                                <div className="inner-icon"><i className="fa-regular fa-copy" /></div>
                                <div className="inner-text">Sao chép</div>
                            </div>
                            <div className="button">
                                <div className="inner-icon"><i className="fa-solid fa-caret-down" /></div>
                            </div>
                        </div>

                        {/* Chỉnh sửa */}
                        <div className="button-group">
                            <div className="button">
                                <div className="inner-icon"><i className="fa-solid fa-pen" /></div>
                                <div className="inner-text">Chỉnh sửa</div>
                            </div>
                            <div className="button">
                                <div className="inner-icon"><i className="fa-solid fa-caret-down" /></div>
                            </div>
                        </div>

                        {/* Xóa & thử nghiệm */}
                        <div className="button"><div className="inner-icon"><i className="fa-solid fa-trash-can" /></div></div>
                        <div className="inner-line" />
                        <div className="button"><div className="inner-icon"><i className="fa-solid fa-flask" /></div><div className="inner-text">Thử nghiệm A/B</div></div>
                        <div className="button"><div className="inner-icon"><i className="fa-solid fa-tag" /></div></div>
                        <div className="button button-none">
                            <div className="inner-text">Xem thêm</div>
                            <div className="inner-icon-down"><i className="fa-solid fa-caret-down" /></div>
                        </div>
                    </div>

                    <div className="inner-right">
                        <div className="button">
                            <div className="inner-icon"><i className="fa-solid fa-table-columns" /></div>
                            <span className="inner-text">Cột: M</span>
                            <div className="inner-icon-down"><i className="fa-solid fa-caret-down" /></div>
                        </div>
                        <div className="button">
                            <div className="inner-icon"><i className="fa-solid fa-chart-simple" /></div>
                            <span className="inner-text">Số liệu chia nhỏ</span>
                            <div className="inner-icon-down"><i className="fa-solid fa-caret-down" /></div>
                        </div>
                        <div className="button">
                            <div className="inner-icon"><i className="fa-solid fa-file-lines" /></div>
                            <span className="inner-text">Báo cáo</span>
                            <div className="inner-icon-down"><i className="fa-solid fa-caret-down" /></div>
                        </div>
                        <div className="button-group">
                            <div className="button">
                                <div className="inner-icon"><i className="fa-solid fa-arrow-up-right-from-square" /></div>
                                <div className="inner-text">Xuất</div>
                            </div>
                            <div className="button">
                                <div className="inner-icon"><i className="fa-solid fa-caret-down" /></div>
                            </div>
                        </div>
                        <div className="button">
                            <div className="inner-icon"><i className="fa-solid fa-chart-line" /></div>
                            <span className="inner-text">Biểu đồ</span>
                        </div>
                    </div>
                </div>

                {/* Section 7: Bảng dữ liệu */}
                <div className="section-7 flex flex-rơ overflow-x-auto whitespace-nowrap gap-2 p-2">
                    <table>
                        <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>Tắt/Bật</th>
                            <th>Chiến dịch</th>
                            <th>Phân phối</th>
                            <th>Ngân sách</th>
                            <th>Người tiếp cận</th>
                            <th>Lượt hiển thị</th>
                            <th>Thurplay</th>
                            <th>Chi phí / Thruplay</th>
                            <th>Số tiền đã chi</th>
                            <th>Kết thúc</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Dữ liệu ví dụ, có thể tạo thêm component map */}
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td><input type="checkbox" className="switch" /></td>
                            <td><a href="#">LIVE_AP1_PHƯƠNG_2607_AM_UYÊN VŨ_15M</a></td>
                            <td>Không hoạt động</td>
                            <td className="text-right">5.000.000<br /><small>Trọn đời</small></td>
                            <td className="text-right">16.668</td>
                            <td className="text-right">17.824</td>
                            <td className="text-right">976</td>
                            <td className="text-right">1.277</td>
                            <td className="text-right">1.246.331</td>
                            <td className="text-right">26 Tháng 7, 2025</td>
                            <td></td>
                        </tr>
                        {/* Thêm dòng khác nếu cần */}
                        </tbody>
                    </table>
                </div>


            </div>

            {/* Banner quảng cáo AI */}
            {/*<div id="ai-ad-banner">*/}
            {/*    <img src="https://ads.flagteam.vn/assets/media/logo.png" alt="Logo AI Ads" />*/}
            {/*    <span>Tối ưu hóa Quảng Cáo với AI</span>*/}
            {/*</div>*/}
        </div>
    )
}

export default Advertisement;
