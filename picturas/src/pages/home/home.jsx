import { React, useState } from 'react';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NewProject from '../../components/new_project/new_project';
import NewProjectDetails from '../../components/new_project_details/new_project_details';
import { useSessionStore } from '../../stores/session_store';

const Home = () => {
    const { user_name } = useSessionStore();

    const [show_new_project, set_new_project] = useState(false);

    const toggleNewProject = () => {
        set_new_project(!show_new_project);
    };

    return (
        <div className='home-wrapper'>
            <Navbar />
            <main className='home-container'>
                <h1>Bem-vindo à PictuRAS !</h1>

                <section className='project-section'>
                    <NewProject onClick={toggleNewProject} />
                </section>

                {show_new_project && (
                    <NewProjectDetails onClose={toggleNewProject} />
                )}
            </main>
        </div>
    );
};

export default Home;
