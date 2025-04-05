import React, { useState } from 'react';
import { View, TextInput, Alert, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmail, signInWithGoogle } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { createAuthStyles } from '../styles/UserAuthScreen.styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createAuthStyles(theme);

  const handleEmailLogin = async () => {
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
          style={styles.googleIcon}
          resizeMode="contain"
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('ForgotPassword')}
        textColor="rgb(82, 82, 82)"
      >
        Forgot Password?
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('SignUp')}
        textColor="rgb(211, 63, 0)"
      >
        Don't have an account? Sign Up
      </Button>
    </View>
  );
}


