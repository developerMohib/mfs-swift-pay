import { useState } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import ShowHidePass from "../../Features/ShowHidePass/ShowHidePass";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [rotating, setRotating] = useState(false);
  const axiosPublic = useAxiosPublic();

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const phoneOrEmail = form.phoneNumber.value;
    const password = form.password.value;
    const userData = { phoneOrEmail, password };

    axiosPublic.get("/loginUser", userData);
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
      <div className="bg-base-200 shadow-lg h-1/2 py-20 rounded-xl">
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
          <div className=" w-full max-w-xl ">
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
                />
                <ShowHidePass
                  showPass={showPass}
                  handleShowHidePass={handleShowHidePass}
                  rotating={rotating}
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn bg-primary hover:bg-secondary text-lg border-none text-white w-full">
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
