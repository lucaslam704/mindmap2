import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  Text,
  Platform
} from 'react-native';
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
  const [securityQuestionLabel, setSecurityQuestionLabel] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
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

  const selectQuestion = (item: { value: string; label: string }) => {
    setSecurityQuestion(item.value);
    setSecurityQuestionLabel(item.label);
    setModalVisible(false);
  };

  // Custom picker for iOS, fallback to RNPickerSelect for Android
  const renderSecurityQuestionPicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 4,
              padding: 12,
              marginBottom: 16,
              backgroundColor: theme.colors.cardBackground,
            }}
          >
            <Text style={{ 
              color: securityQuestionLabel ? theme.colors.text : theme.colors.textSecondary 
            }}>
              {securityQuestionLabel || 'Press to select a security question...'}
            </Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
              <View style={{
                backgroundColor: theme.colors.cardBackground,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                maxHeight: '70%'
              }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  marginBottom: 15,
                  color: theme.colors.text
                }}>
                  Select a Security Question
                </Text>
                
                <FlatList
                  data={securityQuestions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        paddingVertical: 15,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.border
                      }}
                      onPress={() => selectQuestion(item)}
                    >
                      <Text style={{ color: theme.colors.text }}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
                
                <Button
                  mode="text"
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 10 }}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>
        </>
      );
    } else {
      // Use RNPickerSelect for Android
      return (
        <RNPickerSelect
          onValueChange={(value, index) => {
            setSecurityQuestion(value);
            if (value) {
              const selectedQuestion = securityQuestions.find(q => q.value === value);
              if (selectedQuestion) {
                setSecurityQuestionLabel(selectedQuestion.label);
              }
            }
          }}
          items={securityQuestions}
          style={{
            ...styles.pickerSelectStyles,
            inputAndroid: {
              fontSize: 16,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 8,
              color: theme.colors.text,
              paddingRight: 30,
              backgroundColor: theme.colors.cardBackground,
              marginBottom: 15,
            },
            iconContainer: {
              top: 10,
              right: 12,
            },
          }}
          placeholder={{
            label: 'Press to select a security question...',
            value: null,
            color: theme.colors.textSecondary,
          }}
          useNativeAndroidPickerStyle={false}
        />
      );
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
      
      {renderSecurityQuestionPicker()}
      
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
