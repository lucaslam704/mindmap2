import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { signUpWithEmailAndSecurityQuestion } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import RNPickerSelect from 'react-native-picker-select';
import { createAuthStyles } from '../styles/UserAuthScreen.styles';

const securityQuestions = [
  { label: 'What was your first pet\'s name?', value: 'pet' },
  { label: 'In which city were you born?', value: 'city' },
  { label: 'What is your mother\'s maiden name?', value: 'maiden' },
  { label: 'What was your first car?', value: 'car' },
];

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createAuthStyles(theme);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!securityQuestion || !securityAnswer) {
      Alert.alert('Error', 'Please select a security question and provide an answer');
      return;
    }

    try {
      await signUpWithEmailAndSecurityQuestion(
        email,
        password,
        securityQuestion,
        securityAnswer
      );
      Alert.alert('Success', 'Account created successfully');
      navigation.goBack();
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={theme.colors.textSecondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <RNPickerSelect
        onValueChange={(value) => setSecurityQuestion(value)}
        items={securityQuestions}
        style={{
          ...styles.pickerSelectStyles,
          iconContainer: {
            top: 10,
            right: 12,
          },
        }}
        placeholder={{
          label: 'Press to select a security question...',
          value: null,
        }}
        useNativeAndroidPickerStyle={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Security Answer"
        placeholderTextColor={theme.colors.textSecondary}
        value={securityAnswer}
        onChangeText={setSecurityAnswer}
      />
      <Button
        mode="contained"
        onPress={handleSignUp}
        style={styles.button}
        buttonColor="rgb(24, 91, 207)"
      >
        Sign Up
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        textColor="rgb(211, 63, 0)"
      >
        Already have an account? Login
      </Button>
    </View>
  );
};
