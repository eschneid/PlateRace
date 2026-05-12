// NOTE: This file is synced to C:\pr\PlateRacePTT\App.tsx
// Edit that file directly — this is a reference copy only.
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PTTScreen from './src/PTTScreen';
import PlatesScreen from './src/PlatesScreen';

const Tab = createBottomTabNavigator();

const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  border: '#30363D',
  blue: '#378ADD',
  textSecondary: '#8B949E',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: COLORS.surface,
              borderTopColor: COLORS.border,
              borderTopWidth: 1,
            },
            tabBarActiveTintColor: COLORS.blue,
            tabBarInactiveTintColor: COLORS.textSecondary,
            tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          }}
        >
          <Tab.Screen name="Call It" component={PTTScreen} />
          <Tab.Screen name="Plates" component={PlatesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
