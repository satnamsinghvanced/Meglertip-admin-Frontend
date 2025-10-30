import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../../UI/InputField";
import Button from "../../UI/Button";
import { changePassword, updateUserInfo } from "../../store/slices/user";

const ChangePassword = () => {
  const { auth_user, is_loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      id: auth_user?._id,
      oldPassword: "",
      newPassword: "",
      confirm_password: "",
    },
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8)
        .required("New password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
          "Password must contain at least one uppercase character, one lowercase character, one number"
        ),
      confirm_password: Yup.string()
        .required("Confirm password is required")
        .oneOf(
          [Yup.ref("newPassword"), ""],
          "Confirm password must match new password"
        ),
    }),
      initialErrors: {},
    onSubmit: (values) => {
      // @ts-ignore
      dispatch(changePassword(auth_user?._id, values, "Your password has been changed"));
      formik.resetForm();
    },
  });

  return (
    <div className="bg-white dark:bg-blue-950 rounded-lg px-4 py-6 md:p-6">
      <div className="pb-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h4 className="font-bold dark:text-white">Change Password</h4>
      </div>
      <div className="w-full py-7">
        <div className="mb-5">
          <InputField
            size="sm"
            type="password"
            label="Old Password"
            name="oldPassword"
            placeholder="Old Password"
            formik={formik}
            value={formik.values.oldPassword}
          />
        </div>
        <div className="mb-5">
          <InputField
            size="sm"
            type="password"
            label="New Password"
            name="newPassword"
            placeholder="New Password"
            formik={formik}
            value={formik.values.newPassword}
          />
        </div>
        <div className="mb-5">
          <InputField
            size="sm"
            type="password"
            label="Confirm Password"
            name="confirm_password"
            placeholder="Confirm Password"
            formik={formik}
            value={formik.values.confirm_password}
          />
        </div>
        <div className="text-right">
          <Button
            size="sm"
            value="Save"
            labelclass="flex gap-4 font-bold justify-center"
            isLoading={is_loading}
            onClick={formik.submitForm}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
