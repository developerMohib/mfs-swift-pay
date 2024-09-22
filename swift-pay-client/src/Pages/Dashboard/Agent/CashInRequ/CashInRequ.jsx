import TransitionHeader from "../../../../Components/Transition/TransitionHeader";
import TransitionRow from "../../../../Components/Transition/TransitionRow";

const CashInRequ = () => {
    return (
        <div className="overflow-x-auto w-full px-2 py-5">
            <h3 className='text-xl mb-3'>Manage <span className="text-primary">User Cashin</span> </h3>
            <table className="table table-zebra outline outline-[1px] outline-base-200 shadow">
                <TransitionHeader />
                <tbody>
                    <TransitionRow />
                </tbody>
            </table>
        </div>
    );
};

export default CashInRequ;