// app/_layout.jsx
import { StatusBar } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from './store'; // Sesuaikan path ke store Anda
import '../global.css';

const RootLayout = () => {
  return (
    <Provider store={store}>
      <StatusBar backgroundColor="rgba(0,0,0,0.2)" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
};

export default RootLayout;