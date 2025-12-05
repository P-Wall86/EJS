-- This script creates the test_drive table to store test drive requests
-- It includes foreign keys to account and inventory tables
-- Also adds a trigger to automatically update the updated_at column on each update

CREATE TABLE public.test_drive (
    test_drive_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    inv_id INTEGER NOT NULL,
    requested_date TIMESTAMP NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_test_drive_account FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE,
    CONSTRAINT fk_test_drive_inventory FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id) ON DELETE CASCADE
);

-- Function to update the updated_at column before any update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger that calls the function before every update on the test_drive table
CREATE TRIGGER trg_update_test_drive_updated_at
BEFORE UPDATE ON public.test_drive
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();