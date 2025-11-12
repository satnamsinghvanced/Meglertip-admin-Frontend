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
import HomePage from "../pages/homepage/homepage";
import ArticlePage from "../pages/article/ArticlePage";
import AboutPage from "../pages/about/AboutPage";
import PartnerPage from "../pages/partner/PartnerPage";
import FormPage from "../pages/forms/forms";

const Routes = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    if (!token && window.location.pathname !== "/login") {
      navigate("/login");
    }

    if (token && window.location.pathname === "/login") {
      navigate("/homepage", { replace: true });
    }
  }, [token]);
  return (
    <RouteWrapper>
      <Route element={token ? <Layout /> : <AuthLayout />}>
        <Route path={ROUTES.HOMEPAGE} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.ARTICLE} element={<ArticlePage />} />
        <Route path={ROUTES.FAQ} element={<Faq />} />
        <Route path={ROUTES.PARTNER} element={<PartnerPage/>} />

        <Route path={ROUTES.FORMS} element={<FormPage />} />
        <Route path={ROUTES.HOME} element={<p>Dashboard</p>}>
        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
        <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
        <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
      </Route>
    </RouteWrapper>
  );
};

export default Routes;
