import { useContext, useState } from "react";
import { toast } from "react-toastify"; import Swal from 'sweetalert2'
import useAxiosPublic from "../../../../Hooks/useAxiosPublic";
import { UserContext } from "../../../../authProvider/AuthProvider";

const SendMoney = () => {
  const [recipientPhone, setRecipientPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosPublic = useAxiosPublic();
  const { user } = useContext(UserContext);
  console.log('user in send money', user);

  const fee = amount > 100 ? 5 : 0;
  const totalDeduct = Number(amount) + fee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });

    try {
      const response = await axiosPublic.post("/user/send-money", {
        recipientPhone,
        amount: Number(amount),
        pin,
      });
      console.log('send money', response.data);

      if (response.data.success) {
        toast.success(`Successfully sent ৳${amount} to ${recipientPhone}!`);
        // Reset form
        setRecipientPhone("");
        setAmount("");
        setPin("");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Transaction failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const isDisabled = loading || !pin || !amount || amount < 50;

  return (
    <div className="flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-2">
          Send Money
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Send money securely to any user
        </p>

        {/* Fee Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
          <p className="font-medium text-blue-800">
            Transaction Fee: {fee > 0 ? "৳5.00 (for amount > ৳100)" : "Free (≤ ৳100)"}
          </p>
          <p className="text-blue-700 mt-1">
            Minimum amount: ৳50
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Recipient Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Receiver Mobile Number
            </label>
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (৳)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min 50)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="50"
              required
            />
          </div>

          {/* PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your 5-Digit PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="•••••"
              maxLength="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg tracking-wider"
              required
            />
          </div>

          {/* Total Deduction Preview */}
          {/* Total Deduction Preview */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between gap-4">

              {/* Left: Fixed Value */}
              <div className="w-1/2 bg-red-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">My Balance</p>
                <p className="text-2xl font-bold text-red-600">৳ 100</p>
              </div>

              {/* Right: Dynamic Value */}
              <div className="w-1/2 bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Total deducted</p>
                <p className="text-2xl font-bold text-red-600">
                  ৳{amount >= 50 ? totalDeduct : 0}
                </p>

                {amount >= 50 && fee > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    (Includes ৳5 fee)
                  </p>
                )}
              </div>

            </div>
          </div>


          {/* Submit Button */}
          <button
            type="submit"
            disabled={isDisabled}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all ${isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-secondary"
              }`}
          >
            {loading ? "Processing..." : "Send Money"}
          </button>

        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your transaction is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default SendMoney;