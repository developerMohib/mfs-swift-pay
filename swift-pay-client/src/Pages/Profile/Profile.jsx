const Profile = () => {
  const data = localStorage.getItem("user");
  const user = JSON.parse(data);
  console.log("user", user);
  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-full max-w-sm bg-purple-50 rounded-lg">
        <img
          className="w-40 h-40 rounded-full mx-auto"
          src={user?.userPhoto}
          alt={user?.userName}
        />
        <div className="flex flex-col items-center p-10">
          <h5 className="mb-1 text-xl font-medium uppercase ">
            {user?.userName}
          </h5>
          <span className="text-lg "> {user?.userPhone} </span>
          <span className="text-sm "> {user?.userEmail} </span>
          <p className="text-sm rounded-lg px-3 py-1 font-bold">
            {" "}
            Role : {user?.userRole}
          </p>
          <div className="bg-white px-7 py-3 text-center mt-5 ">
            <p className=""> Account Balance</p>
            <h1 className="text-3xl  ">12000 </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
