-- Add updated_at columns to both tables
ALTER TABLE team_players ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create a trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for both tables
DROP TRIGGER IF EXISTS set_timestamp_team_players ON team_players;
CREATE TRIGGER set_timestamp_team_players
BEFORE UPDATE ON team_players
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_coaches ON coaches;
CREATE TRIGGER set_timestamp_coaches
BEFORE UPDATE ON coaches
FOR EACH ROW
EXECUTE FUNCTION update_timestamp(); 