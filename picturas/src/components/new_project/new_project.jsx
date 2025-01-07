import React from 'react';
import './new_project.css';

const NewProject = ({ onClick }) => {
    return (
        <button className='new-project-container' onClick={onClick}>
            <span className='plus-icon'>+</span>
            <span className='new-project-text'>Novo Projeto</span>
        </button>
    )
};

export default NewProject;