import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../../stores/session_store';

const Navbar = () => {
    const { logout } = useSessionStore();
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

                <li className='nav-link'>
                    <Link to="/plan">
                        <img src="coin.png" className='nav-icon' />
                    </Link>
                </li>

                <li className='nav-link'>
                    <Link to="/" onClick={logout}>
                        <img src="logout.png" className='nav-icon' />
                    </Link>
                </li>
            </ul>
        </div>
    )
};

export default Navbar;