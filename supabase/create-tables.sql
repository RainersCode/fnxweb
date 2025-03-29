-- Create tables for our Rugby website

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(100),
    slug VARCHAR(255) UNIQUE,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Fixtures Table
CREATE TABLE IF NOT EXISTS fixtures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opponent VARCHAR(255) NOT NULL,
    match_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255),
    score VARCHAR(50),
    is_home_game BOOLEAN DEFAULT TRUE,
    result VARCHAR(50), -- 'win', 'loss', 'draw'
    description TEXT
);

-- Galleries Table
CREATE TABLE IF NOT EXISTS galleries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images Table (related to galleries)
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    display_order INTEGER DEFAULT 0
);

-- Team Players Table
CREATE TABLE IF NOT EXISTS team_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100),
    bio TEXT,
    image_url TEXT,
    jersey_number INTEGER,
    is_active BOOLEAN DEFAULT TRUE
);

-- Coaches Table
CREATE TABLE IF NOT EXISTS coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    bio TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL, -- e.g., email, phone, social media
    value VARCHAR(255) NOT NULL,
    label VARCHAR(100),
    display_order INTEGER DEFAULT 0
); 