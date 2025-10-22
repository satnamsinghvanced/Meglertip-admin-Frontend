import React from "react";
import Table from "./Table";
import TablePagination from "./TablePagination";

const ThemeTable = ({
  data,
  sort,
  sortDir,
  sortingHandler,
  className,
  is_loading,
  noDataClass,
  balancePage,
  perPage,
  setPerPage,
}) => {
  return (
    <div className="overflow-auto">
      {data && (
        <Table
          is_loading={is_loading}
          className={className}
          data={data}
          sortingHandler={sortingHandler}
          sort={sort}
          sortDir={sortDir}
          noDataClass={noDataClass}
          balancePage={balancePage}
        />
      )}
      {data && data.pagination && (
        <TablePagination
          pagination={data.pagination}
          currentLength={data.rows?.length}
          perPage={perPage}
          setPerPage={setPerPage}
        />
      )}
    </div>
  );
};

export default ThemeTable;
