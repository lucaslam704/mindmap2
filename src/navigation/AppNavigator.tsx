
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SchoolScreen from "../screens/SchoolScreen";
import ChoresScreen from "../screens/ChoresScreen";
import ErrandsScreen from "../screens/ErrandsScreen";
import TaskDetailsScreen from "../screens/TaskDetailsScreen";
import CompletedTaskScreen from "../screens/CompletedTaskScreen";
import LoginScreen from '../screens/LoginScreen';
import { Ionicons } from "@expo/vector-icons";
import { TaskType } from "../services/firestoreService";
import { useTheme } from '../context/ThemeContext';
import { IconButton } from 'react-native-paper';
import { subscribeToAuthChanges } from '../services/authService';
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SignUpScreen from "../screens/SignUpScreen";
import { Image } from 'react-native';
import SettingScreen from '../screens/SettingScreen';

type TaskStackParamList = {
  SchoolTasks: undefined;
  ChoresTasks: undefined;
  ErrandsTasks: undefined;
  TaskDetails: { task: TaskType; fromCompleted?: boolean };
  CompletedTask: { category: string };
};

type TabParamList = {
  School: undefined;
  Chores: undefined;
  Errands: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

type StackNavigation = NativeStackNavigationProp<TaskStackParamList & { Settings: undefined }>;

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<TaskStackParamList & { Settings: undefined }>();
const AuthStack = createStackNavigator<AuthStackParamList>();

function SchoolStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: theme.colors.background },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen 
        name="SchoolTasks" 
        component={SchoolScreen}
        options={{
          title: "School",
          headerShown: false // Hide the stack header
        }} 
      />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen 
        name="TaskDetails" 
        component={TaskDetailsScreen} 
        options={{ title: "Task Details" }} 
      />
      <Stack.Screen 
        name="CompletedTask" 
        component={CompletedTaskScreen} 
        options={{ title: "Completed Task" }} 
      />
    </Stack.Navigator>
  );
}

function ChoresStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: theme.colors.background },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen 
        name="ChoresTasks" 
        component={ChoresScreen}
        options={{
          title: "Chores",
          headerShown: false
        }} 
      />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="CompletedTask" component={CompletedTaskScreen} />
    </Stack.Navigator>
  );
}

function ErrandsStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: theme.colors.background },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
      }}
    >
      <Stack.Screen 
        name="ErrandsTasks" 
        component={ErrandsScreen}
        options={{
          title: "Errands",
          headerShown: false
        }} 
      />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="CompletedTask" component={CompletedTaskScreen} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function TabNavigator() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigation>();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        // Add headerLeft for settings
        headerLeft: () => (
          <IconButton
            icon="cog"
            iconColor={theme.colors.text}
            size={24}
            onPress={() => navigation.navigate('Settings')}
            style={{ marginLeft: 10 }}
          />
        ),
        // Keep the theme toggle on the right
        headerRight: () => (
          <IconButton
            icon={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
            iconColor={theme.colors.text}
            size={24}
            onPress={toggleTheme}
            style={{ marginRight: 10 }}
          />
        ),
      }}
    >
      <Tab.Screen 
        name="School" 
        component={SchoolStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require('../../public/images/School.png')}
              style={{
                width: size,
                height: size,
                tintColor: color
              }}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Chores" 
        component={ChoresStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require('../../public/images/Chores.png')}
              style={{
                width: size,
                height: size,
                tintColor: color
              }}
            />
          )
        }}
      />
      <Tab.Screen 
        name="Errands" 
        component={ErrandsStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Image
              source={require('../../public/images/Errands.png')}
              style={{
                width: size,
                height: size,
                tintColor: color
              }}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <TabNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
