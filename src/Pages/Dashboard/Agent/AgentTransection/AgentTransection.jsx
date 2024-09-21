import TransitionHeader from "../../../../Components/Transition/TransitionHeader";
import TransitionRow from "../../../../Components/Transition/TransitionRow";

const AgentTransection = () => {
    return (
        <div className="overflow-x-auto w-full px-2 py-5">
            <h3 className='text-xl mb-3'>Agent <span className="text-primary">Transactions</span></h3>
            <table className="table table-zebra outline outline-[1px] outline-base-200 shadow">
                <TransitionHeader />
                <tbody>
                    {
                        [0, 1, 2].map(item => <TransitionRow key={item} />)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default AgentTransection;