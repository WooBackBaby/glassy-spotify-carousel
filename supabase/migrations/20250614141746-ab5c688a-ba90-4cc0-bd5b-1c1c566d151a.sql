
-- Create a table to store newsletter email subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create an index on email for faster lookups
CREATE INDEX idx_newsletter_subscriptions_email ON public.newsletter_subscriptions(email);

-- Create an index on subscribed_at for sorting
CREATE INDEX idx_newsletter_subscriptions_date ON public.newsletter_subscriptions(subscribed_at DESC);

-- Enable Row Level Security (RLS) - making it public for newsletter signups
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for newsletter signup)
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to prevent public reading of emails (privacy)
CREATE POLICY "Only authenticated users can view subscriptions" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  USING (false); -- No public access to email list
