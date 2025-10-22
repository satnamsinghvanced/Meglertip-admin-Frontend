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


const General = ({ details }) => {
  const [editable, setEditable] = useState(false);
  const dispatch = useDispatch();
  const { is_loading } = useSelector((state) => state.employee);

  const generalEmployeeFields = [
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
    {
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number",
      name: "telephones",
    },
    {
      label: "Date of Birth",
      type: "date",
      placeholder: "Date of Birth",
      name: "birthday",
      maxDate: new Date(),
    },
    {
      label: "Gender",
      type: "select",
      placeholder: "Gender",
      name: "gender",
      options: GENDERS,
    },
    {
      label: "Address",
      type: "text",
      placeholder: "Address",
      name: "address",
    },
    {
      label: "Marital Status",
      type: "select",
      placeholder: "Select Marital Status",
      name: "maritalStatus",
      options: MARITAL_STATUSES,
    },
    {
      label: "Nationality",
      type: "text",
      placeholder: "Nationality",
      name: "nationality",
    },
  ];

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string(),
    email: Yup.string().nullable().email().required("Email is required."),
    telephones: Yup.number().required("Phone number is required."),
    birthday: Yup.date().nullable().min(new Date(1900, 0, 1)),
    address: Yup.string().required("Address is required."),
    nationality: Yup.string().required("Nationality is required."),
  });

  const formik = useFormik({
    initialValues: {
      firstName: details?.firstName,
      lastName: details?.lastName,
      email: details?.email,
      telephones: details?.personalInformation?.telephones[0],
      birthday: formatDateForDateInput(new Date(details?.birthday)),
      address: details?.address,
      gender: details?.gender,
      maritalStatus: details?.personalInformation?.maritalStatus,
      nationality: details?.personalInformation?.nationality,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      dispatch(
        updateEmployee(details._id, {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          birthday: values.birthday,
          gender: values.gender,
          address: values.address,
          personalInformation: {
            telephones: [values.telephones],
            nationality: values.nationality,
            maritalStatus: values.maritalStatus,
          },
        })
      );
      setEditable(false);
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h4>General</h4>
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
        {generalEmployeeFields.map((item, index) => {
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

export default General;
