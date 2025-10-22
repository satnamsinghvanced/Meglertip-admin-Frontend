import React, { useEffect } from "react";
import { Route, Routes as RouteWrapper, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Layout from "../layouts/Layout";
import { ROUTES } from "../consts/routes";
import LoginForm from "../components/LoginForm";
import { useSelector } from "react-redux";
import Settings from "../pages/settings/Settings";
import HelpCenter from "../pages/helpcenter/HelpCenter";
import Faq from "../pages/helpcenter/Faq";
import Employees from "../pages/employees";
import EmployeeDetails from "../pages/employees/details";

const Routes = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    !token ? navigate("/login") : navigate("/");
  }, [token]);

  return (
    <RouteWrapper>
      <Route element={
        token ? 
        <Layout /> 
         :
          <AuthLayout/>
        }>
        <Route path={ROUTES.HOME} element={<p>HOME</p>} />
        <Route path={ROUTES.ME} element={<p>ME</p>} />
        <Route path={ROUTES.INBOX} element={<p>INBOX</p>} />
        <Route path={ROUTES.MY_TEAM} element={<p>MY TEAM</p>} />
        <Route path={ROUTES.MY_FINANCES} element={<p>MY FINANCES</p>} />
        <Route path={ROUTES.PROJECTS} element={<p>PROJECTS</p>} />
        <Route path={ROUTES.EMPLOYEES}>
          <Route index element={<Employees />} />
          <Route path=":id" element={<EmployeeDetails />} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.HELPCENTER} element={<HelpCenter />} />
        <Route path={ROUTES.FAQ} element={<Faq />} />
        <Route path={ROUTES.COMPANY_POLICY} element={<HelpCenter />} />
        <Route path={ROUTES.EMPLOYEE_POLICY} element={<HelpCenter />} />
        <Route path={ROUTES.CONTACT_SUPPORT} element={<HelpCenter />} />
      </Route>
    </RouteWrapper>
  );
};

export default Routes;
