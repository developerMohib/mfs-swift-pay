const CashOut = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const receiver = form.receiver.value;
    const amount = Number(form.amount.value);
    const password = form.password.value;
    // const transactionType = transactionTypes.CASH_OUT

    const data = { receiver, amount, password };
    console.log(data);
  };
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
        <div className="form-control">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="password"
            className="focus:outline-none px-4 py-3 bg-bg  rounded-lg "
            required
          />
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
