import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { signOut } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export default function SettingScreen() {
  const { theme, isDarkMode } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        <Image
          source={isDarkMode 
            ? require('../../public/images/MindMap-white.png')
            : require('../../public/images/MindMap.png')
          }
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.content}>
        <Button 
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor={theme.colors.lightBlue}
          textColor={theme.colors.white}
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
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    marginVertical: 10,
  },
  version: {
    textAlign: 'center',
    marginBottom: 20,
  },
});


