import React, { useState } from "react";
import { GENDERS, MARITAL_STATUSES } from "../../../consts/consts";
import Select from "../../../UI/Select";
import InputField from "../../../UI/InputField";
import * as Yup from "yup";
import { useFormik } from "formik";
import { updateEmployee } from "../../../store/slices/employee";
import { formatDateForDateInput } from "../../../utils/formatDate";
import { BiEditAlt } from "react-icons/bi";
import Button from "../../../UI/Button";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const JobInformation = ({ details }) => {
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const { is_loading } = useSelector((state) => state.employee);

  const employeeFields = [
    {
      label: "Employee ID",
      type: "number",
      placeholder: "Employee ID",
      name: "employeeId",
    },
    {
      label: "Date Of Joining",
      type: "date",
      placeholder: "Date Of Joining",
      name: "dateOfJoining",
      maxDate: new Date(),
    },
    {
      label: "Designation",
      type: "text",
      placeholder: "Designation",
      name: "designation",
    },
    {
      label: "Salary (In Rs.)",
      type: "number",
      placeholder: "Salary",
      name: "employeeSalary",
    },
    {
      label: "Appraisal Date",
      type: "date",
      placeholder: "Appraisal Date",
      name: "appraisalDate",
    },
  ];

  const validationSchema = Yup.object().shape({
    designation: Yup.string().required("Designation is required."),
    dateOfJoining: Yup.date().nullable().max(new Date()),
  });

  const formik = useFormik({
    initialValues: {
      employeeId: details?.employeeId,
      dateOfJoining: formatDateForDateInput(new Date(details?.dateOfJoining)),
      designation: details?.designation,
      employeeSalary: details?.employeeSalary,
      appraisalDate: formatDateForDateInput(new Date(details?.appraisalDate)),
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      dispatch(
        updateEmployee(details._id, {
          employeeId: values.employeeId,
          dateOfJoining: values.dateOfJoining,
          designation: values.designation,
          employeeSalary: values.employeeSalary,
          appraisalDate: values.appraisalDate,
        })
      );
      setEditable(false);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h4>Job Information</h4>
        {!editable && (
          <button
            className="cursor-pointer"
            type="button"
            onClick={() => setEditable(true)}
          >
            <BiEditAlt fontSize={24} color="#a0aec0" />
          </button>
        )}
        {editable && (
          <div className="lg:flex items-center space-x-3 hidden">
            <Button
              size="sm"
              value="Save"
              isLoading={is_loading}
              disabled={!formik.isValid}
              onClick={formik.submitForm}
            />
            <Button
              size="sm"
              value="Cancel"
              isLoading={is_loading}
              variant="white"
              onClick={() => {
                formik.resetForm();
                setEditable(false);
              }}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col md:grid grid-cols-2 gap-4 md:gap-4 items-stretch">
        {employeeFields.map((item, index) => {
          return (
            <div key={index} className={`${item.className}`}>
              {item.type === "select" ? (
                <Select
                  name={item.name}
                  label={item.label}
                  options={item.options}
                  value={formik.values[item.name]}
                  formik={formik}
                  disabled={!editable}
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
                  disabled={!editable}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobInformation;
