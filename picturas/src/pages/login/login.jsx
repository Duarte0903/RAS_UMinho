import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useSessionStore } from '../../stores/session_store';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useSessionStore();
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://p.primecog.com/api/users/authenticate', { email, password });
            const { token, user } = response.data;

            login(user.email, user.name, user.type, user.id, token);

            console.log('login successfull', email, token);

            navigate('/home');
            console.log('Navigating to /home');
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;

                if (data && data.message) {
                    alert(`Login failed: ${data.message}`);
                } else if (status === 401) {
                    alert('Invalid credentials. Please try again.');
                } else {
                    alert('An unexpected error occurred. Please try again later.');
                }
            } else {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again later.');
            }
        }
    };

    const handleAnon = async () => {
        try {
            const anonResponse = await axios.post('https://p.primecog.com/api/users/authenticate/anonimo')
            console.log(anonResponse.data);
            const { token, user } = anonResponse.data;
            login(user.email, user.name, user.type, user.id, token);
            navigate('/home');
        } catch (error) {
            console.log(error)
        }
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
                            Continuar como anónimo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
