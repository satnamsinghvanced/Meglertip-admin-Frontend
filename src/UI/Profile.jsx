import image from "../../public/images/vector2.png"
const Profile = ({
  className = "md:h-10 h-8 md:w-10 w-8 text-sm md:text-base",
  user,
}) => {
  let display =
    user?.username
      ? `${user?.username?.slice(0, 1)}`
      : {image}


  return (
    <>
      {user?.avatar ? (
        <figure
          className={`${className} flex justify-center items-center flex-shrink-0 rounded-full overflow-hidden`}
        >
          <img
            src={`${import.meta.env.VITE_API_URL_IMAGE}/${user?.avatar}`}
            width={50}
            height={50}
            alt="logo"
            className="w-full h-full object-cover"
          />
        </figure>
      ) : (
        <img
            src={display}
            width={50}
            height={50}
            alt="logo"
            className="object-contain"
          />
      )}
    </>
  );
};

export default Profile;
