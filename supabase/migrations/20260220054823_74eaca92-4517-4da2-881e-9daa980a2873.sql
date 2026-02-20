
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Public insert policy (anyone can submit the form)
CREATE POLICY "Anyone can insert students" ON public.students FOR INSERT WITH CHECK (true);

-- Public select policy (anyone can view filled data)
CREATE POLICY "Anyone can view students" ON public.students FOR SELECT USING (true);
