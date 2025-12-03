// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import authSlice from './authSlice';
import publishersReducer from './publishersSlice';
import usersReducer from './usersSlice';
import campaignsReducer from './campaignsSlice';
import advertisersReducer from './advertisersSlice';

// Create an encryptor instance (you must pass at least `secretKey`)
const encryptor = encryptTransform({
  secretKey: 'default‐fallback‐key',
  onError: (error) => {
    console.error('Redux Persist encryption error:', error);
  }
});

const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user', 'role', 'subdomain', 'permissions'], // Added permissions to persist
  blacklist: ['token', 'loading', 'error'],
  transforms: [encryptor],
  migrate: (state) => Promise.resolve(state),
};

const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    publishers: publishersReducer,
    users: usersReducer,
    campaigns: campaignsReducer,
    advertisers: advertisersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export const clearPersistedState = () => {
  persistor.purge();
};