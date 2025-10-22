import React, { useEffect, useState } from "react";
import { TbFileDownload } from "react-icons/tb";
import { LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import exportCSV from "../../services/csvmaker";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEmployee,
  fetchEmployees,
  setDetails,
} from "../../store/slices/employee";
import Checkbox from "../../UI/Checkbox";
import { Link, useNavigate } from "react-router";
import ThemeTable from "../../UI/themetable";
import { MdSearch } from "react-icons/md";
import SearchField from "../../UI/SearchField";
import PageHeader from "../../components/PageHeader";
import Select from "../../UI/Select";
import Profile from "../../UI/Profile";
import formatPhoneNumber from "../../utils/formatPhoneNumber";
import formatDateToDDMMYYYY from "../../utils/formatDateToDDMMYYYY";
import EmployeeStatusDropDown from "../../UI/dropdown/EmployeeStatusDropDown";
import { EMPLOYEE_DESIGNATIONS, EMPLOYEE_STATUSES } from "../../consts/consts";
import DeleteModal from "../../UI/modal/DeleteModal";
import AddNewEmployee from "./AddNewEmployee";

const Employees = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [currentPage, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDesignation, setFilterDepartment] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  const { employees, is_loading, total_count } = useSelector(
    (state) => state.employee
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchEmployees({
        page: currentPage,
        perPage,
        sort: "",
        sortDir,
        search,
        status: filterStatus,
        designation: filterDesignation,
      })
    );
  }, [perPage, currentPage]);

  const allStatus = [
    { label: "All Status", value: "all" },
    ...EMPLOYEE_STATUSES,
  ];

  const allDesignations = [
    { label: "All Designations", value: "all" },
    ...EMPLOYEE_DESIGNATIONS,
  ];

  const buttonsList = [
    {
      value: <>Download ({selectedRows.length})</>,
      variant: "white",
      icon: <TbFileDownload fontSize={20} />,
      onClick: () => {
        downloadCSV();
      },
      border: "border-gray-900 dark:border-gray-400",
    },
    {
      value: "Add New Employee",
      variant: "primary",
      icon: <LuPlus fontSize={20} />,
      onClick: () => {
        setSelectedEmployee(null);
        setShowCanvas(true);
      },
    },
  ];

  const downloadCSV = () => {
    if (selectedRows.length > 0) {
      let data = [];
      data.push([
        "Employee Name",
        "Department",
        "Phone Number",
        "Joining Date",
        "Email",
        // "Gender",
        // "Address",
        "Employee Status",
      ]);
      let rows = employees.filter((item) => selectedRows.includes(item._id));
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        data.push([
          row?.name,
          row?.designation,
          row?.personalInformation?.telephones[0]
            ? row?.personalInformation?.telephones[0]
            : "N/A",
          formatDateToDDMMYYYY(row?.dateOfJoining),
          row?.email,
          row?.status,
        ]);
      }
      exportCSV(data, "employees");
    } else {
      toast.error("Please select rows before downloading");
    }
  };

  const data = {
    headings: [
      {
        title: "Employee Name",
        key: "firstName",
        sort: true,
        onChecked: (event) => {
          let elms = document.querySelectorAll('tbody input[type="checkbox"]');
          let ids = [];
          for (let i = 0; i < elms.length; i++) {
            elms[i].checked = event.target.checked;
            event.target.checked && ids.push(elms[i].id);
          }
          setSelectedRows(ids);
        },
      },
      { title: "Designation" },
      { title: "Phone Number" },
      { title: "Joining Date" },
      { title: "Email" },
      //   { title: "Gender" },
      //   { title: "Address" },
      { title: "Employee Status" },
      { title: "Action" },
    ],
    columns: [
      {
        name: "profile",
        type: "text",
        action: null,
      },
      {
        name: "designationDisplay",
        type: "text",
        action: null,
      },
      {
        name: "phoneNumberDisplay",
        type: "text",
        action: null,
        icon: true,
        preIcon: "phone",
      },
      {
        name: "joiningDateDisplay",
        type: "text",
        action: null,
      },
      {
        name: "emailDisplay",
        type: "text",
        action: null,
        icon: true,
        preIcon: "email",
      },
      //   {
      //     name: "genderDisplay",
      //     type: "text",
      //     action: null,
      //   },
      //   {
      //     name: "addressDisplay",
      //     type: "text",
      //     action: null,
      //   },
      {
        name: "statusDisplay",
        type: "text",
        action: null,
      },
      {
        name: null,
        value: null,
        type: "actions",
        action: {
          view: (item) => {
            dispatch(setDetails(null));
            navigate(`/employees/${item._id}`);
          },
          delete: (id) => {
            setSelectedEmployee(id);
            setDeleteModal(true);
          },
        },
      },
    ],
    rows: employees?.map((item, index) => {
      item = { ...item };
      item.profile = (
        <>
          <div className="flex items-center">
            <Checkbox
              id={item._id}
              className="mr-3"
              checked={selectedRows?.includes(item._id)}
              onChange={(event) => {
                let ids = [...selectedRows];
                if (event.target.checked) {
                  !ids.includes(event.target.id) && ids.push(event.target.id);
                } else {
                  ids = ids.filter((value) => value !== event.target.id);
                }
                setSelectedRows(ids);
              }}
            />
            <Link
              to={`/employees/${item._id}`}
              onClick={() => {
                dispatch(setDetails(null));
              }}
              className="flex items-center gap-2.5"
            >
              <Profile user={item} />
              {
                (item.nameDisplay =
                  `${item?.firstName} ${item?.lastName}` ?? "N/A")
              }
            </Link>
          </div>
        </>
      );

      item.designationDisplay = item?.designation ?? "N/A";
      item.phoneNumberDisplay = formatPhoneNumber(
        item?.personalInformation?.telephones[0] ?? "N/A"
      );
      item.joiningDateDisplay =
        formatDateToDDMMYYYY(item?.dateOfJoining) ?? "N/A";
      item.emailDisplay = item?.email ?? "N/A";
      //   item.genderDisplay = item?.gender ?? "N/A";
      //   item.addressDisplay = item?.address ?? "N/A";
      item.statusDisplay = <EmployeeStatusDropDown employee={item} />;
      item.hideDelete = true;
      return item;
    }),
    pagination: {
      totalRecords: total_count,
      currentPage: currentPage,
      showPerPage: true,
      prevAction: () => {
        const page = currentPage / 1 - 1;
        dispatch(
          fetchEmployees({
            page: page > 0 ? page : 1,
            perPage,
            search,
            status: filterStatus,
            sort,
            sortDir,
            designation: filterDesignation,
          })
        );
        setPage(page);
      },
      nextAction: () => {
        const page = currentPage / 1 + 1;
        dispatch(
          fetchEmployees({
            page,
            perPage,
            sort,
            sortDir,
            search,
            status: filterStatus,
            designation: filterDesignation,
          })
        );
        setPage(page);
      },
      clickAction: (page) => {
        dispatch(
          fetchEmployees({
            page,
            perPage,
            sort,
            sortDir,
            search,
            status: filterStatus,
            designation: filterDesignation,
          })
        );
        setPage(page);
      },
    },
  };

  const sortingHandler = (key) => {
    let dir = "";
    if (!sort || sort === key) {
      switch (sortDir) {
        case "asc":
          setSortDir("desc");
          dir = "desc";
          break;
        case "desc":
          setSortDir("");
          dir = "";
          key = "";
          break;
        default:
          setSortDir("asc");
          dir = "asc";
          break;
      }
    } else {
      setSortDir("asc");
      dir = "asc";
    }
    setSort(key);
    dispatch(
      fetchEmployees({
        page: currentPage,
        perPage,
        sort: key,
        sortDir: dir,
        search,
        status: filterStatus,
        designation: filterDesignation,
      })
    );
  };

  const searchHandler = (payload) => {
    setPage(1);
    setSearch(payload);
    setSelectedRows([]);
    dispatch(
      fetchEmployees({
        page: 1,
        perPage,
        sort: "firstName",
        sortDir,
        status: filterStatus,
        search: payload,
        designation: filterDesignation,
      })
    );
  };

  const filterHandler = (payload) => {
    setPage(1);
    setSelectedRows([]);
    dispatch(fetchEmployees(payload));
  };

  return (
    <div className="bg-white dark:bg-blue-950 rounded-lg px-4 py-6 md:px-6 md:py-6">
      <PageHeader
        title="Employees"
        description="Manage Employees"
        buttonsList={buttonsList}
      />

      <div className="lg:flex grid grid-cols-2 gap-2 xs:gap-3 md:gap-4 justify-between items-center w-full">
        <SearchField
          size="xs"
          type="text"
          image={<MdSearch fontSize={24} color="#6a7282" />}
          placeholder="Search Employees"
          className="w-full"
          searchBtns=""
          styles="border border-gray-300 lg:pl-4"
          iconLeft={true}
          searchAction={searchHandler}
        />
        <div className="w-full flex items-center gap-2 xs:gap-3 md:gap-4">
          <div className="lg:w-full">
            <Select
              name=""
              placeholder="Status"
              options={allStatus}
              value={filterStatus}
              onChange={(value) => {
                setFilterStatus(value);
                filterHandler({
                  page: 1,
                  perPage,
                  sort,
                  sortDir,
                  search,
                  status: value,
                  designation: filterDesignation,
                });
              }}
            />
          </div>
          <div className="lg:w-full">
            <Select
              name=""
              placeholder="Designation"
              options={allDesignations}
              value={filterDesignation}
              onChange={(value) => {
                setFilterDepartment(value);
                filterHandler({
                  page: 1,
                  perPage,
                  sort,
                  sortDir,
                  search,
                  status: filterStatus,
                  designation: value,
                });
              }}
            />
          </div>
        </div>
      </div>
      <ThemeTable
        data={data}
        sort={sort}
        sortDir={sortDir}
        sortingHandler={sortingHandler}
        is_loading={is_loading}
        perPage={perPage}
        setPerPage={setPerPage}
      />
      {deleteModal && selectedEmployee && (
        <DeleteModal
          isOpen={deleteModal}
          setIsOpen={setDeleteModal}
          deleteAction={() => {
            dispatch(deleteEmployee(selectedEmployee));
            setDeleteModal(false);
            toast.success("Employee deleted successfully");
          }}
        />
      )}
      <AddNewEmployee isOpen={showCanvas} setIsOpen={setShowCanvas} />
    </div>
  );
};

export default Employees;
