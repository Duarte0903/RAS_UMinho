import React, { useState } from 'react';
import JSZip from 'jszip';
import './new_project_details.css';
import { useSessionStore } from '../../stores/session_store';
import axios from 'axios';

const NewProjectDetails = ({ onClose }) => {
    const [projectName, setProjectName] = useState('');
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
                } else if (file.type.startsWith('image/')) {
                    newImages.push(file);
                }
            }

            setImages((prevImages) => [...prevImages, ...newImages]);
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
    
        if (images.length === 0 || projectName.trim() === '') {
            alert('Por favor, preencha o nome do projeto e carregue pelo menos uma imagem.');
            return;
        }
    
        try {
            const projectResponse = await axios.post(
                'https://p.primecog.com/api/users/projects',
                { name: projectName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const proj_id = projectResponse.data.project.id;
            
            // Upload images
            let imagesPosted = 0;
            for (const image of images) {
                if (!(image instanceof File)) {
                    console.error('Invalid file:', image);
                    continue;
                }
    
                const formData = new FormData();
                formData.append('file', image);
    
                console.log('Uploading image:', image.name);
                formData.forEach((value, key) => {
                    console.log(`${key}:`, value);
                });
    
                const imgResponse = await axios.post(
                    `https://p.primecog.com/api/users/projects/${proj_id}/images`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (imgResponse.status === 200) {
                    imagesPosted++;
                } else {
                    console.error('Erro ao enviar uma imagem: ', imgResponse.data || imgResponse.error);
                }
            }

            // Se nao consegui adicionar nenhuma imagem, apaga o projeto acabado de criar
            if (imagesPosted === 0) {
                alert("Nenhuma imagem adicionada... a eliminar o projeto.")

                const response = await axios.delete(
                    `https://p.primecog.com/api/users/projects/${proj_id}`,
                    { headers: { Authorization: `Bearer ${token}`, }, }
                );

                if (response.status === 200) {
                    window.location.reload();
                } else {
                    alert("Erro ao remover o projeto. Tente novamente.");
                }
            }
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Erro ao criar o projeto ou enviar imagens:', error.response?.data || error.message);
            alert('Erro ao criar projeto ou enviar imagens.');
        }
    };
    
    
    

    const removeImageInput = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="overlay">
            <div className="new-project-details-container">
                <div className="new-project-details">
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>

                    <h3>Novo Projeto</h3>

                    <form className="new-project-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nome do Projeto"
                            required
                            className="form-input"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />

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

                        <button type="submit">Criar Projeto</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewProjectDetails;
