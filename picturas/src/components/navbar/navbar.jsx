import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar">
            <h3 className='nav-title'>PictuRAS</h3>

            <ul className="nav-links">
                <li className='nav-link'>
                    <Link to="/profile">
                        <img src="profile-user.png" className='nav-icon' />
                    </Link>
                </li>
            </ul>
        </div>
    )
};

export default Navbar;