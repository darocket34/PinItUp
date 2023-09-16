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
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [birthday, setBirthday] = useState("");
	const [profileImage, setProfileImage] = useState("");
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
							<li key={idx}>
								<p className="form required">
									{error}
								</p>
							</li>
						))}
					</ul>
					<label>
						<div className="signupform field">Name<p className="form required">*</p></div>
						<input
							type="text"
							placeholder="Darian Brooks"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</label>
					<label>
						<div className="signupform field">Email<p className="form required">*</p></div>
						<input
							type="text"
							placeholder="hello@world.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
					<label>
						<div className="signupform field">Username<p className="form required">*</p></div>
						<input
							type="text"
							placeholder="Ex. D.Brooks1"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</label>
					<label>
						<div className="signupform field">Password<p className="form required">*</p></div>
						<input
							type="password"
							placeholder="Shh.. it's a secret.."
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					<label>
						<div className="signupform field">Confirm Password<p className="form required">*</p></div>
						<input
							type="password"
							placeholder="Do you remember..?"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</label>
					<label>
						<div className="signupform field">Birthday</div>
						<input
							type="date"
							placeholder="Do you remember..?"
							value={birthday}
							onChange={(e) => setBirthday(e.target.value)}
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
					<div className="signupform footer">By continuing, you agree to PinItUp's <span style={{fontStyle: 'italic'}}>Non-existent</span> Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection</div>
					<div className="signupform footer"><p className="form required">*</p>Required</div>
		  </>
		  )}
		  {loginForm && (
			<LoginFormModal />
		  )}
		</>
	);
}

export default SignupFormModal;
