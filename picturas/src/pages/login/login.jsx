import React from 'react';
import './login.css';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="login-container">
            <img src="logo.png" className='logo' />
            <div className="login-content">
                <form className='login-form'>
                    <h2>Login</h2>
                    <input type="text" placeholder="Usuário" className='login-input' />
                    <input type="password" placeholder="Senha" className='login-input' />
                    <button className='login-button' type="submit">Entrar</button>
                    
                    <div className='extra-options-container'>
                        <button className='extra-option'>Criar conta</button> 
                        <button className='extra-option'>
                            <Link to="/home">Anónimo</Link>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )   
};

export default Login;