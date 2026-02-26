-- Add ip_address column to users table for tracking registration IP and country
-- Format: "ip|country_code" (same as anonymous_users)

ALTER TABLE users ADD COLUMN ip_address VARCHAR(50);
