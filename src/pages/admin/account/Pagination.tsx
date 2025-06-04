import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
   currentPage,
   totalPages,
   onPageChange,
}) => {
    const maxPagesToShow = 3; // Số trang tối đa hiển thị
    const getPageNumbers = () => {
        const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

        // Thêm dấu ba chấm và trang đầu/cuối nếu cần
        const result: (number | string)[] = [];
        if (startPage > 1) {
            result.push(1);
            if (startPage > 2) result.push("...");
        }
        result.push(...pages);
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) result.push("...");
            result.push(totalPages);
        }
        return result;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex items-center justify-center mt-4 space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-blue-100 hover:text-blue-600"
            >
                Trước
            </button>
            {pages.map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                        page === currentPage
                            ? "bg-blue-600 text-white"
                            : typeof page === "number"
                                ? "bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                                : "bg-gray-100 text-gray-400 cursor-default"
                    }`}
                    disabled={typeof page !== "number"}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-sm font-medium disabled:opacity-50 hover:bg-blue-100 hover:text-blue-600"
            >
                Tiếp
            </button>
        </div>
    );
};

export default Pagination;
