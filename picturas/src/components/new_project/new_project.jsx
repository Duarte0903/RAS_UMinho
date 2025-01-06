import React from 'react';
import './new_project.css';

const NewProject = () => {
    return (
        <button className='new-project-container'>
            <span className='plus-icon'>+</span>
            <span className='new-project-text'>Novo Projeto</span>
        </button>
    )
};

export default NewProject;