import React, { useState, useRef, useEffect } from "react";
import './project.css';
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import JSZip from 'jszip';
import ProjectAddImage from "../../components/project_add_image/project_add_image";

const Project = () => {
    const location = useLocation();
    const { projectName: initialProjectName, images: initialImages } = location.state || {};
    const [images, setImages] = useState(initialImages || []);

    const [currentImage, setCurrentImage] = useState(0);

    const imageUrl = images && images[currentImage] ? URL.createObjectURL(images[currentImage]) : null;

    const [showAdvancedTools, setShowAdvancedTools] = useState(false);
    const [showBasicTools, setShowBasicTools] = useState(true);

    const [isDownloading, setIsDownloading] = useState(false);

    const [showAddImage, setShowAddImage] = useState(false);

    const [projectName, setProjectName] = useState(initialProjectName || "Untitled Project");
    const [isEditingName, setIsEditingName] = useState(false);

    const handleNameEdit = () => {
        setIsEditingName(true);
    };

    const handleImagesUploaded = (newImages) => {
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    // ferramentas
    const [dimensions, setDimensions] = useState('');
    const [removeBackground, setRemoveBackground] = useState(false);
    const [binarize, setBinarize] = useState(false);
    const [rotate, setRotate] = useState(0);
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(100);

    const [imgWidth, setImgWidth] = useState('auto');
    const [imgHeight, setImgHeight] = useState('auto');
    const [originalWidth, setOriginalWidth] = useState(null);
    const [originalHeight, setOriginalHeight] = useState(null);
    const imageRef = useRef(null);

    useEffect(() => {
        if (imageRef.current) {
            setOriginalWidth(imageRef.current.naturalWidth);
            setOriginalHeight(imageRef.current.naturalHeight);
        }
    }, [currentImage]);

    const handleDimensionChange = (event) => {
        setDimensions(event.target.value);
        const [width, height] = event.target.value.split('x').map((val) => parseInt(val));
        setImgWidth(width);
        setImgHeight(height)
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
        setImgWidth('auto');
        setImgHeight('auto');
        setRemoveBackground(false);
        setBinarize(false);
        setRotate(0);
        setBrightness(0);
        setContrast(100);
    };

    const handleDownload = async () => {
        if (!images || images.length === 0) {
            console.error('No images to download');
            return;
        }
    
        try {
            // unica imagem 
            if (images.length === 1) {
                const imageBlob = images[0];
                const imageUrl = URL.createObjectURL(imageBlob);
                
                const link = document.createElement('a');
                link.href = imageUrl;
                
                const fileExtension = imageBlob.type.split('/')[1] || 'png';
                link.download = `${projectName || 'image'}.${fileExtension}`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(imageUrl);
            }
            // multiplas imagens - download zip
            else {
                const zip = new JSZip();
                
                images.forEach((imageBlob, index) => {
                    const fileExtension = imageBlob.type.split('/')[1] || 'png';
                    const fileName = `${projectName || 'image'}_${index + 1}.${fileExtension}`;
                    zip.file(fileName, imageBlob);
                });
                
                const zipBlob = await zip.generateAsync({ type: 'blob' });
                const zipUrl = URL.createObjectURL(zipBlob);
                
                const link = document.createElement('a');
                link.href = zipUrl;
                link.download = `${projectName || 'images'}.zip`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                URL.revokeObjectURL(zipUrl);
            }
        } catch (error) {
            console.error('Error downloading images:', error);
            alert('Error no download');
        }
    };

    const handleCurrentImageDelete = () => {
        setImages(prevImages => prevImages.filter((_, index) => index !== currentImage));
        setCurrentImage(0);
    }

    return (
        <div>
            <Navbar />
            <div className="project-container">
                <div className="tools-sidebar">
                    <div className="project-name-container">
                        {isEditingName ? (
                            <input
                                type="text"
                                defaultValue={projectName}
                                onBlur={(e) => {
                                    setProjectName(e.target.value);
                                    setIsEditingName(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setProjectName(e.target.value);
                                        setIsEditingName(false);
                                    }
                                }}
                                autoFocus
                                className="project-name-input"
                            />
                        ) : (
                            <h3
                                className="project-name"
                                onMouseEnter={() => setIsEditingName(false)}
                            >
                                {projectName}
                                
                                <img src="pencil.png" className="edit-icon" onClick={handleNameEdit} />
                            </h3>
                        )}
                    </div>

                    <div className="tools-buttons">
                        <button
                            className={showBasicTools ? 'active' : ''}
                            onClick={() => {
                                setShowBasicTools(true);
                                setShowAdvancedTools(false);
                            }}
                        > Ferramentas básicas
                        </button>

                        <button
                            className={showAdvancedTools ? 'active' : ''}
                            onClick={() => {
                                setShowBasicTools(false);
                                setShowAdvancedTools(true);
                            }}
                        > Ferramentas avançadas
                        </button>
                    </div>

                    {showBasicTools && (
                    <div className="basic-tools-container">
                        <ul className="tools-list">
                            <li>
                                <label htmlFor="dimensions">Dimensões (altura x largura): </label>
                                <input
                                    type="text"
                                    id="dimensions"
                                    value={dimensions}
                                    onChange={handleDimensionChange}
                                    placeholder="e.g. 300x300"
                                />
                            </li>

                            <li>
                                <label htmlFor="removeBackground">Remover de fundo</label>
                                <input
                                    type="checkbox"
                                    id="removeBackground"
                                    checked={removeBackground}
                                    onChange={handleRemoveBackgroundChange}
                                />
                            </li>

                            <li>
                                <label htmlFor="binarize">Binarização</label>
                                <input
                                    type="checkbox"
                                    id="binarize"
                                    checked={binarize}
                                    onChange={handleBinarizeChange}
                                />
                            </li>

                            <li>
                                <label htmlFor="rotate">Rodar</label>
                                <input
                                    type="range"
                                    id="rotate"
                                    min="0"
                                    max="360"
                                    value={rotate}
                                    onChange={handleRotationChange}
                                />
                            </li>

                            <li>
                                <label htmlFor="brightness">Brilho</label>
                                <input
                                    type="range"
                                    id="brightness"
                                    min="-100"
                                    max="100"
                                    value={brightness}
                                    onChange={handleBrightnessChange}
                                />
                            </li>

                            <li>
                                <label htmlFor="contrast">Contraste</label>
                                <input
                                    type="range"
                                    id="contrast"
                                    min="0"
                                    max="200"
                                    value={contrast}
                                    onChange={handleContrastChange}
                                />
                            </li>
                        </ul>
                    </div>
                    )}

                    {showAdvancedTools && (
                    <div className="advanced-tools-container">

                    </div>
                    )}

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
                        <>
                            <div className="images-mnt-buttons-container">
                                <button className="add-image-button" onClick={handleCurrentImageDelete}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        width="24"
                                        height="24"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                    Remover imagem
                                </button>

                                <button className="add-image-button" onClick={() => setShowAddImage(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Adicionar imagens
                                </button>

                                <button className="download-button" onClick={handleDownload} disabled={isDownloading}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    {isDownloading ? 'Downloading...' : (images?.length > 1 ? 'Download All' : 'Download')}
                                </button>
                            </div>
            
                            <img
                                src={imageUrl}
                                alt="project"
                                className="current-image"
                                style={{
                                    transform: `rotate(${rotate}deg)`,
                                    width: `${imgWidth === 'auto' ? originalWidth : imgWidth}px`,
                                    height: `${imgHeight === 'auto' ? originalHeight : imgHeight}px`,
                                    filter: `
                                    brightness(${Math.min(Math.max(100 + brightness, 0), 200)}%)
                                    contrast(${Math.min(Math.max(contrast, 0), 200)}%)
                                    ${binarize ? `grayscale(100%) contrast(200%)` : 'grayscale(0%) contrast(100%)'}`,
                                }}
                            />
                        </>
                    )}
                    
                    {images && images.length > 1 && (
                        <div className="image-buttons">
                            <button
                                onClick={() => setCurrentImage((currentImage + images.length - 1) % images.length)}>
                                Anterior
                            </button>

                            <button
                                onClick={() => setCurrentImage((currentImage + 1) % images.length)}>
                                Próxima
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showAddImage && (
                <ProjectAddImage onClose={() => setShowAddImage(false)} onImagesUploaded={handleImagesUploaded} />
            )}
        </div>
    );
};

export default Project;