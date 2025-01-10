import React from "react";
import "./profile.css";
import Navbar from "../../components/navbar/navbar";
import { useSessionStore } from '../../stores/session_store';

const Profile = () => {
    const { user_name, user_email, user_id, user_tier } = useSessionStore();

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <h3>Perfil</h3>
                
                <div className="profile-info">
                    {[
                        { label: "Nome", value: user_name },
                        { label: "Email", value: user_email },
                        { label: "ID", value: user_id },
                        { label: "Tier", value: user_tier },
                    ].map((item, index) => (
                        <div className="profile-info-item" key={index}>
                            <h4>{item.label}</h4>
                            <p>{item.value || "Não disponível"}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default Profile;