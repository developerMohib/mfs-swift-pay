import { use } from "react";
import useLoginUser from "../../Hooks/useSingleUser";
import Loader from "../Loader/Loader";

const TransitionHeader = () => {
    const data = localStorage.getItem("user");
    const user = JSON.parse(data);
    const { isLoading } = useLoginUser({ id: user?.id });
    if (isLoading) return <Loader />;
    const role = user?.userRole;
    return (
        <thead>
            <tr>
                <th></th>
                <th>Sender </th>
                <th>Receiver</th>
                <th>Amount</th>
                <th>Transaction Type</th>
                <th>Status</th>
                {role == 'agent' && <th>Action</th>}
            </tr>
        </thead>
    );
};

export default TransitionHeader;