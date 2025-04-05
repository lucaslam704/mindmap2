import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { signOut } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export default function SettingScreen() {
  const { theme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <Button 
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor={theme.deleteButton.background}
        >
          Log Out
        </Button>
      </View>
      <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
        Mind Map version 1.0.1
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  logoutButton: {
    marginVertical: 10,
  },
  version: {
    textAlign: 'center',
    paddingBottom: 20,
    fontSize: 12,
  },
});