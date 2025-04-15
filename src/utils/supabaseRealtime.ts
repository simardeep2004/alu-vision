
import { supabase } from '@/integrations/supabase/client';

/**
 * Enables real-time functionality for the specified table
 * @param tableName The name of the table to enable real-time for
 */
export const enableRealtimeForTable = async (tableName: string): Promise<void> => {
  try {
    // First, set the replica identity to full to ensure complete row data is available
    const { error: replicaError } = await supabase.rpc('alter_table_replica_identity', {
      table_name: tableName,
      replica_type: 'FULL'
    });
    
    if (replicaError) {
      console.error(`Error setting replica identity for ${tableName}:`, replicaError);
    }
    
    // Then, add the table to the realtime publication
    const { error: publicationError } = await supabase.rpc('add_table_to_realtime', {
      table_name: tableName
    });
    
    if (publicationError) {
      console.error(`Error adding ${tableName} to realtime publication:`, publicationError);
    }
    
    console.log(`Realtime enabled for table: ${tableName}`);
  } catch (error) {
    console.error(`Failed to enable realtime for ${tableName}:`, error);
  }
};

/**
 * Subscribe to realtime changes for a specific table
 * @param tableName The name of the table to subscribe to
 * @param callback Function to call when changes occur
 * @returns A function to unsubscribe
 */
export const subscribeToTable = (
  tableName: string, 
  callback: (payload: any) => void,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*'
): () => void => {
  const channel = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes', 
      { 
        event, 
        schema: 'public', 
        table: tableName 
      }, 
      (payload) => {
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log(`Subscription status for ${tableName}:`, status);
    });
    
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Enable realtime for multiple tables at once
 * @param tableNames Array of table names to enable real-time for
 */
export const enableRealtimeForTables = async (tableNames: string[]): Promise<void> => {
  for (const tableName of tableNames) {
    await enableRealtimeForTable(tableName);
  }
};

/**
 * Subscribe to multiple tables at once
 * @param tables Object mapping table names to callback functions
 * @returns Function to unsubscribe from all tables
 */
export const subscribeToTables = (
  tables: Record<string, (payload: any) => void>
): () => void => {
  const unsubscribers: Array<() => void> = [];
  
  for (const [tableName, callback] of Object.entries(tables)) {
    const unsubscribe = subscribeToTable(tableName, callback);
    unsubscribers.push(unsubscribe);
  }
  
  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe());
  };
};
