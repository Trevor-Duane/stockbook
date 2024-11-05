import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import logo from "../../assets/logoo.png"; 
import { useAuth } from "../../src/context/AuthContext"; 
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const RegisterScreen = () => {
  const { register } = useAuth();

  const navigation = useNavigation();

  // State variables for the registration form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (
      !username ||
      !email ||
      !mobile ||
      !password ||
      !confirm_password
    ) {
      showMessage({
        message: "Please fill in all fields.",
        type: "danger",
      });
      return;
    }

    if (password !== confirm_password) {
      showMessage({
        message: "Passwords do not match.",
        type: "danger",
      });
      return;
    }

    try {
      await register(username, email, mobile, address, password, confirm_password);
      showMessage({
        message: "Registration successful, Login!",
        type: "success",
      });
      navigation.navigate("Login")
      // Optionally navigate to a different screen after successful registration
    } catch (error) {
      showMessage({
        message: "Registration failed. Please try again.",
        type: "danger",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.appName}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      /> */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={showPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#663399"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.password2Container}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirm_password}
          onChangeText={setConfirm_password}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={showConfirmPassword ? "visibility" : "visibility-off"}
            size={24}
            color="#663399"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#663399",
    marginBottom: 20,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  password2Container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#663399",
    paddingVertical: 10,
    width: "100%",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
