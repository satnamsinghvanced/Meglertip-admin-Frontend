import Tabs from "../../UI/Tabs";
import ChangePassword from "./ChangePassword";
import UserInfo from "./UserInfo";
import { FiAlertCircle } from "react-icons/fi";
import { MdOutlineLock } from "react-icons/md";
import { Palette } from "lucide-react";
import ThemeSettings from "./ThemeSettings";
import { FaSearchengin } from "react-icons/fa6";
import SEOSettings from "./SeoSettings";


const SettingTabs = () => {
  const list = [
    {
      icon: FiAlertCircle,
      title: "User Info",
      content: <UserInfo />,
    },
    {
      icon: MdOutlineLock,
      title: "Password",
      content: <ChangePassword />,
    },
    {
      icon: Palette,
      title: "Theme",
      content: <ThemeSettings/>,
    },
     {
      icon: FaSearchengin ,
      title: "SEO Settings",
      content: <SEOSettings/>,
    },
  ];

  return <Tabs list={list} />;
};

export default SettingTabs;
