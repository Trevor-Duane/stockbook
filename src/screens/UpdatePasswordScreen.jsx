import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { showMessage } from "react-native-flash-message";

const UpdatePasswordScreen = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State variables for showing or hiding passwords
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const { apiURL, userData, userToken, logout } = useAuth();

  const handleUpdatePassword = async () => {
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation do not match.");
      return;
    }

    try {
      // Send password update request
      await axios.post(`${apiURL}/auth/update-password`, {
        userId: Number(userData.id),
        currentPassword: currentPassword,
        newPassword: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });

      showMessage({
        message: "Password updated successfully! Please log in again.",
        type: "success",
      });

      // Log the user out and redirect to login screen
      logout();
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "Could not update password. Please try again.");
    }
  };

  return (
    <>
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
        ]}
      >
        <StatusBar backgroundColor="#e2c0f8" barStyle="dark-content" />
        <View style={styles.appBarContainer}>
          <View style={styles.arrowTitle}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="#663399" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.header}>Update Password</Text>

        {/* Current Password Field */}
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter current password"
            secureTextEntry={!isCurrentPasswordVisible}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
          >
            <MaterialIcons
              name={isCurrentPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>

        {/* New Password Field */}
        <Text style={styles.label}>New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry={!isNewPasswordVisible}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
          >
            <MaterialIcons
              name={isNewPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>

        {/* Confirm New Password Field */}
        <Text style={styles.label}>Confirm New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm new password"
            secureTextEntry={!isConfirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          >
            <MaterialIcons
              name={isConfirmPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
              color="grey"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdatePassword}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    height: 56,
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 15,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  updateButton: {
    backgroundColor: "#663399",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UpdatePasswordScreen;
