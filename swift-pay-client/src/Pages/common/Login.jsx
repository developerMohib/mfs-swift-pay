import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { UserContext } from "../../authProvider/AuthProvider";
import ShowHidePass from "../../features/ShowHidePass";

const Login = () => {
  const { login, setLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [showPass, setShowPass] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [demoCredentials, setDemoCredentials] = useState({
    phoneNumber: '',
    password: ''
  });
  const axiosPublic = useAxiosPublic();

  const handleDemoUserLogin = () => {
    setDemoCredentials({
      phoneNumber: 'demo@user.com',
      password: '12345'
    });
  }
  const handleDemoAdminLogin = () => {
    setDemoCredentials({
      phoneNumber: 'demo@admin.com',
      password: '12345'
    });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const phoneOrEmail = form.phoneNumber.value;
    const pin = form.password.value;
    const userData = { phoneOrEmail, pin };

    try {
      // Make the POST request to the server
      const response = await axiosPublic.post("/user/login", userData);
      // Check if the response is successful
      if (response?.data.success) {
        toast.success(response.data.message);
        const user = response.data.data.user;
        if (!user) {
          toast.error("Invalid response from server!");
          return;
        }

        // localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Call login function to set user state
        login(user);

        setLoading(false);
        form.reset();

        // Navigate user based on role
        if (user.userRole === "admin") {
          navigate("/dashboard/admin");
        } else if (user.userRole === "agent") {
          navigate("/dashboard/agent");
        } else {
          navigate("/dashboard/user"); // Default route
        }
        setLoading(false);
      }
    } catch (error) {
      // Handle errors (e.g., invalid credentials, server error)
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response?.data?.message);
      }
      console.error(error);
    }
  };

  const handleShowHidePass = () => {
    setShowPass(!showPass);
    setRotating(true);

    // Set a timeout to stop rotating after 400ms
    setTimeout(() => {
      setRotating(false);
    }, 400);
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="h-1/2 py-20 rounded-xl">
        <div className="md:flex gap-5 flex-row-reverse px-10 ">
          {/* Login about here */}
          <div className="text-center lg:text-left max-w-2xl mt-5">
            <div>
              <h1 className="md:text-5xl text-4xl font-bold mb-3">
                <span className="text-primary">swift</span>
                <span className="text-secondary">Pay</span>
              </h1>
              <h1 className="text-5xl font-bold">Login now!</h1>
              <p className="py-6 text-left">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
            </div>
            <div>
              <p>
                Dont have any account ?{" "}
                <Link
                  className="text-primary font-medium hover:border-b border-tarnary "
                  to={"/sign-up"}
                >
                  Register{" "}
                </Link>{" "}
              </p>
            </div>
          </div>

          {/* Login section here */}
          <div className="w-full max-w-xl mx-auto">
            {/* title */}
            <div>
              <p className="md:text-4xl text-2xl md:my-0 mt-8 font-semibold">
                Please !
              </p>
            </div>

            <form className="" onSubmit={handleLogin}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number / Email </span>
                </label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="phone number or email"
                  className="input input-bordered"
                  required
                  value={demoCredentials.phoneNumber}
                  onChange={(e) => setDemoCredentials({
                    ...demoCredentials,
                    phoneNumber: e.target.value
                  })}
                />
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  placeholder="password"
                  className="input input-bordered"
                  required
                  value={demoCredentials.password}
                  onChange={(e) => {
                    setDemoCredentials({
                      ...demoCredentials,
                      password: e.target.value
                    });
                    setOpen(e.target.value);
                  }}
                />
                {open && <ShowHidePass
                  showPass={showPass}
                  handleShowHidePass={handleShowHidePass}
                  rotating={rotating}
                />}
              </div>

              <div className="form-control mt-6">
                <button className="btn bg-primary hover:bg-secondary text-lg border-none text-black w-full">
                  Log in
                </button>
              </div>
            </form>
            <div className="mt-6 w-full">
              <button
                className="btn bg-primary hover:bg-secondary text-lg border-none text-black w-1/2"
                onClick={handleDemoUserLogin}
              >
                Demo User Login
              </button>
              <button
                className="btn bg-primary hover:bg-secondary text-lg border-none text-black w-1/2"
                onClick={handleDemoAdminLogin}
              >
                Demo Agent Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
