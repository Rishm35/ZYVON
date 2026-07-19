import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only when a valid config is present.
// In preview/demo environments the env vars may be missing — guard against
// `auth/invalid-api-key` so the whole app doesn't crash to a blank screen.
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

let auth = null;
if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.error('[v0] Firebase init failed:', err.message);
    auth = null;
  }
}
export { auth };

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
});

// Add a request interceptor to attach the Firebase ID token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
