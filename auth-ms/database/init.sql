CREATE EXTENSION IF NOT EXISTS citext;
-- Criar o tipo ENUM para o campo 'type'
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
        CREATE TYPE user_type_enum AS ENUM ('anonimo', 'gratuito', 'premium');
    END IF;
END$$;

-- Criar a tabela Users
CREATE TABLE Users (
    id UUID PRIMARY KEY,
    name VARCHAR(200),
    email CITEXT UNIQUE,
    password_hash VARCHAR(1000),
    type user_type_enum DEFAULT 'gratuito'
);

-- Criar a tabela Days
CREATE TABLE Days (
    user_id UUID NOT NULL,
    operation_date DATE NOT NULL,
    operations_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, operation_date),
    FOREIGN KEY (user_id) REFERENCES Users (id)
);
