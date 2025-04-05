import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { verifySecurityQuestionAndResetPassword, getSecurityQuestion, verifySecurityAnswer } from '../services/authService';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPasswordScreen() {
  const [stage, setStage] = useState(1); // 1: email, 2: security question, 3: new password
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleVerifyEmail = async () => {
    try {
      const question = await getSecurityQuestion(email);
      setSecurityQuestion(question);
      setStage(2);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleVerifySecurityAnswer = async () => {
    try {
      await verifySecurityAnswer(email, securityAnswer);
      setStage(3);
    } catch (error: any) {
      Alert.alert('Invalid', 'Incorrect security answer');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Invalid', 'Passwords do not match');
      return;
    }

    try {
      await verifySecurityQuestionAndResetPassword(
        email,
        securityAnswer,
        newPassword
      );
      Alert.alert('Success!', 'Password reset successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const renderStage1 = () => (
    <>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Enter your email address
      </Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder="Email"
        placeholderTextColor={theme.colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Button
        mode="contained"
        onPress={handleVerifyEmail}
        style={styles.button}
        buttonColor="rgb(24, 91, 207)"
      >
        Next
      </Button>
    </>
  );

  const renderStage2 = () => (
    <>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Security Question
      </Text>
      <Text style={[styles.question, { color: theme.colors.text }]}>
        {securityQuestion}
      </Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder="Your Answer"
        placeholderTextColor={theme.colors.textSecondary}
        value={securityAnswer}
        onChangeText={setSecurityAnswer}
      />
      <Button
        mode="contained"
        onPress={handleVerifySecurityAnswer}
        style={styles.button}
        buttonColor="rgb(24, 91, 207)"
      >
        Verify Answer
      </Button>
    </>
  );

  const renderStage3 = () => (
    <>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Reset Password
      </Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder="New Password"
        placeholderTextColor={theme.colors.textSecondary}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder="Confirm New Password"
        placeholderTextColor={theme.colors.textSecondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={handleResetPassword}
        style={styles.button}
        buttonColor="rgb(24, 91, 207)"
      >
        Reset Password
      </Button>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {stage === 1 && renderStage1()}
      {stage === 2 && renderStage2()}
      {stage === 3 && renderStage3()}
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        textColor="rgb(82, 82, 82)"
      >
        Back to Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginVertical: 10,
  },
});
