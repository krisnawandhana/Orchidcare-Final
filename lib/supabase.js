import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lmbqidwiwxxlvkquixhf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYnFpZHdpd3h4bHZrcXVpeGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyODQxODcsImV4cCI6MjA0NTg2MDE4N30.wmEJ2id0WmUDM9POf_YORjxlIYyuUoqhwAtbznDh_24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
