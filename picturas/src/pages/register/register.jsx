import React, { useState } from 'react';
import './register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent page reload
        if (password === confirmPassword) {
            try {
                const response = await axios.post('https://p.primecog.com/api/users', {
                    email,
                    name,
                    password,
                });
                alert('User registered successfully!');
                console.log(response.data);
                navigate("/")
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    // Check if the server returned additional error details
                    if (error.response.data && error.response.data.message) {
                        alert(`Failed to register user: ${error.response.data.message}`);
                    } else {
                        alert('Failed to register user: User already exists.');
                    }
                } else {
                    console.error('Error registering user:', error);
                    alert('An unexpected error occurred. Please try again.');
                }
            }
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
