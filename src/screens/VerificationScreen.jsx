import React, { useState } from "react";
import { StyleSheet, View, TextInput, Button, Alert, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { showMessage } from "react-native-flash-message";


const VerificationScreen = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");


  const { apiURL, userData } = useAuth();

  const handleVerify = async () => {
    try {
        const response = await axios.post(`${apiURL}/auth/verify_user`, {
            email,
            code
        });
        if(response.status === 200){
            showMessage({
                message: "Verification Successful!",
                type: "success"
            })
            navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
        }
      } catch (error) {
        showMessage({
            message: "Verification Failed",
            type: "danger"
        })
    }
    
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.headerText}>
        <Text style={styles.appText}>Stock Book</Text>
        <Text style={styles.titleText}>Verification Code</Text>
        <Text style={styles.paraText}>Please type your email and the verification code sent to your system admin</Text>
      </View>

      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Enter Verification Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={styles.input}
      />
      <TouchableOpacity style={styles.verificationButton} onPress={handleVerify}>
        <Text style={styles.verificationButtonText}>Verify Account</Text>
      </TouchableOpacity>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    paddingVertical: 20
  },
  appText: {
    fontSize: 36,
    marginBottom: 30,
    color: "#663399",
    textAlign: "center",
    fontWeight: "bold"
  },
  titleText: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold"
  },
  paraText: {
    textAlign: 'center'
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  verificationButton: {
    backgroundColor: '#663399',
    paddingVertical: 10,
    width: "100%",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  verificationButtonText: {
    color: '#fff',
    textAlign: "center",
    fontWeight: 'bold',
  }
});

export default VerificationScreen;
