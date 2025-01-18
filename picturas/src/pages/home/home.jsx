import { React, useState, useEffect } from 'react';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NewProject from '../../components/new_project/new_project';
import NewProjectDetails from '../../components/new_project_details/new_project_details';
import { useSessionStore } from '../../stores/session_store';
import axios from 'axios';
import ProjectCard from '../../components/project_card/project_card';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [show_new_project, set_new_project] = useState(false);
    const {token} = useSessionStore();
    const [userProjects, setUserProjects] = useState([]);
    const navigate = useNavigate();

    const toggleNewProject = () => {
        set_new_project(!show_new_project);
    };

    const fetchProjectData = async () => {
        try {
            const response = await axios.get('https://p.primecog.com/api/users/projects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserProjects(response.data.projects);
        } catch (error) {
            console.error("Error fetching project data", error);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, []);

    return (
        <div className='home-wrapper'>
            <Navbar />
            <main className='home-container'>
                <h1>Bem-vindo à PictuRAS !</h1>

                <section className='project-section'>
                    {userProjects.length > 0 && (
                            userProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    id={project.id}
                                    projectName={project.name}
                                />
                            ))
                        )}
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
