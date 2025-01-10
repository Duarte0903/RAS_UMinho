import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../../stores/session_store';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login } = useSessionStore();

    const handleLogin = (event) => {
        event.preventDefault(); // Prevent page reload
        login(email, 'user_name', 'user_tier', 'user_id'); // Replace with actual login
    };

    const handleAnon = () => {
        login(null, 'Anónimo', 'anon', null);
    };

    return (
        <div className="login-container">
            <img src="logo.png" className="logo" alt="Logo" data-aos="fade-right" />
            <div className="login-content" data-aos="fade-left">
                <form className="login-form" onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="login-input"
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                        required
                    />
                    <button className="login-button" type="submit">Entrar</button>
                    
                    <div className="extra-options-container">
                        <Link to="/register" className="extra-option">Criar conta</Link>
                        <button className="extra-option" type="button" onClick={handleAnon}>
                            <Link to="/home">Continuar como anónimo</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
