import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import { NetworkStatus } from './src/components/NetworkStatus';

import * as Notifications from 'expo-notifications';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Ask for permissions
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Notification permission not granted');
        }

        // Android-specific: create default notification channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT,
            sound: null, // ✅ FIXED: must be null or a string filename
          });
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error during initialization');
      } finally {
        setIsLoading(false);
      }
    };

    prepareApp();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <PaperProvider>
          <AppNavigator />
          <NetworkStatus />
        </PaperProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
