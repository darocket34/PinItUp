import React, {useEffect, useState, useContext} from 'react';
import {PinSearchContext} from '../../context/PinSearch'
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import CreateButton from './CreateButton';
import navLogo from '../../images/logo.jpg'
import './Navigation.css';


function Navigation({ isLoaded }){
	const history = useHistory()
    const [searchDetails, setSearchDetails] = useState('')
	const sessionUser = useSelector(state => state.session.user);
	const {setSearchPins} = useContext(PinSearchContext)

	const handleFormSubmit = (e) => {
		if (!searchDetails.length){
			return
		} else {
			e.preventDefault()
			setSearchPins(searchDetails)
			history.push('/search')
			setSearchDetails('')
		}
	}

	return (
		<div className='navbar master container'>
			<div className='navbar home logo link'>
				<NavLink exact to="/home"><img className='navbar home logo image' src={navLogo} alt='PinItUp Logo' /></NavLink>
			</div>
			<div className="navbar links1">
				<NavLink exact to="/home" className='navbar link text'><p className='navbar link text'>Home</p></NavLink>
				<CreateButton user={sessionUser} />
			</div>
			<div className='navbar search container'>
				<form className='navbar search form' onSubmit={handleFormSubmit}>
					<div className='navbar search container'>
						<input className='navbar search' value={searchDetails} placeholder='Search' onChange={e => setSearchDetails(e.target.value)}/>
						<button className='navbar search submit' type='submit'><i className="fa-solid fa-magnifying-glass fa-xl"></i></button>
					</div>
				</form>
			</div>
			<div className="navbar links2">
				<p className='navbar link text messages'>Messages</p>
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
