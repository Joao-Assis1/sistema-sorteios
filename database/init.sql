-- Habilita UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE MEMBROS (Sincronizada via Webhook Lastlink)
-- O Backend chama de 'lastlink_members', então vamos criar com esse nome.
CREATE TABLE IF NOT EXISTS lastlink_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'canceled'
    lastlink_id VARCHAR(255), -- ID do usuário na plataforma Lastlink
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE HISTÓRICO DE SORTEIOS
CREATE TABLE IF NOT EXISTS historico_sorteios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_sorteio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    premio TEXT NOT NULL,
    participante_id UUID REFERENCES lastlink_members(id) ON DELETE SET NULL
);

-- Índices para performance
CREATE INDEX idx_members_email ON lastlink_members(email);
CREATE INDEX idx_members_status ON lastlink_members(status);