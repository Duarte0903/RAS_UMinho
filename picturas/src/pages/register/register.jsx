import React, { useState } from 'react';
import './register.css';
import { Link } from 'react-router-dom';
import { useSessionStore } from '../../stores/session_store';

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = (event) => {
        event.preventDefault(); // Prevent page reload
        if (password === confirmPassword) {
            // register user in the db
        } else {
            alert("Passwords do not match!");
        }
    };

    return (
        <div className="register-container">
            <img src="logo.png" className="logo" alt="Logo" data-aos="fade-right" />
            <div className="register-content" data-aos="fade-left">
                <form className="register-form" onSubmit={handleRegister}>
                    <h2>Criar Conta</h2>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="register-input"
                        required
                    />
                    <label htmlFor="name">Nome</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="register-input"
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="register-input"
                        required
                    />
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="register-input"
                        required
                    />
                    <button className="register-button" type="submit">Criar Conta</button>

                    <div className="extra-options-container">
                        <Link to="/" className="extra-option">Já tem uma conta? Entrar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
