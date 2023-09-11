import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import LoginFormModal from "../LoginFormModal";
import "./SignupForm.css";
import logo from "../../images/logo.jpg"

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [signUpForm, setSignUpForm] = useState(true)
  	const [loginForm, setLoginForm] = useState(false)
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			const data = await dispatch(signUp(username, email, password));
			if (data) {
				setErrors(data);
			} else {
				closeModal();
			}
		} else {
			setErrors([
				"Confirm Password field must be the same as the Password field",
			]);
		}
	};

	return (
		<>
			{signUpForm && (
			<>
				<img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
				<h1 className="login form title">Sign Up for PinItUp</h1>
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
						Username
						<input
							type="text"
							placeholder="Ex. D.Brooks1"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
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
					<label>
						Confirm Password
						<input
							type="password"
							placeholder="Do you remember..?"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</label>
					<button className='login form submit' type="submit">Sign Up</button>
				</form>
				<div className="login form signup link container">
				<p className="login form signup link">Already a member?</p>
				<p className="login form signup link bold"onClick={() => {
					setSignUpForm(false)
					setLoginForm(true)
				}}>Log in</p>
          </div>
		  </>
		  )}
		  {loginForm && (
			<LoginFormModal />
		  )}
		</>
	);
}

export default SignupFormModal;
