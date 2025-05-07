import { supabase } from '../lib/supabase';
import { calculateFuzzyScore } from './fuzzyLogic';

export const fetchLatestData = async (individuId) => {
  try {
    const { data, error } = await supabase
      .from('realtime_data')
      .select('id, temperature, humidity, light_intensity, time_stamp')
      .eq('individu_id', individuId)
      .order('time_stamp', { ascending: false })
      .limit(1);

      if (error) throw error;

      const latest = data[0];
      if (!latest) return null;
  
      const thresholds = [individuId]; // Jika kamu pakai threshold berdasarkan individu
      const fuzzyScore = calculateFuzzyScore(
        latest.temperature,
        latest.humidity,
        latest.light_intensity,
        thresholds
      );
  
      return {
        ...latest,
        fuzzyScore, // Tambahkan skor fuzzy ke data
      };
    } catch (error) {
      console.error('Error fetching latest data with fuzzy score:', error.message);
      return null;
    }
  };
