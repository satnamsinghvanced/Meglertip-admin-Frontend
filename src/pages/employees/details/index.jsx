import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { IoChevronBack } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchDetails, fetchEmployees } from "../../../store/slices/employee";
import { DetailsSkeleton } from "../../../UI/Skeletons";
import EmployeeStatusDropDown from "../../../UI/dropdown/EmployeeStatusDropDown";
import formatPhoneNumber from "../../../utils/formatPhoneNumber";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";
import { LuGlobe } from "react-icons/lu";
import EmployeeTabs from "./Tabs";
import Profile from "../../../UI/Profile";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, details, is_loading } = useSelector(
    (state) => state.employee
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if ((!details || details == undefined) && id) {
      dispatch(fetchDetails(id));
      if (employees?.length === 0) dispatch(fetchEmployees());
    }
  }, [dispatch, id]);

  return (
    <div>
      <h4 className="flex items-center text-gray-900 dark:text-white font-bold mb-7">
        <span
          className="text-gray-900 mr-2 cursor-pointer"
          onClick={() => navigate("/employees")}
        >
          <IoChevronBack />
        </span>
        Employee Detail
      </h4>
      {is_loading ? (
        <DetailsSkeleton />
      ) : (
        <div className="w-full flex flex-col lg:flex-row items-start gap-5">
          <div className="bg-white dark:bg-gray-800 text-center flex-shrink-0 rounded-lg max-w-80 w-full p-6 sticky top-0">
            <div>
              {details?.profileImage ? (
                <figure className="justify-center flex">
                  <img
                    className="rounded-full h-28 w-28 object-cover"
                    src={`${import.meta.env.VITE_API_URL}/${
                      details?.profileImage
                    }`}
                    width={100}
                    height={100}
                    alt="logo"
                  />
                </figure>
              ) : (
                <div className="justify-center flex">
                  <Profile
                    user={details}
                    className="w-[100px] h-[100px] text-2xl"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <h5 className="text-gray-900 font-bold truncate">
                {details?.firstName} {details?.lastName}
              </h5>
              <p>{details?.designation}</p>
            </div>
            <div className="mb-6 mt-4">
              <EmployeeStatusDropDown employee={details} />
            </div>
            <div className="pt-5 pb-2 flex flex-col gap-5 text-sm text-gray-900 dark:text-white font-semibold border-t border-solid border-gray-200 dark:border-gray-700">
              <p className="flex items-center break-all">
                <span className="text-primary mr-2.5">
                  <MdOutlineEmail fontSize={20} />
                </span>
                <span className="text-left">{details?.email}</span>
              </p>

              <p className="flex items-center">
                <span className="text-primary mr-2.5">
                  <MdLocalPhone fontSize={20} />
                </span>
                {formatPhoneNumber(
                  details?.personalInformation?.telephones[0] ?? "N/A"
                )}
              </p>
              <p className="flex items-center text-left">
                <span className="text-primary mr-2.5">
                  <LuGlobe fontSize={20} />
                </span>
                <span className="">{details?.address ?? "N/A"}</span>
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 text-center flex-shrink-0 rounded-lg w-[calc(100%-340px)] p-6 h-screen">
            <EmployeeTabs details={details} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
