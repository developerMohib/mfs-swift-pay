import { Link } from "react-router-dom";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [showPass, setShowPass] = useState(false);
  const axiosPublic = useAxiosPublic();
  const status = "pending";
  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;

    const userName = form.fullName.value;
    const userPhone = form.phoneNumber.value;
    const userEmail = form.email.value;
    const userNID = form.nid.value;
    const userRole = form.accountType.value;
    const password = form.password.value;
    const userData = {
      userName,
      userPhone,
      userEmail,
      userNID,
      userRole,
      password,
      status,
    };

    try {
      // create user
      const response = await axiosPublic.post("/users", userData);
      console.log('res',response.data.message)

      if(response?.data?.message){
        toast.success("Account created successfully!");
        toast.warn("wait for admin aproval !");
        form.reset()
      }

      
    } catch (error) {
      if (error.response && error.response.data.error) {
        toast.error(`Error: ${error.response.data.error}`); // Display backend error message (e.g., "Email already in use")
      } else {
        toast.error("Something went wrong. Please try again."); // General error message
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-base-200 shadow-lg h-1/2 py-10 rounded-xl">
        <div className="md:flex gap-x-10 px-10 py-5 ">
          {/* About sign up */}
          <div className="text-center lg:text-left max-w-2xl mt-5">
            <div>
              <h1 className="md:text-5xl text-3xl font-bold mb-3">
                <span className="text-primary">swift</span>
                <span className="text-secondary">Pay</span>
              </h1>
              <h1 className="md:text-5xl text-3xl text-tarnary font-bold">
                Register now!
              </h1>
              <p className="py-6 text-left ">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>
            </div>

            <div>
              <p>
                Already have an account ?{" "}
                <Link
                  className="text-primary font-medium hover:border-b border-tarnary "
                  to={"/sign-in"}
                >
                  Log in{" "}
                </Link>
              </p>
            </div>
          </div>

          {/* Form Here, For Data Collection */}
          <div className="w-full max-w-xl ">
            <div>
              <p className="md:text-4xl text-2xl md:my-0 mt-8 font-semibold">
                Drop Your Necessary Info
              </p>
            </div>
            <form
              onSubmit={handleRegister}
              className="md:grid grid-cols-2 gap-x-5"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  name="fullName"
                  required
                  type="text"
                  placeholder="full name"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  name="phoneNumber"
                  type="text"
                  placeholder="phone nubmer"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">NID</span>
                </label>
                <input
                  name="nid"
                  type="text"
                  placeholder="nid"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Account Type</span>
                </label>
                <select
                  name="accountType"
                  className="select select-bordered w-full max-w-xs"
                >
                  <option defaultValue>Select account Type</option>
                  <option>User</option>
                  <option>Agent</option>
                </select>
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
                <span
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 bottom-3 cursor-pointer"
                >
                  hh
                </span>
              </div>

              <div className="form-control mt-4 col-span-2 flex justify-center items-center">
                <button className="btn bg-primary hover:bg-secondary text-lg border-none text-white w-full">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
