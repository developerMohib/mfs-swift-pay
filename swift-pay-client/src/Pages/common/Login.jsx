import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { UserContext } from "../../authProvider/AuthProvider";
import ShowHidePass from "../../features/ShowHidePass";

const Login = () => {
  const { login, setLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const axiosPublic = useAxiosPublic();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const phoneOrEmail = form.phoneNumber.value;
    const pin = form.password.value;
    const userData = { phoneOrEmail, pin };

    setSubmitting(true);
    try {
      const response = await axiosPublic.post("/auth/login", userData);
      if (response?.data.success) {
        const user = response.data.data.user;
        if (!user) {
          toast.error("Login failed - please try again");
          return;
        }

        // Put the account into context immediately so the rest of the
        // app (navbar, dashboards, balance checks) knows who's signed in.
        login(user);
        toast.success(response.data.message);
        form.reset();

        if (user.userRole === "admin") {
          navigate("/dashboard/admin");
        } else if (user.userRole === "agent") {
          navigate("/dashboard/agent");
        } else if (user.userRole === "user") {
          navigate("/dashboard/user");
        } else {
          navigate("/");
          toast.error("Invalid user role");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-primary">swift</span>
            <span className="text-secondary">Pay</span>
          </h1>
          <p className="page-subheading">Log in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="card-minimal space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-minimal">Phone number or email</span>
            </label>
            <input
              name="phoneNumber"
              type="text"
              placeholder="e.g. 017XXXXXXXX or you@example.com"
              className="input-minimal"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-minimal">PIN / Password</span>
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Enter your PIN"
                className="input-minimal pr-10"
                required
              />
              <ShowHidePass
                showPass={showPass}
                handleShowHidePass={() => setShowPass(!showPass)}
                rotating={false}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary-minimal w-full mt-2"
          >
            {submitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-base-content/70">
          Don&apos;t have an account?{" "}
          <Link className="text-primary font-medium hover:underline" to="/sign-up">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;