import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="navbar">
            <Link to="/home">
                <h3 className='nav-title'>PictuRAS</h3>
            </Link>

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