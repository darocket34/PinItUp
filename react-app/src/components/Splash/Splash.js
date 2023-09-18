import logo from "../../images/logo.jpg"
import LoginFormModal from "../LoginFormModal";
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function Splash() {
    return (
        <>
            <div className="top container">
                <img src={logo} alt="PinItUp Logo" style={{ width: '100px', height: '100px', alignSelf: 'center' }}></img>
                <h1 className="splash title">Welcome to PinitUp</h1>
            </div>
            <div className="bottom master">
                <h2>To get started</h2>
                <div className="bottom container">
                    <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                    />
                    <h2> or </h2>
                    <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                    />
                </div>
            </div>
        </>
    )
}

export default Splash;
