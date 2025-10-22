import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React from "react";
import { EMPLOYEE_STATUSES } from "../../consts/consts";
import { updateEmployeeStatus } from "../../store/slices/employee";
import { useDispatch } from "react-redux";

const EmployeeStatusDropDown = ({ employee }) => {
  const dispatch = useDispatch();

  console.log("employee", employee);

  let badgeClassName;

  switch (employee?.status) {
    case "Active":
      badgeClassName =
        "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      break;
    case "Inactive":
      badgeClassName =
        "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200";
      break;
    case "On Leave":
      badgeClassName =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      break;
    case "On Probation Period":
      badgeClassName =
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      break;
    case "Work From Home":
      badgeClassName =
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      break;
    case "On Notice Period":
      badgeClassName =
        "bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-200";
      break;
    default:
      badgeClassName =
        "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      break;
  }

  return (
    <div className="relative">
      <Menu>
        <MenuButton
          className={`font-bold uppercase text-xs py-1.5 px-3.5 rounded-lg ${badgeClassName}`}
        >
          {employee?.status}
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom start"
          className="[--anchor-gap:4px] w-fit origin-top-right rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-sm font-semibold p-1.5 transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {EMPLOYEE_STATUSES.map((status, index) => {
            return (
              <MenuItem key={`employee_status_${index}`}>
                <button
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-2 data-[focus]:bg-white dark:data-[focus]:bg-blue-950 dark:data-[focus]:text-white whitespace-nowrap"
                  onClick={() => {
                    dispatch(
                      updateEmployeeStatus(employee._id, {
                        status: status.value,
                      })
                    );
                  }}
                >
                  {status.label}
                </button>
              </MenuItem>
            );
          })}
        </MenuItems>
      </Menu>
    </div>
  );
};

export default EmployeeStatusDropDown;
