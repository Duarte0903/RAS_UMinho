import { React, useState, useEffect } from 'react';
import './home.css';
import Navbar from '../../components/navbar/navbar';
import NewProject from '../../components/new_project/new_project';
import NewProjectDetails from '../../components/new_project_details/new_project_details';
import { useSessionStore } from '../../stores/session_store';
import axios from 'axios';
import ProjectCard from '../../components/project_card/project_card';

const Home = () => {
    const [show_new_project, set_new_project] = useState(false);
    const {token} = useSessionStore();
    const [userProjects, setUserProjects] = useState([]);
    const [projectId, setProjectId] = useState([]);
    const [newName, setNewName] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Para mostrar se está a enviar os dados

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

    const handleEditProject = () => {
        setIsModalOpen(true);  // Abre o modal para editar o perfil
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);  // Fecha o modal sem fazer nada
    };

    const onEdit = async () => {
        setLoading(true); // Define o estado de carregamento para true ao enviar a requisição
        console.log(`Editar projeto com ID: ${projectId}`);

        try {
            const response = await axios.put(
                `https://p.primecog.com/api/users/projects/${projectId}`,
                { name: newName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Se a resposta for bem-sucedida
            if (response.status === 200) {
                alert("Projeto atualizado com sucesso");

                // Fechar o modal após a atualização
                setIsModalOpen(false);
            } else {
                console.error('Erro ao editar o projeto:', response.message || response.error);
                alert("Erro ao editar o projeto. Tente novamente.");
            }
            window.location.reload();
        } catch (error) {
            console.error('Erro ao editar o projeto:', error.response?.data || error.message);
            alert('Erro ao editar projeto.');
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };
    
    const onDelete = async (projectId) => {
        console.log(`Apagar projeto com ID: ${projectId}`);
        // Implementar a lógica para apagar o projeto
        const confirmDelete = window.confirm(
            "Tem certeza de que deseja excluir este projeto? Esta ação não pode ser desfeita."
        );
    
        if (!confirmDelete) return;
    
        try {
            const response = await axios.delete(
                `https://p.primecog.com/api/users/projects/${projectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                alert("Projeto excluído com sucesso.");
                window.location.reload();
            } else {
                alert("Erro ao excluir o projeto. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao excluir projeto:", error);
            alert("Ocorreu um erro ao tentar excluir o projeto. Por favor, tente novamente mais tarde.");
        }
    };

    return (
        <div className='home-wrapper'>
            <Navbar />
            <main className='home-container'>
                <h1>Bem-vindo à PictuRAS !</h1>

                <section className="project-section">
                    {userProjects.length > 0 &&
                        userProjects.map((project) => (
                            <div key={project.id} className="project-card-container">
                                <ProjectCard
                                    id={project.id}
                                    projectName={project.name}
                                />
                                <div className="project-actions">
                                    <button 
                                        className="edit-button" 
                                        onClick={() => {
                                                setProjectId(project.id);
                                                handleEditProject();
                                            }
                                        } 
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        className="delete-button" 
                                        onClick={() => onDelete(project.id)}
                                    >
                                        Apagar
                                    </button>
                                </div>
                            </div>
                        ))
                    }
                    <NewProject onClick={toggleNewProject} />
                </section>

                {show_new_project && (
                    <NewProjectDetails onClose={toggleNewProject} />
                )}
            </main>

            {/* Modal de edição de projeto */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Editar Projeto</h4>
                        <label htmlFor="new-name">Nome</label>
                        <input
                            id="new-name"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Digite o novo nome do projeto"
                        />

                        <div className="modal-actions">
                            <button onClick={onEdit} disabled={loading}>
                                {loading ? "Aguarde..." : "Salvar"}
                            </button>
                            <button onClick={handleCloseModal}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
