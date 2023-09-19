import React, { useEffect, useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import {useHistory} from "react-router-dom";
import logo from "../../images/logo.jpg";
import SignupFormModal from "../SignupFormModal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signup, setSignUp] = useState(false)
  const [loginForm, setLoginForm] = useState(true)
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal();
        history.push('/home');
    }
  };

  const demoLogin = async (e) => {
      e.preventDefault();
      const res = await dispatch(login("demo@aa.io", "password"));
      if (res) {
        setErrors(res);
      } else {
        closeModal();
        history.push('/home');
    }
  };



  return (
    <>
      {loginForm && (
        <>
          <img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
          <h1 className="login form title">Log In to PinItUp</h1>
          <form className='login form modal' onSubmit={handleSubmit}>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
            <label>
              Email
              <input
                type="text"
                placeholder="hello@world.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Shh.. it's a secret.."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <button className="login form submit" type="submit">Log In</button>
          </form>
          <p className="login form option">Or</p>
          <button className="login form demo user" type="submit" onClick={demoLogin}>Login as Demo User</button>
          <div className="login form signup link container">
            <p className="login form signup link">Not a member yet?</p>
            <p className="login form signup link bold"onClick={() => {
              setLoginForm(false)
              setSignUp(true)
            }}>Sign Up</p>
          </div>
        </>
      )}
      {signup && (
        <SignupFormModal />
      )}
    </>
  );
}

export default LoginFormModal;
