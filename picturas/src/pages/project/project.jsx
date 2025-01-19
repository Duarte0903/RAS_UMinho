import React, { useState, useRef, useEffect } from "react";
import './project.css';
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import JSZip from 'jszip';
import ProjectAddImage from "../../components/project_add_image/project_add_image";
import { useSessionStore } from "../../stores/session_store";
import axios from 'axios';

const Project = () => {
    const getProjectId = () => {
        const path = window.location.hash;
        const parts = path.split('/'); 
        return parts[parts.length - 1]; 
    };

    const proj_id = getProjectId();
    const { token } = useSessionStore();
    const location = useLocation();
    let { projectName: initialProjectName, images: initialImages } = location.state || {};
    let [images, setImages] = useState(initialImages || []);
    let [processedImages, setProcessedImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [currentProcessedImage, setCurrentProcessedImage] = useState(0);
    const imageUrl = images && images[currentImage] ? images[currentImage] : null;
    const processedImageUrl = processedImages &&  processedImages.length > 0 ? processedImages[processedImages.length - 1] : null;
    const [showAdvancedTools, setShowAdvancedTools] = useState(false);
    const [showBasicTools, setShowBasicTools] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showAddImage, setShowAddImage] = useState(false);
    let [projectName, setProjectName] = useState(initialProjectName || "Untitled Project");
    const [isEditingName, setIsEditingName] = useState(false);
    let [toolPosition, setToolPosition] = useState(0);
    const [isAdjusting, setIsAdjusting] = useState(false);

    // Tool states
    let [dimensions, setDimensions] = useState('');
    let [removeBackground, setRemoveBackground] = useState(false);
    let [binarize, setBinarize] = useState(0);
    let [rotate, setRotate] = useState(0);
    let [brightness, setBrightness] = useState(0);
    let [contrast, setContrast] = useState(100);
    let [beselColor, setBeselColor] = useState('#000000');
    let [beselWidth, setBeselWidth] = useState(0);
    let [watermark, setWatermark] = useState(false);
    let [greyScale, setGreyScale] = useState(false);
    let [imgWidth, setImgWidth] = useState('auto');
    let [imgHeight, setImgHeight] = useState('auto');
    let imageRef = useRef(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const nameResponse = await axios.get(
                    `https://p.primecog.com/api/users/projects/${proj_id}`, 
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setProjectName(nameResponse.data.project.name);

                const imagesResponse = await axios.get(
                    `https://p.primecog.com/api/users/projects/${proj_id}/images`, 
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setImages(imagesResponse.data.original_images);
                setProcessedImages(imagesResponse.data.processed_images);
                console.log(imagesResponse.data);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
    
        fetchProject();
    }, [token, proj_id]);

    useEffect(() => {
        if (imageRef.current) {
            setOriginalWidth(imageRef.current.naturalWidth);
            setOriginalHeight(imageRef.current.naturalHeight);
        }
    }, [currentImage]);

    const handleNameEdit = () => {
        setIsEditingName(true);
    };

    const handleImagesUploaded = async () => {
        const imagesResponse = await axios.get(
            `https://p.primecog.com/api/users/projects/${proj_id}/images`, 
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        setImages(imagesResponse.data.original_images);
        setProcessedImages(imagesResponse.data.processed_images);
        console.log(imagesResponse.data);
        window.location.reload();
    };

    const handleDimensionChange = (event) => {
        setDimensions(event.target.value);
        const [width, height] = event.target.value.split('x').map((val) => parseInt(val));
        setImgWidth(width);
        setImgHeight(height);
    };

    const handleInputRelease = async (tool, value) => {
        if (!tool || !value) {
            console.error('Missing required parameters:', { tool, value });
            return;
        }

        try {
            const toolRequest = {
                position: toolPosition,
                procedure: tool,
                parameters: value
            };

            const response = await axios.post(
                `https://p.primecog.com/api/users/projects/${proj_id}/tools`,
                toolRequest,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.status === 200) {
                console.log('Tool added successfully');
                setToolPosition(prev => prev + 1);
            }

            console.log(`Tool ${tool} applied:`, response.data);
        } catch (error) {
            console.error(`Error applying ${tool}:`, error);
        }
    };

    // Individual tool handlers
    const handleResizeRelease = () => {
        if (imgWidth !== 'auto' || imgHeight !== 'auto') {
            handleInputRelease('resize', {
                width: parseInt(imgWidth),
                height: parseInt(imgHeight)
            });
        }
    };

    const handleRemoveBackgroundChange = (e) => {
        setRemoveBackground(e.target.checked);
        if (e.target.checked) {
            handleInputRelease('removebg', {});
        }
    };
    
    const handleGrayscaleChange = (e) => {
        setGreyScale(e.target.checked);
        if (e.target.checked) {
            handleInputRelease('grayscale', {});
        }
    };
    
    const handleWatermarkChange = (e) => {
        setWatermark(e.target.checked);
        if (e.target.checked) {
            handleInputRelease('watermark', {});
        }
    };

    const handleBinarizeRelease = () => {
        if (binarize > 0) {
            handleInputRelease('binary', {
                threshold: parseInt(binarize)
            });
        }
    };

    const handleRotateRelease = () => {
        if (rotate !== 0) {
            handleInputRelease('rotation', {
                angle: parseInt(rotate)
            });
        }
    };

    const handleBrightnessContrastRelease = () => {
        if (isAdjusting) {
            handleInputRelease('brightness_contrast', {
                brightness: parseInt(brightness),
                contrast: parseInt(contrast)
            });
            setIsAdjusting(false);
        }
    };

    const handleBezelRelease = () => {
        if (beselWidth > 0) {
            handleInputRelease('bezel', {
                bezelColor: String(beselColor),
                bezelThickness: parseInt(beselWidth)
            });
        }
    };

    const handleReset = () => {
        setToolPosition(0);
        setDimensions('');
        setImgWidth('auto');
        setImgHeight('auto');
        setRemoveBackground(false);
        setBinarize(0);
        setRotate(0);
        setBrightness(0);
        setContrast(100);
        setBeselColor('#000000');
        setBeselWidth(0);
        setWatermark(false);
        setGreyScale(false);
    };

    const handleDownload = async () => {
        if (!processedImages || processedImages.length === 0) {
            console.error('No images to download');
            return;
        }
    
        try {
            setIsDownloading(true);
            if (images.length === 1) {
                // Apenas uma imagem para download
                const image = processedImages[processedImages.length-1];
                const link = document.createElement('a');
                link.href = image.url;
                link.download = image.filename || `${projectName || 'image'}.png`;
                
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Múltiplas imagens para download em um arquivo ZIP
                const zip = new JSZip();

                const fetchPromises = processedImages.map((image, index) => {
                    const fileName = image.filename || `${projectName || 'image'}_${index + 1}.png`;
                    return fetch(image.url)
                        .then((response) => response.blob())
                        .then((blob) => zip.file(fileName, blob));
                });
    
                await Promise.all(fetchPromises);

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
            alert('Error during download');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCurrentImageDelete = () => {
        setImages(prevImages => prevImages.filter((_, index) => index !== currentImage));
        setCurrentImage(0);
    };

    const applyTools = async () => {
        try {
            const processResponse = await axios.post(
                `https://p.primecog.com/api/users/projects/${proj_id}/process`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log(processResponse);
            window.location.reload();
        } catch (error) {
            console.error('Error applying tools:', error);
        }
    };

    const updateProjName = async (newName) => {
        try {
            const nameResponse = await axios.put(
                `https://p.primecog.com/api/users/projects/${proj_id}`,
                {
                    name: newName
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log('Project name updated:', nameResponse)
        } catch (error) {
            console.error('Error changing project name:', error);
            alert('Error changing project name');
        }
    };

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
                                    const newName = e.target.value;
                                    setProjectName(newName);
                                    setIsEditingName(false);
                                    updateProjName(newName);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const newName = e.target.value;
                                        setProjectName(newName);
                                        setIsEditingName(false);
                                        updateProjName(newName);
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
                                <img src="pencil.png" className="edit-icon" onClick={handleNameEdit} alt="Edit" />
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
                        >
                            Ferramentas básicas
                        </button>

                        <button
                            className={showAdvancedTools ? 'active' : ''}
                            onClick={() => {
                                setShowBasicTools(false);
                                setShowAdvancedTools(true);
                            }}
                        >
                            Ferramentas avançadas
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
                                        onBlur={handleResizeRelease}
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
                                    <label htmlFor="grayscale">Gray Scale</label>
                                    <input
                                        type="checkbox"
                                        id="grayscale"
                                        checked={greyScale}
                                        onChange={handleGrayscaleChange}
                                    />
                                </li>

                                <li>
                                    <label htmlFor="watermark">Marca d'água</label>
                                    <input
                                        type="checkbox"
                                        id="watermark"
                                        checked={watermark}
                                        onChange={handleWatermarkChange}
                                    />
                                </li>

                                <li>
                                    <label htmlFor="binarize">Binarização: {binarize}</label>
                                    <input
                                        type="range"
                                        id="binarize"
                                        min="0"
                                        max="255"
                                        value={binarize}
                                        onChange={(e) => {
                                            console.log('Binarize onChange triggered:', e.target.value);
                                            setBinarize(e.target.value);
                                        }}
                                        onPointerUp={(e) => {
                                            handleBinarizeRelease();
                                        }}
                                        onTouchEnd={(e) => {
                                            handleBinarizeRelease();
                                        }}
                                    />
                                </li>

                                <li>
                                    <label htmlFor="rotate">Rodar: {rotate}º</label>
                                    <input
                                        type="range"
                                        id="rotate"
                                        min="0"
                                        max="360"
                                        value={rotate}
                                        onChange={(e) => setRotate(e.target.value)}
                                        onPointerUp={(e) => {
                                            handleRotateRelease();
                                        }}
                                        onTouchEnd={(e) => {
                                            handleRotateRelease();
                                        }}
                                    />
                                </li>

                                <li className="range-input">
                                    <label htmlFor="brightness">Brilho: {brightness}</label>
                                    <input
                                        type="range"
                                        id="brightness"
                                        min="-100"
                                        max="100"
                                        value={brightness}
                                        onChange={(e) => {
                                            setBrightness(e.target.value);
                                            setIsAdjusting(true);
                                        }}
                                        onPointerUp={(e) => {
                                            handleBrightnessContrastRelease();
                                        }}
                                        onTouchEnd={(e) => {
                                            handleBrightnessContrastRelease();
                                        }}
                                        />
                                    </li>
    
                                    <li>
                                        <label htmlFor="contrast">Contraste: {contrast}</label>
                                        <input
                                            type="range"
                                            id="contrast"
                                            min="0"
                                            max="200"
                                            value={contrast}
                                            onChange={(e) => {
                                                setContrast(e.target.value);
                                                setIsAdjusting(true);
                                            }}
                                            onPointerUp={(e) => {
                                                handleBrightnessContrastRelease();
                                            }}
                                            onTouchEnd={(e) => {
                                                handleBrightnessContrastRelease();
                                            }}
                                        />
                                    </li>
    
                                    <li>
                                        <label htmlFor="beselColor">Cor da borda</label>
                                        <input
                                            type="color"
                                            id="beselColor"
                                            value={beselColor}
                                            onChange={(e) => setBeselColor(e.target.value)}
                                        />
                                    </li>
    
                                    <li>
                                        <label htmlFor="beselWidth">Largura da borda (px)</label>
                                        <input
                                            type="text"
                                            id="beselWidth"
                                            placeholder="0"
                                            value={beselWidth}
                                            onChange={(e) => setBeselWidth(e.target.value)}
                                            onBlur={handleBezelRelease}
                                        />
                                    </li>
                                </ul>
                            </div>
                        )}
    
                        {showAdvancedTools && (
                            <div className="advanced-tools-container">
                                {/* Advanced tools content */}
                            </div>
                        )}
    
                        <div className="buttons-container">
                            <button className="apply-button" onClick={applyTools}>Aplicar</button>
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
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Adicionar imagens
                                    </button>
    
                                    <button className="download-button" onClick={handleDownload} disabled={isDownloading}>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        {isDownloading ? 'Downloading...' : (images?.length > 1 ? 'Download All' : 'Download')}
                                    </button>
                                </div>
                
                                <div className="images-display">
                                    <div className="image-wrapper">
                                        <img
                                            ref={imageRef}
                                            src={imageUrl.url}
                                            alt="Original"
                                            className="main-image"
                                        />
                                        <span className="image-label">Original</span>
                                    </div>
    
                                    {processedImageUrl && (
                                        <div className="image-wrapper">
                                            <img 
                                                src={processedImageUrl.url}
                                                alt="Processed"
                                                className="processed-image"
                                            />
                                            <span className="image-label">Processed</span>
                                        </div>
                                    )}
                                </div>
    
                                {images && images.length > 1 && (
                                    <div className="image-buttons">
                                        <button
                                            onClick={() => {
                                                setCurrentImage((currentImage + images.length - 1) % images.length);
                                                if (processedImages && processedImages.length > 0) {
                                                    setCurrentProcessedImage((currentProcessedImage + processedImages.length - 1) % processedImages.length);
                                                }
                                            }}
                                        >
                                            Anterior
                                        </button>
    
                                        <button
                                            onClick={() => {
                                                setCurrentImage((currentImage + 1) % images.length);
                                                if (processedImages && processedImages.length > 0) {
                                                    setCurrentProcessedImage((currentProcessedImage + 1) % processedImages.length);
                                                }
                                            }}
                                        >
                                            Próxima
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
    
                {showAddImage && (
                    <ProjectAddImage onClose={() => {setShowAddImage(false); window.location.reload();}} onImagesUploaded={handleImagesUploaded} proj_id={proj_id} />
                )}
            </div>
        );
    };
    
    export default Project;