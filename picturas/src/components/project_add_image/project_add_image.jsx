import React, { useState } from 'react';
import JSZip from 'jszip';
import './project_add_image.css';
import axios from 'axios';
import { useSessionStore } from '../../stores/session_store';

const ProjectAddImage = ({ onClose, onImagesUploaded, proj_id }) => {
    const [images, setImages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const { token } = useSessionStore();

    const handleZipFile = async (file) => {
        try {
            const zipData = await file.arrayBuffer();
            const zip = await JSZip.loadAsync(zipData);
            const imageFiles = [];
        
            for (const [filename, fileData] of Object.entries(zip.files)) {
                if (fileData.dir || !filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    continue;
                }
                
                const blob = await fileData.async('blob');
                
                const imageFile = new File([blob], filename, {
                    type: blob.type || 'image/jpeg'
                });
                
                imageFiles.push(imageFile);
            }
        
            return imageFiles;

        } catch (error) {
            console.error('Error processing ZIP file:', error);
            return [];
        }
    };

    const handleFiles = async (files) => {
        setIsProcessing(true);
        try {
            const newImages = [];
        
            for (const file of files) {
                if (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
                    const extractedImages = await handleZipFile(file);
                    newImages.push(...extractedImages);
                } 
                
                else if (file.type.startsWith('image/')) {
                    newImages.push(file);
                }
            }    

            setImages(prevImages => [...prevImages, ...newImages]);

        } catch (error) {
            console.error('Error handling files:', error);
            alert('Erro ao processar os arquivos. Por favor, tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        handleFiles(files);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isProcessing) {
            alert('Ainda estamos a processar as imagens, por favor aguarde.');
            return;
        }

        for (const image of images) {
            if (!(image instanceof File)) {
                console.error('Invalid file:', image);
                continue; // Skip invalid files
            }

            const formData = new FormData();
            formData.append('file', image);

            console.log('Uploading image:', image.name);
            formData.forEach((value, key) => {
                console.log(`${key}:`, value); // Debug the FormData content
            });

            await axios.post(
                `https://p.primecog.com/api/users/projects/${proj_id}/images`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Let Axios handle Content-Type
                    },
                }
            );

            console.log(`Imagem enviada com sucesso: ${image.name}`);
        }

        onImagesUploaded(images);
        onClose();
    };

    const removeImageInput = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className='overlay'>
            <div className="new-project-details-container">
                <div className="new-project-details">
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>

                    <h3>Adicionar imagens</h3>

                    <form className='new-project-form' onSubmit={handleSubmit}>
                        <h4>Carregar Imagens</h4>
                        <div
                            className="drag-drop-area"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <p>Arraste e solte as imagens aqui ou clique abaixo para carregar</p>
                            {images.map((image, index) => (
                                <div key={index} className="file-preview">
                                    <span>{image.name}</span>
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => removeImageInput(index)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            ))}
                        </div>

                        <input
                            type="file"
                            accept="image/*, .zip"
                            multiple
                            onChange={(e) => handleFiles(Array.from(e.target.files))}
                        />

                        <button type="submit">Carregar imagens</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProjectAddImage;