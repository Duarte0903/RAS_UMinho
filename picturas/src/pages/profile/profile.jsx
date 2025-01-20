import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Navbar from "../../components/navbar/navbar";
import { useSessionStore } from '../../stores/session_store';
import axios from "axios";

const Profile = () => {
    const { user_name, user_email, user_tier } = useSessionStore();
    const { token } = useSessionStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState(user_name);
    const [newEmail, setNewEmail] = useState(user_email);
    const [type, setType] = useState(user_tier);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false); // Para mostrar se está a enviar os dados
    const [isDeleted, setIsDeleted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isDeleted) return;

        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get('https://p.primecog.com/api/users/',
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setNewName(userResponse.data.user.name);
                setNewEmail(userResponse.data.user.email);
                setType(userResponse.data.user.type);
                
            } catch (error) {
                console.error('Error fetching user data: ', error);
            }
        };
    
        fetchUserData();
    }, [token, isDeleted]);

    const handleEditProfile = () => {
        setIsModalOpen(true);  // Abre o modal para editar o perfil
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita."
        );
    
        if (!confirmDelete) return;
    
        try {
            const response = await axios.delete(
                'https://p.primecog.com/api/users', 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                alert("Conta excluída com sucesso.");
                setIsDeleted(true);
                // Redirecionar para a página de registo
                navigate("/register");
            } else {
                alert("Erro ao excluir a conta. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro ao excluir conta:", error);
            alert("Ocorreu um erro ao tentar excluir sua conta. Por favor, tente novamente mais tarde.");
        }
    };    

    const handleProfileUpdate = async () => {
        setLoading(true); // Define o estado de carregamento para true ao enviar a requisição
        try {
            if (newPassword === confirmPassword) {
                const response = await axios.put(
                    "https://p.primecog.com/api/users",
                    {
                        name: newName,
                        email: newEmail,
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Se a resposta for bem-sucedida
                if (response.status === 200) {
                    alert("Perfil atualizado com sucesso");

                    // Fechar o modal após a atualização
                    setIsModalOpen(false);
                } else {
                    // Verificar se a resposta da API está presente no erro
                    if (error.response) {
                        // Verificar o código de status
                        if (error.response.status === 403) {
                            alert("A senha antiga está incorreta. Tente novamente.");
                        } else {
                            console.error("Erro ao atualizar perfil:", error.response.data);
                            alert("Houve um erro ao atualizar o perfil.");
                        }
                    } else {
                        console.error("Erro inesperado:", error);
                        alert("Houve um problema de conexão. Tente novamente mais tarde.");
                    }
                }
                window.location.reload();
            } else {
                alert("New Password does not match the confirmation!");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Houve um erro ao atualizar o perfil.");
        } finally {
            setLoading(false); // Finaliza o estado de carregamento
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);  // Fecha o modal sem fazer nada
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <h3>Perfil</h3>
                
                <div className="profile-info">
                    {[
                        { label: "Nome", value: newName },
                        { label: "Email", value: newEmail },
                        { label: "Tier", value: user_tier },
                    ].map((item, index) => (
                        <div className="profile-info-item" key={index}>
                            <h4>{item.label}</h4>
                            <p>{item.value || "Não disponível"}</p>
                        </div>
                    ))}
                </div>

                {/* Botões abaixo da informação do perfil */}
                <div className="profile-actions">
                    <button className="profile-button edit-button" onClick={handleEditProfile}>
                        Editar Perfil
                    </button>
                    <button className="profile-button delete-button" onClick={handleDeleteAccount}>
                        Apagar Conta
                    </button>
                </div>
            </div>

            {/* Modal de edição de perfil */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Editar Perfil</h4>
                        <label htmlFor="new-name">Nome</label>
                        <input
                            id="new-name"
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Digite seu novo nome"
                        />

                        <label htmlFor="new-email">Email</label>
                        <input
                            id="new-email"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Digite seu novo email"
                        />

                        <label htmlFor="old-password">Password Atual</label>
                        <input
                            id="old-password"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Digite sua nova senha"
                        />
                        
                        <label htmlFor="new-password">Nova Password</label>
                        <input
                            id="new-password"
                            type="password"
                            placeholder="Nova password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="register-input"
                            required
                        />
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Confirme a nova password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="register-input"
                            required
                        />

                        <div className="modal-actions">
                            <button onClick={handleProfileUpdate} disabled={loading}>
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

export default Profile;
