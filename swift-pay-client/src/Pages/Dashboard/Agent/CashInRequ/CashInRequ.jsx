
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { UserContext } from "../../../../authProvider/AuthProvider";
import useAdmin from "../../../../Hooks/useAdmin";
import Loader from "../../../../components/common/Loader";
import ShowHidePass from "../../../../Features/ShowHidePass";

const CashInRequ = () => {
    const [open, setOpen] = useState(false)
    const [showPass, setShowPass] = useState(false);
    const [rotating, setRotating] = useState(false);
    const { admin, isLoading } = useAdmin()
    const axiosPublic = useAxiosPublic()
    const { user, loading } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const receiver = form.receiver.value;
        const amount = Number(form.amount.value);
        const password = form.password.value;
        // const transactionType = transactionTypes.CASH_IN
        try {
            const response = await axiosPublic.put("/agent/cash-in", {
                senderId: user._id,
                receiverId: receiver,
                amount,
                password
            });
            console.log('33', response?.data)

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

    if (isLoading || loading) return <Loader />
    return (
        <div className="w-full flex justify-center items-center mt-10">
            <form
                onSubmit={handleSubmit}
                className="md:w-1/2 bg-bg px-20 py-8 rounded-lg"
            >
                <h3 className="text-3xl text-center ">
                    <span className="text-primary"> Cash In </span>{" "} Request
                </h3>
                <p className="text-center">From Admin Only</p>
                <div className="form-control mt-5">
                    <label className="label">
                        <span className="label-text text-lg">Admin Number</span>
                    </label>
                    <input
                        name="receiver"
                        type="text"
                        value={admin?.userPhone}
                        readOnly
                        className="focus:outline-none px-4 py-3 bg-bg rounded-lg"
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-lg">Amount</span>
                    </label>
                    <input
                        name="amount"
                        value="100000"
                        className="focus:outline-none px-4 py-3 bg-bg  rounded-lg "
                        readOnly
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
                        value={"Cash in Request"}
                    />
                </div>
            </form>
        </div>
    );
};

export default CashInRequ;