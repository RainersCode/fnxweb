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