import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { UserContext } from "../../authProvider/AuthProvider";
import ShowHidePass from "../../features/ShowHidePass";

const AdminLogin = () => {
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const axiosPublic = useAxiosPublic();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    setSubmitting(true);
    try {
      const response = await axiosPublic.put("/admin/login", { email, password });
      if (response?.data?.message) {
        const user = response?.data?.admin || null;

        if (!user) {
          toast.error("Invalid response from server!");
          return;
        }

        login(user);
        toast.success(response.data.message);
        e.target.reset();
        navigate("/dashboard/admin", { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
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
          <h4 className="page-heading mt-2">Admin sign in</h4>
          <p className="page-subheading">Restricted to administrator accounts</p>
        </div>

        <form onSubmit={handleAdminLogin} className="card-minimal space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-minimal">Email</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@example.com"
              className="input-minimal"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-minimal">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                required
                placeholder="Enter your password"
                className="input-minimal pr-10"
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
            {submitting ? "Signing in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;