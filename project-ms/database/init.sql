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
