import PropTypes from "prop-types";

const statusStyles = {
    pending: "bg-base-200",
    success: "bg-green-100 text-green-600",
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-50 text-red-500",
    failed: "bg-red-50 text-red-500",
};

const TransitionRow = ({ index, transaction, showActions, onApprove, onReject }) => {
    if (!transaction) return null;

    const { sender, receiver, amount, type, status } = transaction;

    return (
        <tr>
            <th>{index}</th>
            <td>
                <h4>{sender?.userName || "N/A"}</h4>
                <p className="text-xs text-base-content/60">{sender?.userPhone || ""}</p>
            </td>
            <td>
                <h4>{receiver?.userName || "N/A"}</h4>
                <p className="text-xs text-base-content/60">{receiver?.userPhone || ""}</p>
            </td>
            <td>{amount ?? "N/A"}</td>
            <td className="capitalize">{type || "N/A"}</td>
            <td>
                <span className={`px-2 py-1 rounded-full capitalize text-sm ${statusStyles[status] || "bg-base-200"}`}>
                    {status}
                </span>
            </td>
            {showActions && (
                <td className="flex gap-2 items-center">
                    <button
                        onClick={() => onApprove?.(transaction._id)}
                        className="px-2 py-1 rounded-lg bg-blue-100 text-blue-500"
                    >
                        Approve
                    </button>
                    <button
                        onClick={() => onReject?.(transaction._id)}
                        className="px-2 py-1 rounded-lg bg-red-100 text-red-500"
                    >
                        Reject
                    </button>
                </td>
            )}
        </tr>
    );
};

TransitionRow.propTypes = {
    index: PropTypes.number,
    transaction: PropTypes.object,
    showActions: PropTypes.bool,
    onApprove: PropTypes.func,
    onReject: PropTypes.func,
};

export default TransitionRow;