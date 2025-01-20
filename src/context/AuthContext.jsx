// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const apiURL = "https://api.tendaafrica.net"

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('userData');
        if (token && user) {
          setUserToken(token);
          setUserData(JSON.parse(user));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);


  const login = async (email, password) => {
    try {
      const response = await axios.post(`${apiURL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data; 
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      setUserToken(token);
      setUserData(user); 
      setIsLoggedIn(true);

      return user; 
      
    } catch (error) {
      throw new Error('Login failed');
    }
  };
  const register = async (username, email, mobile, address, password, confirm_password) => {
    try {
      const response = await axios.post(`${apiURL}/auth/register`, {
        username,
        email,
        address: "TendaCafe",
        mobile,
        password,
        confirm_password,
      });
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    setIsLoggedIn(false);
    setUserToken(null);
    setUserData(null); 
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData'); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register, userData, apiURL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
