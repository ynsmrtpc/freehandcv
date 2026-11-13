-- Email verification became required for sign-in (13 Nov 2026). Accounts created before that could
-- sign in without it, so they are treated as verified instead of being locked out.
UPDATE "user" SET "email_verified" = true WHERE "email_verified" = false;
