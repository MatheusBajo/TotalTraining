import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase, debugDatabase } from './database';
import { migrateFromJson } from './migrate';

interface DatabaseContextData {
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextData>({
  isReady: false,
  error: null,
});

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        // Inicializa o banco
        await initDatabase();

        // Migra dados do JSON (só executa se o banco estiver vazio)
        const migrationResult = await migrateFromJson();
        console.log('[DatabaseProvider] Migration result:', migrationResult);

        // Debug: mostra estatísticas do banco
        await debugDatabase();

        setIsReady(true);
      } catch (err) {
        console.error('[DatabaseProvider] Setup error:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    }

    setup();
  }, []);

  return (
    <DatabaseContext.Provider value={{ isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
