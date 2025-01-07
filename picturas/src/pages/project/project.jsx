import React, { useState } from "react";
import './project.css';
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";

const Project = () => {
    const location = useLocation();
    const { projectName, images } = location.state || {};

    const [currentImage, setCurrentImage] = useState(0);

    const imageUrl = images && images[currentImage] ? URL.createObjectURL(images[currentImage]) : null;

    // ferramentas
    const [dimensions, setDimensions] = useState('');
    const [removeBackground, setRemoveBackground] = useState(false);
    const [binarize, setBinarize] = useState(false);
    const [rotate, setRotate] = useState(0);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(100);

    const handleDimensionChange = (event) => {
        setDimensions(event.target.value);
    };

    const handleRemoveBackgroundChange = () => {
        setRemoveBackground(prevState => !prevState);
    };

    const handleBinarizeChange = () => {
        setBinarize(prevState => !prevState);
    };

    const handleRotationChange = (event) => {
        setRotate(event.target.value);
    };

    const handleBrightnessChange = (event) => {
        setBrightness(event.target.value);
    };

    const handleContrastChange = (event) => {
        setContrast(event.target.value);
    }

    const handleReset = () => {
        setDimensions('');
        setRemoveBackground(false);
        setBinarize(false);
        setRotate(0);
        setBrightness(0);
        setContrast(100);
    };

    return (
        <div>
            <Navbar />
            <div className="project-container">
                <div className="tools-sidebar">
                    <h3>{projectName}</h3>

                    <div className="basic-tools-container">
                        <h4>Ferramentas básicas</h4>

                        <ul className="tools-list">
                            <li>
                                <label htmlFor="dimensions">Dimensões (altura x largura): </label>
                                <input
                                    type="text"
                                    value={dimensions}
                                    onChange={handleDimensionChange}
                                    placeholder="e.g. 300x300"
                                />
                            </li>

                            <li>
                                <label htmlFor="removeBackground">Remover de fundo</label>
                                <input
                                    type="checkbox"
                                    checked={removeBackground}
                                    onChange={handleRemoveBackgroundChange}
                                />
                            </li>

                            <li>
                                <label htmlFor="binarize">Binarização</label>
                                <input
                                    type="checkbox"
                                    checked={binarize}
                                    onChange={handleBinarizeChange}
                                />
                            </li>

                            <li>
                                <label>Rodar</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={rotate}
                                    onChange={handleRotationChange}
                                />
                            </li>

                            <li>
                                <label>Brilho</label>
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={brightness}
                                    onChange={handleBrightnessChange}
                                />
                            </li>

                            <li>
                                <label>Contraste</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="200"
                                    value={contrast}
                                    onChange={handleContrastChange}
                                />
                            </li>
                        </ul>
                    </div>

                    <div className="advanced-tools-container">
                        <h4>Ferramentas avançadas</h4>
                    </div>

                    <div className="buttons-container">
                        <button className="apply-button">Aplicar</button>
                        <button className="save-button">Guardar</button>
                        <button className="reset-button" onClick={handleReset}>
                            Reset
                        </button>
                    </div>
                </div>

                <div className="images-container">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="project"
                            className="current-image"
                            style={{
                                transform: `rotate(${rotate}deg)`,
                                filter: `brightness(${Math.min(Math.max(100 + brightness, 0), 200)}%) contrast(${Math.min(Math.max(contrast, 0), 200)}%)`,
                            }}
                        />
                    )}

                    {images.length > 1 && (<div className="image-buttons">
                        <button
                            onClick={() => setCurrentImage((currentImage + images.length - 1) % images.length)}>
                            Anterior
                        </button>

                        <button
                            onClick={() => setCurrentImage((currentImage + 1) % images.length)}>
                            Próxima
                        </button>
                    </div>)}
                </div>
            </div>
        </div>
    );
};

export default Project;
