
-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id UUID PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  date TEXT NOT NULL,
  total DECIMAL NOT NULL,
  status TEXT NOT NULL,
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own quotations
CREATE POLICY "Users can view their own quotations" 
  ON public.quotations 
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ) OR auth.uid() = created_by);

-- Create policy to allow users to insert their own quotations
CREATE POLICY "Users can create quotations" 
  ON public.quotations 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow users to update their own quotations
CREATE POLICY "Users can update their own quotations" 
  ON public.quotations 
  FOR UPDATE 
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ) OR auth.uid() = created_by);

-- Create policy to allow users to delete their own quotations
CREATE POLICY "Users can delete their own quotations" 
  ON public.quotations 
  FOR DELETE 
  USING (auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ) OR auth.uid() = created_by);

-- Add created_by column to track who created the quotation
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users NOT NULL;
