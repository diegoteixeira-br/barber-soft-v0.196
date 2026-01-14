-- Add payment_method column to appointments table
ALTER TABLE appointments 
ADD COLUMN payment_method text;

-- Add payment_method column to product_sales table
ALTER TABLE product_sales 
ADD COLUMN payment_method text;

-- Add comment for documentation
COMMENT ON COLUMN appointments.payment_method IS 'Payment method: cash, pix, debit_card, credit_card';
COMMENT ON COLUMN product_sales.payment_method IS 'Payment method: cash, pix, debit_card, credit_card';