import React from 'react';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NewProject from '../../components/new_project/new_project';

const Home = () => {
    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <h3>Bem vindo à PictuRAS</h3>

                <div className='project-container'>
                    <NewProject />
                </div>
            </div>
        </div>
    )
};

export default Home;