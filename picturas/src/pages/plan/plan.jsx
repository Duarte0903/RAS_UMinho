import React from 'react';
import './plan.css';
import Navbar from '../../components/navbar/navbar';
import { useSessionStore } from '../../stores/session_store';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Plan = () => {
    const { user_tier, changePlan, changeSubs, subs_id, subs_type } = useSessionStore();
    const { token } = useSessionStore();
    let current_plan = "";
    let current_subs_type = "";

    if (user_tier === 'anonimo') current_plan = "Anónimo";
    else if (user_tier === 'gratuito') current_plan = "Grátis";
    else if (user_tier === 'premium') current_plan = "Premium";

    if (subs_type === 'monthly') current_subs_type = "Mensal";
    else if (subs_type === 'annual') current_subs_type = "Anual";

    const getSubsType = async () => {
        const response = await axios.get(
            'https://p.primecog.com/api/users/subscriptions',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        // Se a resposta for bem-sucedida
        if (response.status === 200 && response.data._id) {
            changeSubs(response.data._id, response.data.type, response.data.state);
        }
    };
    
    const handleChangePlan = async (plan, subs_type) => {
        try {
            if (user_tier === plan) {
                console.log("subs_id: ", subs_id);
                const response = await axios.put(
                    `https://p.primecog.com/api/users/subscriptions/${subs_id}`,
                    {
                        type: subs_type
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // Se a resposta for bem-sucedida
                if (response.status === 200) {
                    const subs = response.data.subscription;
                    changeSubs(subs._id, subs.type, subs.state); // Change subs in the store
                    alert(`Your plan has been changed to Premium ${subs.type}`);
                } else {
                    console.error("Erro:", error);
                    alert("Houve um erro ao atualizar o plano.");
                }
            
            } else {
                const response = await axios.put(
                    "https://p.primecog.com/api/users/type",
                    {
                        type: plan,
                        subs_type: subs_type
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                
                // Se a resposta for bem-sucedida
                if (response.status === 200) {
                    const { token, user } = response.data;
                    changePlan(user.type, token); // Change plan in the store
                    if(user.type === 'premium') {
                        getSubsType();
                    } else {
                        changeSubs('', '', '')
                    }
                    alert(`Your plan has been changed to ${user.type}`);
                } else {
                    console.error("Erro:", error);
                    alert("Houve um erro ao atualizar o plano.");
                }
            }
            window.location.reload();
        } catch (error) {
            console.error("Erro:", error);
            alert("Houve um erro ao atualizar o seu plano.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="user-plans-container">
                <div className="current-plan-section">
                    <h2>Plano atual: <span>{current_plan} {current_subs_type}</span></h2>
                    <p>É possível alterar o plano em qualquer altura.</p>
                </div>

                <div className="plans-section">
                    <h2>Escolha o seu plano</h2>
                    <div className="plans-grid">
                        <div className="plan-card">
                            <h3>Grátis</h3>
                            <p>Para utilizadores registados.</p>
                            <ul>
                                <li>Funcionalidades padrão</li>
                                <li>Acesso ilimitado a ferramentas básicas</li>
                            </ul>
                            {user_tier === 'anonimo' ? (
                                <Link to={'/register'} className="plan-button">
                                    Registe-se para escolher Grátis
                                </Link>
                            ) : (
                                <button
                                    className="plan-button"
                                    onClick={() => handleChangePlan('gratuito')}
                                    disabled={user_tier === 'gratuito'}>
                                    Escolher Grátis
                                </button>
                            )}
                        </div>

                        <div className="plan-card premium">
                            <h3>Premium</h3>
                            <p>Para utilizadores avançados.</p>
                            <ul>
                                <li>Desbloqueio de todas as funcionalidades</li>
                                <li>Experiência sem anúncios</li>
                                <li>Suporte prioritário</li>
                            </ul>
                            {user_tier === 'anonimo' ? (
                                <Link to={'/register'} className="plan-button">
                                    Registe-se para escolher Premium
                                </Link>
                            ) : (
                                <div>
                                    <button
                                        className="plan-button"
                                        onClick={() => handleChangePlan('premium', 'monthly')}
                                        disabled={user_tier === 'premium' && subs_type === 'monthly'}>
                                        Escolher Premium Mensal
                                    </button>
                                    <button
                                        className="plan-button"
                                        onClick={() => handleChangePlan('premium', 'annual')}
                                        disabled={user_tier === 'premium' && subs_type === 'annual'}>
                                        Escolher Premium Anual
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Plan;
