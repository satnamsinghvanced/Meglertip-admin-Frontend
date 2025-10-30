import { Menu, MenuItems, MenuItem, MenuButton } from "@headlessui/react";
import { Link, useNavigate } from "react-router";
import { HiChevronDown } from "react-icons/hi";
import Profile from "../UI/Profile";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/slices/user";
import { ROUTES } from "../consts/routes";

const Header = ({ setIsSidebarOpen }) => {
  const { auth_user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="px-5 py-3 min-h-[70px] bg-white dark:bg-blue-950 border-b border-solid border-gray-200 dark:border-gray-800 transition-all duration-300 flex items-center justify-end">
      <div className="relative">
        <Menu>
          <MenuButton className="flex items-center space-x-1 cursor-pointer">
            <Profile user={auth_user} />
            <HiChevronDown fontSize={17} className="dark:text-white" />
          </MenuButton>
          <MenuItems>
            <div
              className="absolute top-full right-3 !z-50 my-2 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm dark:text-white font-bold">
                  {auth_user?.username ??  ""} 
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-200 font-medium">
                  {auth_user?.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <MenuItem as="li">
                  <button
                    onClick={() => {
                      navigate("/homepage");
                    }}
                    className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </button>
                </MenuItem>
                <MenuItem as="li">
                  <button
                    onClick={() => {
                      navigate("/settings");
                    }}
                    className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </button>
                </MenuItem>
                <MenuItem as="li">
                  <button
                    onClick={() => {
                      dispatch(logOut());
                      navigate("/login");
                    }}
                    className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign Out
                  </button>
                </MenuItem>
              </ul>
            </div>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
