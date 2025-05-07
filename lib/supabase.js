import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lmbqidwiwxxlvkquixhf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtYnFpZHdpd3h4bHZrcXVpeGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAyODQxODcsImV4cCI6MjA0NTg2MDE4N30.wmEJ2id0WmUDM9POf_YORjxlIYyuUoqhwAtbznDh_24';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const subscribeToDataTable = (callback) => {
    const subscription = supabase
      .channel('realtime:data_table')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'data_table' },
        () => {
          callback(); // Panggil callback ketika data berubah
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription); // Unsubscribe ketika tidak dibutuhkan
    };
  };

  export const subscribeToNotifications = (callback) => {
    const channel = supabase
      .channel("realtime:notifications")
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
        console.log("Data table changed, fetching latest data...", payload);
        callback(); // Panggil callback untuk mengambil data terbaru
      })
      .subscribe();
  
    return () => {
      supabase.removeChannel(channel);
    };
  };

  export const subscribeToRealtimeData = (callback) => {
    const subscription = supabase
      .channel('realtime:realtime_data')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'realtime_data' },
        () => {
          callback(); // Panggil callback ketika data berubah
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription); // Unsubscribe ketika tidak dibutuhkan
    };
  };