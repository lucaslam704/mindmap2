import { StyleSheet } from 'react-native';
import { Theme } from './theme';

export const createAuthStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: theme.colors.text,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  button: {
    marginVertical: 10,
  },
  // Google Sign In specific styles
  googleButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain'
  },
  googleButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  // Picker styles
  pickerSelectStyles: {
    inputIOS: {
      height: 40,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
      backgroundColor: 'transparent',
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    inputAndroid: {
      height: 40,
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 10,
      paddingHorizontal: 10,
      backgroundColor: 'transparent',
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    placeholder: {
      color: theme.colors.textSecondary,
    },
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
});




