import { useState } from "react";

const usePagination = (initialPage = 1, initialPageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handleChange = (page: any, size: any) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handleChange,
  };
};

export default usePagination;
