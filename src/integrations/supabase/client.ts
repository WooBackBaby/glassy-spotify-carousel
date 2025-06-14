
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Environment check:', {
  supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
  supabaseAnonKey: supabaseAnonKey ? 'Present' : 'Missing'
})

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable. Please ensure your Supabase integration is properly configured.')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable. Please ensure your Supabase integration is properly configured.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
