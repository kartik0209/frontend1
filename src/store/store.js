// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import authSlice from './authSlice';

// Create an encryptor instance (you must pass at least `secretKey`)
const encryptor = encryptTransform({
  secretKey:  'default‐fallback‐key',
  onError: (error) => {
    console.error('Redux Persist encryption error:', error);
  }
});

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user', 'role', 'subdomain'],
  blacklist: ['token', 'loading', 'error'],
  transforms: [encryptor],    // ← pass the result, not the factory itself
  migrate: (state) => Promise.resolve(state),
};

const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: { auth: persistedReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export const clearPersistedState = () => {
  persistor.purge();
};
