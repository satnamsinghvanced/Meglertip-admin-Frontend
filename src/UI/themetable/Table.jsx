import { Link } from "react-router";

import { BsThreeDotsVertical } from "react-icons/bs";
import { LuCheckCheck } from "react-icons/lu";
import { BiEditAlt } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";
import { TbFileDownload } from "react-icons/tb";
import { MdLockOutline } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";
import { FaCaretDown } from "react-icons/fa6";
import { FaCaretUp } from "react-icons/fa6";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdLocalPhone } from "react-icons/md";

import Select from "../Select";
import Checkbox from "../Checkbox";
import { TableSkeleton } from "../Skeletons";
import Button from "../Button";

const Table = ({
  data,
  sort,
  sortDir,
  sortingHandler,
  className,
  is_loading,
  noDataClass,
  balancePage,
}) => {
  const DateData = [
    {
      value: "01 Mar 2023",
      display: "01 Mar 2023",
    },
    {
      value: "02 Mar 2023",
      display: "02 Mar 2023",
    },
    {
      value: "03 Mar 2023",
      display: "03 Mar 2023",
    },
    {
      value: "04 Mar 2023",
      display: "04 Mar 2023",
    },
  ];

  return (
    <>
      <div
        className={`w-full mt-6 overflow-auto ${
          balancePage ? "" : "min-h-[420px]"
        }`}
      >
        <table className={`${className} AtThemeTable w-full`}>
          <thead>
            <tr className="rounded-t-md rounded-s-md overflow-hidden">
              {data.headings.map((heading, index) => (
                <th
                  key={index}
                  className={`text-right align-middle bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 font-bold text-sm px-4 py-5 whitespace-nowrap first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md
                  ${
                    heading.title === "Stages" &&
                    className?.includes("recruitment_staging") &&
                    "ps-[65px]"
                  } 
                  ${heading.sort ? "cursor-pointer select-none" : ""}  ${
                    heading.class
                  }`}
                >
                  <div className={`flex items-center gap-3 ${heading.class} `}>
                    {heading.onChecked && (
                      <Checkbox
                        className="inline-flex items-center"
                        onChange={heading.onChecked}
                      />
                    )}
                    {heading.icon && heading.icon}
                    <span
                      className={`flex-shrink-0 ${
                        heading.title === "Action" ? "text-right ml-auto" : ""
                      } `}
                      onClick={() => {
                        if (heading.sort) {
                          sortingHandler(heading.key ?? heading.title);
                        }
                      }}
                    >
                      {heading.title}
                    </span>

                    {heading.sort && (
                      <div
                        className="flex flex-col"
                        onClick={() => {
                          if (heading.sort) {
                            sortingHandler(heading.key ?? heading.title);
                          }
                        }}
                      >
                        <button
                          type="button"
                          className={`${
                            sort === heading.key && sortDir === "asc"
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-400"
                          } -mb-[3px]`}
                        >
                          <FaCaretUp />
                        </button>
                        <button
                          type="button"
                          className={`${
                            sort === heading.key && sortDir === "desc"
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-400"
                          } -mt-[3px]`}
                        >
                          <FaCaretDown />
                        </button>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          {!is_loading && (
            <tbody>
              {data.rows?.length > 0 &&
                data.rows.map((row, index) => (
                  <tr
                    key={`${row._id}_${index}`}
                    id={`row-${row._id}`}
                    className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 group"
                    onClick={row.onClick}
                  >
                    {data.columns.map((col) => (
                      <td
                        className={`px-4 py-5 text-left align-middle text-gray-900 dark:text-white text-sm whitespace-nowrap`}
                        key={`key${col.name}-${row._id}`}
                      >
                        {col.type === "text" && (
                          <div
                            className={`flex gap-1.5 items-center ${col.className}`}
                          >
                            {col.icon &&
                              (col.preIcon === "email" ? (
                                <span className="text-primary -mb-0.5">
                                  <MdOutlineEmail fontSize={18} />
                                </span>
                              ) : col.preIcon === "phone" ? (
                                <span className="text-primary">
                                  <MdLocalPhone fontSize={16} />
                                </span>
                              ) : (
                                ""
                              ))}
                            <span className={`flex justify-center`}>
                              {row[col.name]}
                            </span>
                            {col.icon && (
                              <span>
                                {col.icon === "map" ? (
                                  <span className="text-primary">
                                    <LuMapPin fontSize={16} />
                                  </span>
                                ) : col.icon === "lock" ? (
                                  <span className="text-primary">
                                    <MdLockOutline fontSize={16} />
                                  </span>
                                ) : (
                                  ""
                                )}
                                {col.icon === "download" ? (
                                  <span className="text-primary">
                                    <TbFileDownload fontSize={16} />
                                  </span>
                                ) : (
                                  ""
                                )}
                              </span>
                            )}
                          </div>
                        )}

                        {col.type === "dropDown" && (
                          <Select
                            className="dateDropDown !p-0 border-0"
                            name=""
                            options={DateData}
                          />
                        )}

                        {col.type === "checkbox" && (
                          <Checkbox
                            inputClass="flex-shrink-0"
                            title={row[col.name]}
                          />
                        )}

                        {col.type === "actions" && (
                          <div
                            className={`flex items-center gap-2 md:gap-2 justify-end`}
                          >
                            {col.action?.file && (
                              <Link
                                to={`${process.env.NEXT_PUBLIC_API_URL}${
                                  row[col.action.file] || ""
                                }`}
                                target="_blank"
                                className="w-[30px] h-[30px] flex-shrink-0 rounded-lg flex items-center justify-center bg-blue"
                              >
                                <TbFileDownload color="white" fontSize={16} />
                              </Link>
                            )}
                            {col.action?.view && (
                              <button
                                type="button"
                                className={`w-[30px] h-[30px] flex-shrink-0 rounded-lg flex items-center justify-center bg-primary`}
                                onClick={() => col.action.view(row)}
                              >
                                <IoEyeOutline color="white" fontSize={16} />
                              </button>
                            )}
                            {col.action?.edit && !row?.hideEdit && (
                              <button
                                type="button"
                                className="w-[30px] h-[30px] flex-shrink-0 rounded-lg flex items-center justify-center bg-primary"
                                onClick={() => col.action.edit(row)}
                              >
                                <BiEditAlt color="white" fontSize={16} />
                              </button>
                            )}
                            {col.action?.accept &&
                              row?.status === "pending" && (
                                <button
                                  type="button"
                                  className="w-[30px] h-[30px] flex-shrink-0 rounded-lg flex items-center justify-center bg-darkBlue"
                                  onClick={() => col.action.accept(row)}
                                  title="Accept"
                                >
                                  <LuCheckCheck color="white" fontSize={16} />
                                </button>
                              )}
                            {col.action?.delete && !row?.hideDelete && (
                              <button
                                type="button"
                                className="w-[30px] h-[30px] flex-shrink-0 rounded-lg flex items-center justify-center bg-red-700"
                                onClick={() => {
                                  col.action.delete(row._id);
                                }}
                              >
                                <FaRegTrashCan color="white" />
                              </button>
                            )}
                            {col.action?.menu && (
                              <button
                                type="button"
                                className="w-[30px] h-[30px] flex-shrink-0 rounded-lg flex items-center justify-center bg-blue"
                                onClick={() => col.action.menu(row)}
                              >
                                <BsThreeDotsVertical
                                  color="white"
                                  fontSize={16}
                                />
                              </button>
                            )}
                            {col.action?.addProject && (
                              <Button
                                className="!py-2"
                                onClick={() => col.action.addProject(row)}
                                disabled={col.action.isProjectAlreadyAdded(row)}
                              >
                                {col.action.isProjectAlreadyAdded(row)
                                  ? "Added"
                                  : "Add"}
                              </Button>
                            )}
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          )}
        </table>
        {!is_loading && data.rows?.length === 0 && (
          <div
            className={`text-center h-[calc(100vh_-_54vh)] flex items-center justify-center ${noDataClass}`}
          >
            No Data Found
          </div>
        )}
        {is_loading && (
          <div className="pt-3">
            <TableSkeleton />
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
