import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseKey = publicAnonKey;

export const supabase = createClient(supabaseUrl, supabaseKey);
