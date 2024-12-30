import React from 'react';
import { Tabs } from 'expo-router';
import { HomeIcon, BellIcon, ChartPieIcon, CalendarIcon } from "react-native-heroicons/outline";

const TabsLayout  = () => {
  return (
    <Tabs
    screenOptions={{ 
      tabBarInactiveTintColor: '#CDCDE0',
      tabBarActiveTintColor: "#9D4EDD",
      tabBarStyle:{
        backgroundColor: '#F7FFFF',
        borderTopWidth: 0,
        height : "7%"
      }
     }}>
      <Tabs.Screen
        name="Homepage"
        options={{
          title: "Homepage",
          headerShown: false,   // Teks pada tab bar disembunyikan
          tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="Notification"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color }) => <BellIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="Charts"
        options={{
          title: "Charts",
          headerShown: false,
          tabBarIcon: ({ color }) => <ChartPieIcon color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="Logs"
        options={{
          title: "Logs",
          headerShown: false,
          tabBarIcon: ({ color }) => <CalendarIcon color={color} size={24} />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout ;
