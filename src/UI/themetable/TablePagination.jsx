import React from "react";
import { LuChevronLeft } from "react-icons/lu";
import { LuChevronRight } from "react-icons/lu";
import Select from "../Select";

const TablePagination = ({
  pagination,
  currentLength,
  perPage,
  setPerPage,
}) => {
  const totalPages = Math.ceil(pagination.totalRecords / perPage);

  return (
    totalPages > 1 && (
      <div className="flex justify-end items-center gap-5 my-3">
        {pagination?.showPerPage && (
          <div className={` ${true ? "flex items-center gap-5" : " block"}`}>
            <div className="flex items-center gap-3">
              <p className="text-gray-700 text-sm font-medium">
                Items per page:
              </p>
              <div className="w-[90px]">
                <Select
                  name=""
                  buttonClass="py-2.5 px-3"
                  value={perPage}
                  options={[
                    { label: 5, value: 5 },
                    { label: 10, value: 10 },
                    { label: 25, value: 25 },
                    { label: 50, value: 50 },
                  ]}
                  onChange={(value) => {
                    setPerPage(value);
                  }}
                />
              </div>
            </div>
            <span className={`block text-gray-700 text-sm font-medium`}>
              {(pagination.currentPage - 1) * perPage + 1} -{" "}
              {(pagination.currentPage - 1) * perPage + currentLength} of{" "}
              {pagination.totalRecords}
            </span>
          </div>
        )}

        <ul className="m-0 p-0 flex items-center gap-2">
          <li>
            <button
              className={`size-10 border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-full disabled:pointer-events-none ${
                pagination.currentPage === 1 ? "text-gray-500" : ""
              } `}
              disabled={pagination.currentPage === 1}
              type="button"
              onClick={() => pagination.prevAction()}
            >
              <LuChevronLeft fontSize={18} />
            </button>
          </li>
          <li>
            <button
              className={`size-10 border border-gray-300 dark:border-gray-600 flex items-center justify-center rounded-full disabled:pointer-events-none ${
                pagination.currentPage === totalPages ? "text-gray-500" : ""
              } `}
              disabled={pagination.currentPage === totalPages}
              type="button"
              onClick={() => pagination.nextAction()}
            >
              <LuChevronRight fontSize={18} />
            </button>
          </li>
        </ul>
      </div>
    )
  );
};

export default TablePagination;
