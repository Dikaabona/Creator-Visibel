import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Creator, Campaign, Application, ApplicationStatus } from '../types';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  // Hardcoded fallbacks based on user provided keys
  const FALLBACK_URL = 'https://qrohkqnsnfnwjodyfvdv.supabase.co';
  const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyb2hrcW5zbmZud2pvZHlmdmR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTIwNzQsImV4cCI6MjA4NzA2ODA3NH0.vdNNIFMyECGKKvhznuM88buavN0pcEHgdxEMgvY3qMc';

  let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Function to check if a string is a valid URL
  const isValidUrl = (url: any) => typeof url === 'string' && url.trim().startsWith('http');
  
  // Function to check if a key looks like a Supabase key (not a Clerk key)
  const isValidKey = (key: any) => typeof key === 'string' && key.trim().length > 20 && !key.trim().startsWith('sb_');

  // Auto-fix swapped keys: if the key is a URL and the URL is a key
  if (isValidUrl(supabaseAnonKey) && !isValidUrl(supabaseUrl)) {
    console.warn('Supabase URL and Key appear to be swapped in environment variables. Auto-fixing...');
    const temp = supabaseUrl;
    supabaseUrl = supabaseAnonKey;
    supabaseAnonKey = temp;
  }

  // If env vars are invalid, use fallbacks
  if (!isValidUrl(supabaseUrl)) {
    if (supabaseUrl && !supabaseUrl.includes('sb_publishable')) {
      console.warn('Invalid Supabase URL from env, using fallback:', supabaseUrl);
    }
    supabaseUrl = FALLBACK_URL;
  }
  
  if (!isValidKey(supabaseAnonKey)) {
    supabaseAnonKey = FALLBACK_KEY;
  }

  supabaseUrl = supabaseUrl.trim();
  supabaseAnonKey = supabaseAnonKey.trim();

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
};

export const upsertCreators = async (creators: Creator[]) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('creators')
    .upsert(creators, { onConflict: 'id' })
    .select();
  
  if (error) {
    console.error('Error upserting creators:', error);
    throw error;
  }
  return data;
};

export const deleteCreators = async (ids: string[]) => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('creators')
    .delete()
    .in('id', ids);
  
  if (error) {
    console.error('Error deleting creators:', error);
    throw error;
  }
  return data;
};

export const fetchCreators = async () => {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('creators')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching creators:', error);
    throw error;
  }
  return data as Creator[];
};

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const fetchApplications = async (): Promise<Application[]> => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('applications').select('*');
  if (error) throw error;
  return data || [];
};

export const upsertCampaign = async (campaign: Partial<Campaign>) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('campaigns').upsert(campaign).select();
  if (error) throw error;
  return data?.[0];
};

export const applyToCampaign = async (application: Partial<Application>) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('applications').insert(application).select();
  if (error) throw error;
  return data?.[0];
};

export const updateApplicationStatus = async (id: string, status: ApplicationStatus, extra: any = {}) => {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('applications').update({ status, ...extra }).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
};
