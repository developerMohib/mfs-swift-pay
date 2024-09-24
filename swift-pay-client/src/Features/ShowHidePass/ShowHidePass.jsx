import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import PropTypes from 'prop-types';

const ShowHidePass = ({ showPass, handleShowHidePass, rotating }) => {
  return (
    <span onClick={handleShowHidePass} className="absolute right-2 bottom-3 cursor-pointer">
      {showPass ? (
        <IoEyeOutline
          className={`text-2xl ${rotating ? "animate-spin" : " "}`}
        />
      ) : (
        <IoEyeOffOutline
          className={`text-2xl ${rotating ? "animate-spin" : " "}`}
        />
      )}
    </span>
  );
};
ShowHidePass.propTypes = {
    showPass: PropTypes.bool,
    handleShowHidePass: PropTypes.func,
    rotating: PropTypes.bool,
}

export default ShowHidePass;
