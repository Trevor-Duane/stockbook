import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import RootNavigation from './src/components/navigation/RootStack';
import LoginScreen from './src/screens/LoginScreen';
import FlashMessage from 'react-native-flash-message';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import React, { useEffect } from 'react';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#e2c0f8" barStyle="dark-content" />
        <MainNavigator />
        <FlashMessage position="top" style={{ marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }} />
      </NavigationContainer>
    </AuthProvider>
  );
}

const MainNavigator = () => {
  const { isLoggedIn } = useAuth(); // Access isLoggedIn from AuthContext

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // Render the main app screens if logged in
        <Stack.Screen name="Root" component={RootNavigation} />
      ) : (
        // Render the login screen if not logged in
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
