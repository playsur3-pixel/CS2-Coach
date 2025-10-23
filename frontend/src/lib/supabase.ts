import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Player = {
  id: string;
  user_id: string;
  player_name: string;
  created_at: string;
  updated_at: string;
};

export type TrainingSession = {
  id: string;
  player_id: string;
  session_date: string;
  hs_rate: number;
  kills: number;
  deaths: number;
  accuracy: number;
  map_name: string;
  duration_minutes: number;
  notes: string;
  created_at: string;
};
