import Tabs from "../../UI/Tabs";
import ChangePassword from "./ChangePassword";
import UserInfo from "./UserInfo";
import { FiAlertCircle } from "react-icons/fi";
import { MdOutlineLock } from "react-icons/md";

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
  ];

  return <Tabs list={list} />;
};

export default SettingTabs;
