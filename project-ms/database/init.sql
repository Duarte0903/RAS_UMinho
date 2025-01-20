-- Schema for the Projects database
CREATE TABLE Projects (
    id UUID PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    user_id UUID NOT NULL
);

CREATE TABLE Images (
    id UUID PRIMARY KEY,
    project_id UUID NOT NULL,
    uri TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects (id) ON DELETE CASCADE
);

CREATE TABLE Tools (
    id UUID PRIMARY KEY,
    position INT NOT NULL,
    procedure VARCHAR(200) NOT NULL,
    parameters JSONB NOT NULL,
    project_id UUID NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects (id) ON DELETE CASCADE
);

CREATE TABLE Processes (
    id UUID PRIMARY KEY, -- Identificador único do processo
    project_id UUID NOT NULL, -- Referência ao projeto associado
    completed INT NOT NULL DEFAULT 0, -- Número de imagens processadas
    total INT NOT NULL, -- Número total de imagens a processar
    stop BOOLEAN NOT NULL DEFAULT FALSE, -- Indica se o processamento deve ser interrompido
    FOREIGN KEY (project_id) REFERENCES Projects (id) ON DELETE CASCADE
);
