
import { enableRealtimeForTables } from './supabaseRealtime';

/**
 * Initialize real-time updates for all relevant tables
 */
export const initializeRealtimeUpdates = async (): Promise<void> => {
  try {
    const tables = [
      'quotations',
      'products',
      'activity_log',
      'profiles'
    ];
    
    await enableRealtimeForTables(tables);
    console.log('Real-time updates initialized for all tables');
  } catch (error) {
    console.error('Failed to initialize real-time updates:', error);
  }
};
