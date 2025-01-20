import React from 'react';
import './plan.css';
import Navbar from '../../components/navbar/navbar';
import { useSessionStore } from '../../stores/session_store';
import { Link } from 'react-router-dom';

const Plan = () => {
    const { user_tier, changePlan } = useSessionStore();
    const { token } = useSessionStore();
    let current_plan = "";
    if (user_tier === 'anon') current_plan = "Anónimo";
    else if (user_tier === 'free') current_plan = "Grátis";
    else if (user_tier === 'premium') current_plan = "Premium";

    const handleChangePlan = async (plan, subs_type="monthly") => {
        console.log(token);

        try {
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
                changePlan(plan); // Change plan in the store
                alert(`Your plan has been changed to ${plan}`);
            } else {
                console.error("Erro:", error);
                alert("Houve um erro ao atualizar o plano.");
            }
            window.location.reload();
        } catch (error) {
            console.error("Erro:", error);
            alert("Houve um erro ao atualizar o plano.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="user-plans-container">
                <div className="current-plan-section">
                    <h2>Plano atual: <span>{current_plan}</span></h2>
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
                            {user_tier === 'anon' ? (
                                <Link to={'/register'} className="plan-button">
                                    Registe-se para escolher Grátis
                                </Link>
                            ) : (
                                <button
                                    className="plan-button"
                                    onClick={() => handleChangePlan('gratuito')}
                                    disabled={user_tier === 'free'}>
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
                            {user_tier === 'anon' ? (
                                <Link to={'/register'} className="plan-button">
                                    Registe-se para escolher Premium
                                </Link>
                            ) : (
                                <div>
                                    <button
                                        className="plan-button"
                                        onClick={() => handleChangePlan('premium', 'monthly')}
                                        disabled={user_tier === 'premium'}>
                                        Escolher Premium Mensal
                                    </button>
                                    <button
                                        className="plan-button"
                                        onClick={() => handleChangePlan('premium', 'annual')}
                                        disabled={user_tier === 'premium'}>
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
