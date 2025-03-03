import Loader from "../../Components/Loader/Loader";
import useLoginUser from "../../Hooks/useSingleUser";

const Profile = () => {
  const data = localStorage.getItem("user");
  const user = JSON.parse(data);
  const id = user?._id
  const { loginUser, isLoading } = useLoginUser({ id })

  if (isLoading) <Loader />
  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-full max-w-sm bg-bg rounded-lg">
        <img
          className="w-40 h-40 rounded-full mx-auto"
          src={loginUser?.userPhoto ? loginUser?.userPhoto : "https://avatars.githubusercontent.com/u/92154638?v=4"}
          alt={loginUser?.userName}
        />
        <div className="flex flex-col items-center p-10">
          <h5 className="mb-1 text-xl font-medium uppercase ">
            {loginUser?.userName}
          </h5>
          <span className="text-lg "> {loginUser?.userPhone} </span>
          <span className="text-sm "> {loginUser?.userEmail} </span>
          <p className="text-sm rounded-lg px-3 py-1 font-bold capitalize">
            Account Type:{" "}
            {loginUser?.userRole === "user"
              ? "Personal"
              : loginUser?.status === "pending"
                ? "Pending"
                : loginUser?.userRole}
          </p>
          <div className="bg-bg px-7 py-3 text-center mt-5 ">
            <p className=""> Account Balance</p>
            <h1 className="text-3xl  ">{loginUser?.balance} </h1>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
