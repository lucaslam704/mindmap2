import React from 'react';
import { Button } from 'react-native-paper';
import { useTheme } from '../context/ThemeContext';

const LogoutButton = ({ onPress }: { onPress: () => void }) => {
  const { theme } = useTheme();

  return (
    <Button
      mode="contained"
      onPress={onPress}
      buttonColor={theme.colors.lightBlue}
      textColor={theme.colors.white}
      style={{
        borderRadius: 4,
        marginHorizontal: 16,
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;