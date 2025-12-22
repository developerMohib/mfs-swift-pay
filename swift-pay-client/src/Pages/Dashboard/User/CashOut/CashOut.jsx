import { toast } from "react-toastify";
import { useState } from "react";
import useLoginUser from "../../../../Hooks/useSingleUser";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import Loader from "../../../../components/common/Loader";
import ShowHidePass from "../../../../Features/ShowHidePass";

const CashOut = () => {
  const [open, setOpen] = useState(false)
  const [showPass, setShowPass] = useState(false);
  const [rotating, setRotating] = useState(false);
  const data = localStorage.getItem("user");
  const user = JSON.parse(data);
  const id = user?._id
  const { loginUser, isLoading } = useLoginUser({ id })
  const senderId = loginUser?._id;
  const axiosPublic = useAxiosPublic();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const receiverId = form.receiver.value;
    const amount = Number(form.amount.value);
    const password = form.password.value;

    try {
      const response = await axiosPublic.put("/user/cash-out", {
        senderId,
        receiverId,
        amount,
        password
      });
      if (response?.data?.message) {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      console.log(error.response?.data?.message || "Transaction failed.");
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

  if (isLoading) return <Loader />;
  return (
    <div className="w-full flex justify-center items-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="md:w-1/2 bg-bg px-20 py-8 rounded-lg"
      >
        <h3 className="text-3xl text-center ">
          User <span className="text-primary">Cash Out </span>
        </h3>
        <div className="form-control mt-5">
          <label className="label">
            <span className="label-text text-lg">Agent Number</span>
          </label>
          <input
            name="receiver"
            type="text"
            placeholder="phone number"
            className="focus:outline-none px-4 py-3 bg-bg rounded-lg"
            required
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg">Amount</span>
          </label>
          <input
            name="amount"
            type="number"
            placeholder="Enter amount"
            className="focus:outline-none px-4 py-3 bg-bg  rounded-lg "
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
            className="focus:outline-none px-4 py-3 bg-bg rounded-lg "
            required
            onChange={(e) => setOpen(e.target.value)}
          />
          {open && <ShowHidePass
            showPass={showPass}
            handleShowHidePass={handleShowHidePass}
            rotating={rotating}
          />}

        </div>
        <div className="mt-5 flex justify-center w-full">
          <input
            type="submit"
            className="w-fit cursor-pointer focus:outline-none px-4 py-3 bg-secondary hover:bg-primary text-bg rounded-lg"
            value={"Cash out Request"}
          />
        </div>
      </form>
    </div>
  );
};

export default CashOut;
