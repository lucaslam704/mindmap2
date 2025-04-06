import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { networkService } from '../services/networkService';
import { useTheme } from '../context/ThemeContext';

export const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(networkService.isNetworkOnline());
  const { theme } = useTheme();

  useEffect(() => {
    const listener = (online: boolean) => setIsOnline(online);
    networkService.addListener(listener);
    return () => networkService.removeListener(listener);
  }, []);

  if (isOnline) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.error }]}>
      <Text style={styles.text}>Offline Mode - Changes will sync when online</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 12,
  },
});