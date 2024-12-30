import { StatusBar } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import "../global.css";

const RootLayout = () => {
  return (
    <>
      <StatusBar backgroundColor="rgba(0,0,0,0.2)" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  )
}

export default RootLayout