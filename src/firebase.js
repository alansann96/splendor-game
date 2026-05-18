import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const config = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FB_DB_URL,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
};

export const isFirebaseConfigured = !!(config.apiKey && config.databaseURL);
export const db = isFirebaseConfigured ? getDatabase(initializeApp(config)) : null;
