import React, { useState } from 'react';
import JSZip from 'jszip';
import './new_project_details.css';

const NewProjectDetails = ({ onClose }) => {
    const [images, setImages] = useState([]);

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        console.log('Files dropped:', files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        files.forEach((file) => {
            console.log('Processing file:', file.name);
            if (file.type === 'application/zip') {
                console.log('ZIP file detected, extracting images...');
                const reader = new FileReader();
                reader.onload = (e) => {
                    const zip = new JSZip();
                    zip.loadAsync(e.target.result).then((contents) => {
                        console.log('ZIP file loaded. Contents:', Object.keys(contents.files));
                        
                        const imageFiles = [];
                        Object.keys(contents.files).forEach((filename) => {
                            const file = contents.files[filename];
                            console.log(`Found file in ZIP: ${filename}`);
                            if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                                console.log(`Image found inside ZIP: ${file.name}`);
                                imageFiles.push(file.async('blob').then((blob) => {
                                    return new File([blob], file.name, { type: file.mimeType });
                                }));
                            }
                        });

                        Promise.all(imageFiles).then((extractedImages) => {
                            console.log('All image files extracted:', extractedImages);
                            setImages((prevImages) => [
                                ...prevImages,
                                ...extractedImages
                            ]);
                        });
                    }).catch((error) => {
                        console.error('Error extracting files from ZIP:', error);
                    });
                };
                reader.readAsArrayBuffer(file);
            } else if (file.type.startsWith('image/')) {
                console.log('Direct image file selected:', file.name);
                setImages((prevImages) => [...prevImages, file]);
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (images.length === 0) {
            return;
        }
    };

    const removeImageInput = (index) => {
        console.log('Removing image at index:', index);
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    return (
        <div className='overlay'>
            <div className="new-project-details-container">
                <div className="new-project-details">
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>

                    <h3>Novo Projeto</h3>

                    <form className='new-project-form' onSubmit={handleSubmit}>
                        <input type="text" placeholder="Nome do Projeto" required className='form-input' />

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
