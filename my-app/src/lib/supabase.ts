import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pcvkwugpaerlancgzniy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdmt3dWdwYWVybGFuY2d6bml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjM3NTIsImV4cCI6MjA2MTEzOTc1Mn0.vIJFxJskow2kNH9otuLcU5PX2KTraWDcBfo3NOUK-b4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 