import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { BiEditAlt } from "react-icons/bi";
import Button from "../../UI/Button";
import InputField from "../../UI/InputField";
import DropZone from "../../UI/DropZone";
import { TbPhoto } from "react-icons/tb";
import { updateUserInfo } from "../../store/slices/user";
import { BLOOD_GROUPS, GENDERS, MARITAL_STATUSES } from "../../consts/consts";
import Select from "../../UI/Select";
import { formatDateForDateInput } from "../../utils/formatDate";

const UserInfo = () => {
  const dispatch = useDispatch();
  const { auth_user, is_loading } = useSelector((state) => state.user);
  const [editable, setEditable] = useState(false);
  const [profile, setProfile] = useState("");

  useEffect(() => {
    setProfile(auth_user?.profileImage);
  }, [auth_user]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string(),
    telephones: Yup.number().required("Phone number is required."),
    address: Yup.string().required("Address is required."),
    nationality: Yup.string().required("Nationality is required."),
    primaryContactName: Yup.string().required("Name is required."),
    primaryContactRelationship: Yup.string().required(
      "Relationship is required."
    ),
    primaryContactPhone: Yup.number().required("Phone number is required."),
    employeeSalary: Yup.number().positive("Salary must be a positive number.").integer()
  });

  const formik = useFormik({
    initialValues: {
      id: auth_user?._id,
      firstName: auth_user?.firstName,
      lastName: auth_user?.lastName,
      telephones: auth_user?.personalInformation?.telephones[0],
      address: auth_user?.address,
      birthday: formatDateForDateInput(new Date(auth_user?.birthday)),
      gender: auth_user?.gender,
      maritalStatus: auth_user?.personalInformation?.maritalStatus,
      bloodGroup: auth_user?.personalInformation?.bloodGroup,
      nationality: auth_user?.personalInformation?.nationality,
      employeeId: auth_user?.employeeId,
      dateOfJoining: formatDateForDateInput(new Date(auth_user?.dateOfJoining)),
      designation: auth_user?.designation,
      // employeeSalary: new Intl.NumberFormat("en-IN").format(
      //   Number(auth_user?.employeeSalary)
      // ),
      employeeSalary: auth_user?.employeeSalary,
      appraisalDate: formatDateForDateInput(new Date(auth_user?.appraisalDate)),
      primaryContactName: auth_user?.emergencyContact?.primary?.name,
      primaryContactRelationship:
        auth_user?.emergencyContact?.primary?.relationship,
      primaryContactPhone: auth_user?.emergencyContact?.primary?.phone[0],
      secondaryContactName: auth_user?.emergencyContact?.secondary?.name,
      secondaryContactRelationship:
        auth_user?.emergencyContact?.secondary?.relationship,
      secondaryContactPhone: auth_user?.emergencyContact?.secondary?.phone[0],
      bankName: auth_user?.bankInformation?.bankName,
      bankAccountName: auth_user?.bankInformation?.bankAccountName,
      bankAccountNumber: auth_user?.bankInformation?.bankAccountNumber,
      ifscCode: auth_user?.bankInformation?.ifscCode,
      panName: auth_user?.identityInformation?.panName,
      panNo: auth_user?.identityInformation?.panNo,
      panAddress: auth_user?.identityInformation?.panAddress,
      fatherName: auth_user?.identityInformation?.fatherName,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(
        updateUserInfo(values.id, {
          firstName: values.firstName,
          lastName: values.lastName,
          address: values.address,
          birthday: values.birthday,
          gender: values.gender,
          personalInformation: {
            telephones: [values.telephones],
            nationality: values.nationality,
            maritalStatus: values.maritalStatus,
            bloodGroup: values.bloodGroup,
          },
          emergencyContact: {
            primary: {
              name: values.primaryContactName,
              relationship: values.primaryContactRelationship,
              phone: [values.primaryContactPhone],
            },
            secondary: {
              name: values.secondaryContactName,
              relationship: values.secondaryContactRelationship,
              phone: [values.secondaryContactPhone],
            },
          },
          identityInformation: {
            fatherName: values.fatherName,
          },
        })
      );
      setEditable(false);
    },
  });

  const userInfoLowerList = [
    {
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number",
      name: "telephones",
    },
    {
      label: "Address",
      type: "text",
      placeholder: "Address",
      name: "address",
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
      label: "Marital Status",
      type: "select",
      placeholder: "Select Marital Status",
      name: "maritalStatus",
      options: MARITAL_STATUSES,
    },
    {
      label: "Blood Group",
      type: "select",
      placeholder: "Select Blood Group",
      name: "bloodGroup",
      options: BLOOD_GROUPS,
    },
    {
      label: "Nationality",
      type: "text",
      placeholder: "Nationality",
      name: "nationality",
    },
    {
      type: "heading",
      label: "Job Information",
    },
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
    {
      type: "heading",
      label: "Emergency Contact - Primary",
    },
    {
      label: "Name",
      type: "text",
      placeholder: "Name",
      name: "primaryContactName",
    },
    {
      label: "Relationship",
      type: "text",
      placeholder: "Relationship",
      name: "primaryContactRelationship",
    },
    {
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number",
      name: "primaryContactPhone",
    },
    {
      type: "heading",
      label: "Emergency Contact - Secondary",
    },
    {
      label: "Name",
      type: "text",
      placeholder: "Name",
      name: "secondaryContactName",
    },
    {
      label: "Relationship",
      type: "text",
      placeholder: "Relationship",
      name: "secondaryContactRelationship",
    },
    {
      label: "Phone Number",
      type: "tel",
      placeholder: "Phone Number",
      name: "secondaryContactPhone",
    },
    {
      type: "heading",
      label: "Bank Information",
    },
    {
      label: "Bank Name",
      type: "text",
      placeholder: "Bank Name",
      name: "bankName",
    },
    {
      label: "Account Holder Name",
      type: "text",
      placeholder: "Account Holder Name",
      name: "bankAccountName",
    },
    {
      label: "Account Number",
      type: "text",
      placeholder: "Account Number",
      name: "bankAccountNumber",
    },
    {
      label: "IFSC Code",
      type: "text",
      placeholder: "IFSC Code",
      name: "ifscCode",
    },
    {
      type: "heading",
      label: "Identity Information",
    },
    {
      label: "PAN Name",
      type: "text",
      placeholder: "PAN Name",
      name: "panName",
    },
    {
      label: "PAN Number",
      type: "text",
      placeholder: "PAN Number",
      name: "panNo",
    },
    {
      label: "PAN Address",
      type: "text",
      placeholder: "PAN Address",
      name: "panAddress",
    },
    {
      label: "Father Name",
      type: "text",
      placeholder: "Father Name",
      name: "fatherName",
    },
  ];

  return (
    <div className="bg-white dark:bg-blue-950 rounded-lg px-4 py-6 md:p-6">
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        {!editable ? (
          <h4 className="font-bold dark:text-white">User Info</h4>
        ) : (
          <h4 className="font-bold dark:text-white">Edit User Info</h4>
        )}
        {!editable && auth_user.role !== "employee" && (
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
                setProfile(auth_user.profileImage);
                setEditable(false);
              }}
            />
          </div>
        )}
      </div>
      <div className="pt-5">
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="flex items-center flex-col w-full gap-5 order-2 lg:order-none">
            <div className="w-full">
              <InputField
                size="sm"
                type="text"
                label="First Name"
                name="firstName"
                value={formik.values.firstName}
                formik={formik}
                disabled={!editable}
                placeholder="First Name"
              />
            </div>
            <div className="w-full">
              <InputField
                size="sm"
                type="text"
                label="Last Name"
                name="lastName"
                value={formik.values.lastName}
                formik={formik}
                disabled={!editable}
                placeholder="Last Name"
              />
            </div>
            <div className="w-full">
              <InputField
                size="sm"
                type="email"
                label="Email"
                name="email"
                value={auth_user?.email}
                disabled={true}
                placeholder="Email"
              />
            </div>
          </div>
          <div className="w-full order-1 flex items-center justify-center">
            <div
              className={`relative group max-w-64 aspect-square overflow-hidden w-full mx-auto rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-col`}
            >
              {profile && editable && (
                <div
                  className="absolute cursor-pointer inset-0 opacity-0 group-hover:opacity-100 transition-all z-[2] w-full h-full bg-black/50 text-white flex items-center justify-center"
                  onClick={() => setProfile("")}
                >
                  <TbPhoto fontSize={80} />
                </div>
              )}

              {profile && (
                <img
                  src={`${import.meta.env.VITE_API_URL}/${profile}`}
                  alt="User Profile"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                />
              )}

              {!profile && (
                <DropZone
                  heading="Upload Profile"
                  subheading="Only images are allowed like png, jpeg etc."
                  accept={["image"]}
                  hideUpload={!editable}
                  onUpload={(profileImage) => {
                    if (profileImage) {
                      dispatch(
                        updateUserInfo(auth_user?._id, {
                          profileImage: profileImage,
                        })
                      );
                      setEditable(false);
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:grid grid-cols-2 gap-4 md:gap-6 items-stretch mt-4 md:mt-6">
          {userInfoLowerList.map((item, index) => {
            return item.type === "heading" ? (
              <h5 key={index} className="col-span-2 mt-2 -mb-2">
                {item.label}
              </h5>
            ) : (
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
      {editable && (
        <div className="grid grid-cols-2 gap-3 w-full pt-5 lg:hidden lg:order-none">
          <Button
            size="md"
            value="Save"
            isLoading={is_loading}
            disabled={!formik.isValid}
            onClick={formik.submitForm}
          />
          <Button
            size="md"
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
  );
};

export default UserInfo;
