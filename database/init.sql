-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255), -- Nullable for subscription-only users initially?
    role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    lastlink_id VARCHAR(255),
    subscription_status VARCHAR(50) DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled')),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- DAILY DRAWS TABLE
CREATE TABLE IF NOT EXISTS daily_draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    data_sorteio TIMESTAMP WITH TIME ZONE NOT NULL,
    premio_descricao TEXT NOT NULL,
    ganhador_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    numero_sorteado INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- SUBSCRIPTIONS TABLE (New)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    lastlink_id VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- 'ACTIVE', 'INACTIVE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RAFFLES TABLE
CREATE TABLE IF NOT EXISTS raffles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2), -- Nullable for subscription raffles?
    total_numbers INTEGER, -- Nullable?
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'cancelled'
    draw_date TIMESTAMP WITH TIME ZONE,
    winner_id UUID REFERENCES users(id), -- To store the winner
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255)
);

-- TICKETS TABLE
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raffle_id UUID REFERENCES raffles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    number INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'reserved', -- 'reserved', 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(raffle_id, number)
);

-- INDEXES
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tickets_raffle_id ON tickets(raffle_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
