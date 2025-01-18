import React from 'react';
import './project_card.css';
import { Link } from 'react-router-dom';

const ProjectCard = ({ onClick, projectName, id }) => {
    return (
        <Link to={`/project/${id}`} className='new-project-container' onClick={onClick}>
            <span className='new-project-text'>{projectName}</span>
        </Link>
    )
};

export default ProjectCard;