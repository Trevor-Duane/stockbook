import React from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../../src/context/AuthContext";

function ProfileScreen({ onLogout }) {
  const { logout, userData } = useAuth(); // Access logout function from context
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const handleLogout = async () => {
    await logout(); // Call logout from context
    // Optionally, navigate to the login screen here if needed
  };

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
        <StatusBar backgroundColor="#e2c0f8" barStyle="dark-content" />
        <View style={styles.appBarContainer}>
          <Text style={styles.title}>User Profile</Text>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="search" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="more-vert" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Other profile details can go here */}
        <View style={styles.profileInfoContainer}>
          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            {userData?.profilePicture ? (
              <Image
                source={{ uri: userData.profilePicture }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <MaterialIcons
                  name="account-circle"
                  size={100}
                  color="#663399"
                />
              </View>
            )}
          </View>

          {userData && (
            <>
              <Text style={styles.profileLabel}>Name:</Text>
              <Text style={styles.profileText}>{userData.username}</Text>
              <Text style={styles.profileLabel}>Email:</Text>
              <Text style={styles.profileText}>{userData.email}</Text>
              {/* Add more user data fields as needed */}
            </>
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#663399",
    height: 56,
    paddingHorizontal: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  rightIcons: {
    flexDirection: "row",
  },
  iconButton: {
    paddingHorizontal: 8,
  },
  profileInfoContainer: {
    padding: 20,
    alignItems: "center", // Center the profile information
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Make the image round
    borderWidth: 2,
    borderColor: "#663399", // Optional: Add a border
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#663399", // Optional: Add a border
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#663399",
  },
  profileText: {
    fontSize: 16,
    marginBottom: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3b30", // You can customize the color
    borderRadius: 5,
    paddingVertical: 10,
    margin: 20,
    elevation: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProfileScreen;
