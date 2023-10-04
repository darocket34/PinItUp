import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { signUp } from "../../store/session";
import LoginFormModal from "../LoginFormModal";
import "./SignupForm.css";
import logo from "../../images/logo.jpg"
import { useHistory } from "react-router-dom";

function SignupFormModal() {
	const history = useHistory();
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [birthday, setBirthday] = useState("");
	const [url, setUrl] = useState("");
	const [profileImage, setProfileImage] = useState("");
	const [signUpForm, setSignUpForm] = useState(true)
  	const [loginForm, setLoginForm] = useState(false)
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState([]);
	const { closeModal } = useModal();

	const handleSubmit = async (e) => {
		e.preventDefault();
		let errObj = {}
		if (name.length < 3){
            errObj["Name"] = "Name: Field must be between 3 and 20 characters long.";
        };
        if (username.length < 3){
            errObj["Username"] = "Username: Field must be between 3 and 20 characters long.";
        };
		if (password.length < 6){
            errObj["Password"] = "Password: Field must be between 6 and 25 characters long.";
        };
		if (!url){
            errObj["Image"] = "Image: Please select an image";
        };
		if (password !== confirmPassword) {
			errObj["Password"] = "Password: Confirm Password field must be the same as the Password field";
		}
		if (Object.values(errObj).length === 0) {
			const reqObj = {
				name,
				email,
				username,
				password,
				url: url
			}
			const data = await dispatch(signUp(reqObj));
			const res = await data
			if (res) {
				setErrors(res.errors);
			} else {
				closeModal();
				history.push(`/home`);
			}
		} else {
			setErrors(errObj);
		}
	};

	return (
		<>
			{signUpForm && (
			<>
				<img src={logo} alt="PinItUp Logo" style={{ width: '40px', height: '40px', alignSelf: 'center' }}></img>
				<h1 className="login form title">Sign Up for PinItUp</h1>
				<form className='signup form modal' encType="multipart/form-data" onSubmit={handleSubmit}>
					<ul>
						{Object.values(errors).map((error, idx) => (
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
							type="email"
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
						<div className="signupform field">Profile Picture<p className="form required">*</p></div>
						<input
                                id="profilepage_editmode_image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setUrl(e.target.files[0])}
                                required
                            />
					</label>
					{/* <label>
						<div className="signupform field">Birthday</div>
						<input
							type="date"
							placeholder="Do you remember..?"
							value={birthday}
							onChange={(e) => setBirthday(e.target.value)}
						/>
					</label> */}
					<button className='signup form submit' type="submit">Sign Up</button>
				</form>
				<div className="login form signup link container">
					<p className="login form signup link">Already a member?</p>
					<p className="login form signup link bold"onClick={() => {
						setSignUpForm(false)
						setLoginForm(true)
					}}>Log in</p>
          		</div>
					<div className="signupform footer">By continuing, you agree to PinItUp's Non-existent Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection</div>
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
