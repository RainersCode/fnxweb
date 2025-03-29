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

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public can read all tables
CREATE POLICY "Public can read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public can read fixtures" ON fixtures FOR SELECT USING (true);
CREATE POLICY "Public can read galleries" ON galleries FOR SELECT USING (true);
CREATE POLICY "Public can read gallery_images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public can read team_players" ON team_players FOR SELECT USING (true);
CREATE POLICY "Public can read coaches" ON coaches FOR SELECT USING (true);
CREATE POLICY "Public can read contacts" ON contacts FOR SELECT USING (true);

-- Only authenticated users can insert, update, or delete
CREATE POLICY "Authenticated users can insert articles" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update articles" ON articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete articles" ON articles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert fixtures" ON fixtures FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update fixtures" ON fixtures FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete fixtures" ON fixtures FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert galleries" ON galleries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update galleries" ON galleries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete galleries" ON galleries FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert gallery_images" ON gallery_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update gallery_images" ON gallery_images FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete gallery_images" ON gallery_images FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert team_players" ON team_players FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update team_players" ON team_players FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete team_players" ON team_players FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert coaches" ON coaches FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update coaches" ON coaches FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete coaches" ON coaches FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert contacts" ON contacts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update contacts" ON contacts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete contacts" ON contacts FOR DELETE USING (auth.role() = 'authenticated');

-- Set up storage buckets for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;

-- Allow public access to media bucket
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Allow authenticated users to upload to media bucket
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their own media
CREATE POLICY "Authenticated users can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete media
CREATE POLICY "Authenticated users can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated'); 