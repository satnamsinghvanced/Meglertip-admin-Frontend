import { useEffect } from "react";
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
import HomePage from "../pages/homepage/homepage";
import ArticlePage from "../pages/article/ArticlePage";
import AboutPage from "../pages/about/AboutPage";

const Routes = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    !token ? navigate("/login") : navigate("/");
  }, [token]);

  return (
    <RouteWrapper>
      <Route element={token ? <Layout /> : <AuthLayout />}>
        <Route path={ROUTES.HOMEPAGE} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage/>} />
        <Route path={ROUTES.ME} element={<p>ME</p>} />
        <Route path={ROUTES.FORMS} element={<p>FORMS</p>} />
        <Route path={ROUTES.ARTICLE} element={<ArticlePage />} />
        <Route path={ROUTES.FAQ} element={<Faq />} />
        <Route path={ROUTES.PROJECTS} element={<p>PROJECTS</p>} />
        <Route path={ROUTES.HOME} element={<p>Dashboard</p>}>
          <Route index element={<Employees />} />
          <Route path=":id" element={<EmployeeDetails />} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.HELPCENTER} element={<HelpCenter />} />
        {/* <Route path={ROUTES.FAQ} element={<Faq />} /> */}
        <Route path={ROUTES.COMPANY_POLICY} element={<HelpCenter />} />
        <Route path={ROUTES.EMPLOYEE_POLICY} element={<HelpCenter />} />
        <Route path={ROUTES.CONTACT_SUPPORT} element={<HelpCenter />} />
      </Route>
    </RouteWrapper>
  );
};

export default Routes;
