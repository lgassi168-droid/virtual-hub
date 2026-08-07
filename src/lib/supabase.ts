import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://qotfgcvsoejaqbjbhowl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdGZnY3Zzb2VqYXFiamJob3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyNTIzODMsImV4cCI6MjA5ODgyODM4M30.G9fTViBRMGJ48BtEAH_gpOjQrWIx_uuIHKmUa74owR0'
)