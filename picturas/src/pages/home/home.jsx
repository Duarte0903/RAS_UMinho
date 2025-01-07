import React, { useState, useEffect } from 'react';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NewProject from '../../components/new_project/new_project';
import NewProjectDetails from '../../components/new_project_details/new_project_details';

const Home = () => {
    const [show_new_project, set_new_project] = useState(false);

    const showNewProject = () => {
        set_new_project(!show_new_project);
    };

    const closeNewProject = () => {
        set_new_project(false);
    };

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <h3>Bem vindo à PictuRAS</h3>

                <div className='project-container'>
                    <NewProject onClick={showNewProject} />
                </div>

                {show_new_project && <NewProjectDetails onClose={showNewProject} />}
            </div>
        </div>
    );
};

export default Home;
