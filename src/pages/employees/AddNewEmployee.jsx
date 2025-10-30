import React from "react";
import AddNewEmployeeModal from "../../UI/modal/AddNewEmployeeModal";
import Select from "../../UI/Select";
import InputField from "../../UI/InputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { formatDateForDateInput } from "../../utils/formatDate";
import {
  EMPLOYEE_DESIGNATIONS,
  EMPLOYEE_ROLES,
  GENDERS,
  MARITAL_STATUSES,
} from "../../consts/consts";
import { useDispatch } from "react-redux";
import { createEmployee } from "../../store/slices/employee";

const AddNewEmployee = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  const addNewEmployeeFields = [
    {
      label: "First Name",
      type: "text",
      placeholder: "First Name",
      name: "firstName",
    },
    {
      label: "Last Name",
      type: "text",
      placeholder: "Last Name",
      name: "lastName",
    },
    {
      label: "Email",
      type: "email",
      placeholder: "Email",
      name: "email",
    },
    // {
    //   label: "Phone Number",
    //   type: "tel",
    //   placeholder: "Phone Number",
    //   name: "telephones",
    // },
    // {
    //   label: "Date of Birth",
    //   type: "date",
    //   placeholder: "Date of Birth",
    //   name: "birthday",
    //   maxDate: new Date(),
    // },
    // {
    //   label: "Gender",
    //   type: "select",
    //   placeholder: "Gender",
    //   name: "gender",
    //   options: GENDERS,
    // },
    // {
    //   label: "Address",
    //   type: "text",
    //   placeholder: "Address",
    //   name: "address",
    // },
    // {
    //   label: "Marital Status",
    //   type: "select",
    //   placeholder: "Select Marital Status",
    //   name: "maritalStatus",
    //   options: MARITAL_STATUSES,
    // },
    // {
    //   label: "Nationality",
    //   type: "text",
    //   placeholder: "Nationality",
    //   name: "nationality",
    // },
    // {
    //   label: "Date Of Joining",
    //   type: "date",
    //   placeholder: "Date Of Joining",
    //   name: "dateOfJoining",
    //   maxDate: new Date(),
    // },
    // {
    //   label: "Employee ID",
    //   type: "number",
    //   placeholder: "Employee ID",
    //   name: "employeeId",
    // },
    // {
    //   label: "Designation",
    //   type: "select",
    //   placeholder: "Select Designation",
    //   name: "designation",
    //   options: EMPLOYEE_DESIGNATIONS,
    // },
    // {
    //   label: "Role",
    //   type: "select",
    //   placeholder: "Select Role",
    //   name: "role",
    //   options: EMPLOYEE_ROLES,
    // },
    // {
    //   label: "Salary (In Rs.)",
    //   type: "number",
    //   placeholder: "Salary",
    //   name: "employeeSalary",
    // },
  ];

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string(),
    email: Yup.string().nullable().email().required("Email is required."),
    telephones: Yup.number().required("Phone number is required."),
    birthday: Yup.date().nullable().min(new Date(1900, 0, 1)),
    address: Yup.string().required("Address is required."),
    nationality: Yup.string().required("Nationality is required."),
    dateOfJoining: Yup.date().nullable().max(new Date()),
    employeeSalary: Yup.number()
      .positive("Salary must be a positive number.")
      .integer(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      telephones: "",
      address: "",
      gender: GENDERS[0].value,
      // address: "",
      maritalStatus: MARITAL_STATUSES[0].value,
      nationality: "India",
      dateOfJoining: formatDateForDateInput(new Date()),
      employeeId: "",
      designation: EMPLOYEE_DESIGNATIONS[1].value,
      role: EMPLOYEE_ROLES[0].value,
      employeeSalary: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      dispatch(
        createEmployee({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          birthday: values.birthday,
          gender: values.gender,
          address: values.address,
          password:
            values.firstName.toLowerCase() +
            new Date(values.birthday).getUTCFullYear(),
          personalInformation: {
            telephones: [values.telephones],
            nationality: values.nationality,
            maritalStatus: values.maritalStatus,
          },
          dateOfJoining: values.dateOfJoining,
          employeeId: values.employeeId,
          designation: values.designation,
          role: values.role,
          employeeSalary: values.employeeSalary,
        })
      );
    },
  });

  return (
    <AddNewEmployeeModal isOpen={isOpen} setIsOpen={setIsOpen} formik={formik}>
      <div className="flex flex-col md:grid grid-cols-1 gap-4 md:gap-4 items-stretch">
        {addNewEmployeeFields.map((item, index) => {
          return (
            <div key={index} className={`${item.className}`}>
              {item.type === "select" ? (
                <Select
                  name={item.name}
                  label={item.label}
                  options={item.options}
                  value={formik.values[item.name]}
                  formik={formik}
                />
              ) : (
                <InputField
                  size="sm"
                  type={item.type}
                  label={item.label}
                  name={item.name}
                  value={formik.values[item.name]}
                  placeholder={item.placeholder}
                  required={item.required}
                  formik={formik}
                />
              )}
            </div>
          );
        })}
      </div>
    </AddNewEmployeeModal>
  );
};

export default AddNewEmployee;
