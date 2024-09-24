import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import PropTypes from 'prop-types';

const ShowHidePass = ({ showPass, handleShowHidePass, rotating }) => {
  return (
    <button onClick={handleShowHidePass} className="absolute right-2 bottom-3">
      {showPass ? (
        <IoEyeOutline
          className={`text-2xl ${rotating ? "animate-spin" : " "}`}
        />
      ) : (
        <IoEyeOffOutline
          className={`text-2xl ${rotating ? "animate-spin" : " "}`}
        />
      )}
    </button>
  );
};
ShowHidePass.propTypes = {
    showPass: PropTypes.bool,
    handleShowHidePass: PropTypes.func,
    rotating: PropTypes.bool,
}

export default ShowHidePass;
