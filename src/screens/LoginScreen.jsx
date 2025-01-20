import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import logo from '../../assets/logoo.png';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../src/context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = () => {
  const { login } = useAuth();

  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (email === '' || password === '') {
      showMessage({
        message: "Please enter both username and password",
        type: "danger",
      });
      return;
    }
    try {
      const user = await login(email, password);
      if (!user.isVerified) {
        navigation.navigate('Verification')
      }

      showMessage({
        message: "Login successful!",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: "Login failed. Please try again.",
        type: "danger",
      });
    }
  };
  const handleRegisterClick = (rowData) => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.appName}>StockBook</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}sssss
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#663399" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleRegisterClick()} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Register here...</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#663399',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#663399',
    paddingVertical: 10,
    width: "100%",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: "center",
    fontWeight: 'bold',
  },
  registerButton:{
    alignSelf: 'flex-end',
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 5,
    
  },
  registerButtonText: {
    textAlign: "right",
    color: "#663399"
  }
});

export default LoginScreen;
