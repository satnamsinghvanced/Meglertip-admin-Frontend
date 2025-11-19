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
import { TermOfServicePage } from "../pages/term_of_service/TermOfService";
import { PrivacyPolicyPage } from "../pages/privacy_policy/PrivacyPolicy";
import CountyPage from "../pages/Counties/CountiesPage";
import ArticleFormPage from "../pages/article/ArticleFormPage";
import ArticleDetailPage from "../pages/article/ArticleDetailPage";
import EmailTemplateList from "../pages/email-template/templates";
import CreateEmailTemplate from "../pages/email-template/email-templates";
import Places from "../pages/places/PlacePage";
import Company from "../pages/companies/CompanyPage";
import CompanyDetailPage from "../pages/companies/CompanyDetailPage";
import CompanyFormPage from "../pages/companies/CompanyFormPage";
import PlaceFormPage from "../pages/places/PlaceFormPage";
import PlaceDetailPage from "../pages/places/PlaceDetailPage";

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
        <Route path={ROUTES.FAQ} element={<Faq />} />
        <Route path={ROUTES.ARTICLE} element={<ArticlePage />} />
        <Route path={ROUTES.ARTICLE_CREATE} element={<ArticleFormPage />} />
        <Route path={ROUTES.ARTICLE_EDIT} element={<ArticleFormPage />} />
        <Route path={ROUTES.ARTICLE_VIEW} element={<ArticleDetailPage />} />
        <Route path={ROUTES.PARTNER} element={<PartnerPage />} />

        <Route path={ROUTES.FORMS} element={<FormPage />} />
        <Route path={ROUTES.CITIES} element={<CountyPage />} />
        <Route path={ROUTES.PLACES} element={<Places />} />
        <Route path={ROUTES.PLACES_CREATE} element={<PlaceFormPage />} />
        <Route path={ROUTES.PLACES_VIEW} element={<PlaceDetailPage />} />
        <Route path={ROUTES.PLACES_EDIT} element={<PlaceFormPage />} />
        <Route path={ROUTES.COMPANIES} element={<Company />} />
        <Route path={ROUTES.COMPANIES_CREATE} element={<CompanyFormPage />} />
        <Route path={ROUTES.COMPANIES_VIEW} element={<CompanyDetailPage />} />
        <Route path={ROUTES.COMPANIES_EDIT} element={<CompanyFormPage />} />

        <Route path={ROUTES.HOME} element={<p>Dashboard</p>} />
        <Route path={ROUTES.TERM_OF_SERVICE} element={<TermOfServicePage />} />
        <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />

        <Route path={ROUTES.LOGIN} element={<LoginForm />} />
        <Route path={ROUTES.EMAIL} element={<EmailTemplateList />} />
        <Route path="/email/create" element={<CreateEmailTemplate />} />
        <Route
          path="/email/edit/:templateId"
          element={<CreateEmailTemplate />}
        />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
        <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
        <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
        <Route path={ROUTES.HELP_CENTER} element={<HelpCenter />} />
      </Route>
    </RouteWrapper>
  );
};

export default Routes;
