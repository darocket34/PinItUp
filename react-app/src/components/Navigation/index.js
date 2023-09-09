import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import navLogo from '../../images/logo.jpg'
import './Navigation.css';


function Navigation({ isLoaded }){

	const sessionUser = useSelector(state => state.session.user);

	return (
		<div className='navbar master container'>
			<div className='navbar home logo link'>
				<NavLink exact to="/"><img className='navbar home logo image' src={navLogo} alt='PinItUp Logo' /></NavLink>
			</div>
			<div className="navbar links1">
				<p className='navbar link text'>Home</p>
				<p className='navbar link text'>Create</p>
			</div>
			<div className='navbar search container'>
				<input className='navbar search' placeholder='Search' />
				<button className='navbar search submit'><i className="fa-solid fa-magnifying-glass fa-xl"></i></button>
			</div>
			<div className="navbar links2">
				<p className='navbar link text'>Messages</p>
			</div>
			{isLoaded && (
				<div className='navbar menu button container'>
					<ProfileButton user={sessionUser} />
				</div>
			)}

		</div>
	);
}

export default Navigation;
