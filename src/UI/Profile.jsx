const Profile = ({
  className = "md:h-10 h-8 md:w-10 w-8 text-sm md:text-base",
  user,
}) => {
  let display =
    user?.lastName?.length > 0
      ? `${user?.firstName?.slice(0, 1)}${user?.lastName?.slice(0, 1)}`
      : user?.firstName?.slice(0, 2);

  return (
    <>
      {user?.profileImage ? (
        <figure
          className={`${className} flex justify-center items-center flex-shrink-0 rounded-full overflow-hidden`}
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/${user?.profileImage}`}
            width={50}
            height={50}
            alt="logo"
            className="w-full h-full object-cover"
          />
        </figure>
      ) : (
        <span
          className={`bg-gray-200 dark:bg-gray-600 flex-shrink-0 dark:text-white ${className} flex items-center justify-center flex-shrink-0 rounded-full uppercase font-bold`}
        >
          {display}
        </span>
      )}
    </>
  );
};

export default Profile;
