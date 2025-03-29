# Supabase Database Setup

This directory contains SQL scripts to set up the database schema, Row Level Security (RLS) policies, and storage buckets for the rugby website.

## Setup Instructions

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Navigate to your project
3. Go to the SQL Editor section

### Step 1: Create Tables

1. Open the SQL Editor
2. Open the file `create-tables.sql` from this directory
3. Copy the contents and paste it into the SQL Editor
4. Execute the SQL to create all the necessary tables

### Step 2: Set Up Row Level Security (RLS)

1. Open the SQL Editor
2. Open the file `enable-rls.sql` from this directory
3. Copy the contents and paste it into the SQL Editor
4. Execute the SQL to enable RLS and create access policies

### Step 3: Set Up Storage

1. Open the SQL Editor
2. Open the file `setup-storage.sql` from this directory
3. Copy the contents and paste it into the SQL Editor
4. Execute the SQL to create the storage bucket and policies

## Table Structure

The database includes the following tables:

1. **articles** - For club news and blog posts
2. **fixtures** - For upcoming and past games
3. **galleries** - For photo collections
4. **gallery_images** - For individual images in galleries
5. **team_players** - For player profiles
6. **coaches** - For coach profiles
7. **contacts** - For contact information

## Security

The RLS policies ensure:

- Public (unauthenticated) users can only read data
- Only authenticated users can create, update, or delete data

## Storage

The storage is configured with:

- A `media` bucket for storing images and other media files
- Public read access to all files
- Only authenticated users can upload, update, or delete files
