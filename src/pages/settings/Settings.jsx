import SettingTabs from "./SettingTabs";

const Settings = () => {
  return (
    <div className="px-0 py-0 pt-0">
      <div className="flex justify-between w-full items-center mb-8">
        <h3 className="dark:text-white font-bold">
          Settings
          <span className="block font-normal text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings here
          </span>
        </h3>
      </div>
      <SettingTabs />
    </div>
  );
};

export default Settings;
