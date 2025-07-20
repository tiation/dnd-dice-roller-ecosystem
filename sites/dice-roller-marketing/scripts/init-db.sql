-- Database initialization script for DnD Dice Roller SaaS
-- This script sets up the initial database configuration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database if it doesn't exist (handled by environment)
-- The database creation is handled by Docker environment variables

-- Set up proper permissions
GRANT ALL PRIVILEGES ON DATABASE dnddiceroller TO dnddiceroller;

-- Create schema for application tables (optional, using default public schema)
-- CREATE SCHEMA IF NOT EXISTS dice_app;

-- Set timezone to UTC for consistency
SET timezone = 'UTC';

-- Configure connection limits and settings for production
ALTER DATABASE dnddiceroller SET log_statement = 'mod';
ALTER DATABASE dnddiceroller SET log_min_duration_statement = 1000;
ALTER DATABASE dnddiceroller SET shared_preload_libraries = 'pg_stat_statements';

-- Performance tuning settings (these would typically be in postgresql.conf)
-- ALTER SYSTEM SET max_connections = 100;
-- ALTER SYSTEM SET shared_buffers = '256MB';
-- ALTER SYSTEM SET effective_cache_size = '1GB';
-- ALTER SYSTEM SET maintenance_work_mem = '64MB';
-- ALTER SYSTEM SET checkpoint_completion_target = 0.9;
-- ALTER SYSTEM SET wal_buffers = '16MB';
-- ALTER SYSTEM SET default_statistics_target = 100;

-- Enable query statistics collection
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Initial configuration complete
SELECT 'Database initialization completed successfully' as status;