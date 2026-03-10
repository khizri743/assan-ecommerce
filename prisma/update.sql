-- 1. Move all businesses into the Warning Window
UPDATE businesses 
SET "subscriptionEnd" = NOW() + INTERVAL '3 days',
    "subscriptionStatus" = 'ACTIVE',
    "lastWarningSentAt" = NULL;

-- 2. Ensure every business has at least one OWNER
-- This targets the first user created for each business
UPDATE users
SET "role" = 'OWNER'
WHERE id IN (
    SELECT DISTINCT ON ("businessId") id 
    FROM users 
    ORDER BY "businessId", "createdAt" ASC
);