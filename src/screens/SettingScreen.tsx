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
        <View style={styles.settingsGroup}>
          <Button
            mode="outlined"
            onPress={() => console.log('Change Password')}
            style={styles.settingsButton}
          >
            Change Password
          </Button>
          <Button
            mode="outlined"
            onPress={() => console.log('Change Security Q&A')}
            style={styles.settingsButton}
          >
            Change Security Q&A
          </Button>
          <Button
            mode="outlined"
            onPress={() => console.log('Terms & Conditions')}
            style={styles.settingsButton}
          >
            Terms & Conditions
          </Button>
          <Button
            mode="outlined"
            onPress={() => console.log('Contact Us')}
            style={styles.settingsButton}
          >
            About / Contact Us
          </Button>
        </View>

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

      <Text style={[styles.version, { color: theme.colors.textSecondary }]}>Mind Map version 1.0.1</Text>
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
    width: 180,
    height: 60,
  },
  content: {
    flex: 1,
  },
  settingsGroup: {
    marginBottom: 30,
  },
  settingsButton: {
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutButton: {
    borderRadius: 8,
    marginTop: 20,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
});
