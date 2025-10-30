import React from "react";
import Button from "../UI/Button";
import * as Yup from "yup";
import { signIn } from "../store/slices/user";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../UI/InputField";
import Checkbox from "../UI/Checkbox";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const { is_loading, auth_user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter valid email")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(signIn(values));
      // navigate("/");
    },
  });

  return (
    <div className="flex flex-col md:justify-center md:pb-0 px-5 max-w-[480px] w-full mx-auto gap-6 flex-auto">
      <h3 className="text-24 md:text-center mb-2">
        Admin Login
      </h3>
      <div>
        <InputField
          size="sm"
          type="email"
          name="email"
          formik={formik}
          value={formik.values.email}
          label="Email"
          placeholder="Input your registered email"
          onEnter={formik.submitForm}
          inputClass="dark:!bg-white"
        />
      </div>
      <div>
        <InputField
          size="sm"
          type="password"
          label="Password"
          name="password"
          formik={formik}
          value={formik.values.password}
          placeholder="Input your password"
          onEnter={formik.submitForm}
          inputClass="dark:!bg-white"
        />
      </div>
      <div className="flex justify-between">
        <Checkbox title="Remember Me" id="remember_me" />
      </div>
      <Button
        size="md"
        value="Login"
        isLoading={is_loading}
        disabled={!formik.isValid || Object.keys(formik.touched).length === 0}
        onClick={formik.submitForm}
      />
    </div>
  );
};

export default LoginForm;
