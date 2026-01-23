-- Add ameriaOrderId column to payments table
-- This stores the integer OrderID used for Ameria Bank API (generated from configured range)

-- Add column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' AND column_name = 'ameriaOrderId'
    ) THEN
        ALTER TABLE "payments" 
        ADD COLUMN "ameriaOrderId" INTEGER;
    END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS "payments_ameriaOrderId_idx" 
ON "payments"("ameriaOrderId");



