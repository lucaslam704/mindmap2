import React, { useState, useEffect } from 'react';
import { View, TextInput, Alert, Image, Text, ImageStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signInWithEmail, signInWithGoogleCredential } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { createAuthStyles } from '../styles/UserAuthScreen.styles';

// Initialize WebBrowser
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createAuthStyles(theme);

  // Setup Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "208612764076-dppsfsoktqfcc6r990la6airkutteecn.apps.googleusercontent.com",
    iosClientId: "208612764076-jmqb17e7a627elqoqa6lsbdrb1ivlg3c.apps.googleusercontent.com",
    webClientId: "208612764076-dppsfsoktqfcc6r990la6airkutteecn.apps.googleusercontent.com",
  });

  // Handle Google Sign In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignIn(authentication);
    }
  }, [response]);

  const handleEmailLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleSignIn = async (authentication: any) => {
    try {
      if (authentication?.idToken && authentication?.accessToken) {
        await signInWithGoogleCredential(
          authentication.idToken,
          authentication.accessToken
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await promptAsync();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to initiate Google Sign In');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme.colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleEmailLogin}
        style={styles.button}
        buttonColor="rgb(24, 91, 207)"
      >
        Login with Email
      </Button>
      <Button
        mode="contained"
        onPress={handleGoogleLogin}
        style={[styles.button, styles.googleButton]}
        contentStyle={styles.googleButtonContent}
      >
        <Image
          source={require('../../public/images/Google.png')}
          style={styles.googleIcon as ImageStyle}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('ForgotPassword' as never)}
        textColor="rgb(82, 82, 82)"
      >
        Forgot Password?
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('SignUp' as never)}
        textColor="rgb(211, 63, 0)"
      >
        Don't have an account? Sign Up
      </Button>
    </View>
  );
}




