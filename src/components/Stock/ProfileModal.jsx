import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import CustomCB from "../customCheckbox/CustomCB";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const ProfileModal = ({ profileModalVisible, setProfileModalVisible }) => {
  const [isSelected, setSelection] = useState(false);
  const navigation = useNavigation();

  const handleClose = () => {
    setProfileModalVisible(false);
  };

  const handleFilterClick = () => {
    handleClose();
    navigation.navigate("Updates");
  };
  return (
    <View style={styles.modalContainer}>
      <Modal
        animationType="slide"
        transparent={true} // Set to true for a backdrop effect
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)} // Properly close the modal
      >
        <View style={styles.modalContent}>
          <View>
            
            <TouchableOpacity onPress={() => handleFilterClick()}>
              <Text style={styles.modalText}>Change Password</Text>
            </TouchableOpacity>
            
          </View>

          <View>
            <TouchableOpacity onPress={handleClose}>
              <MaterialIcons name="close" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "flex-start",
    marginLeft: 0,
  },
  modalContent: {
    position: "absolute",
    right: 0,
    backgroundColor: "white",
    borderRadius: 6,
    padding: 20,
    marginTop: 56,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: "fit-content",
  },
  modalItems: {
    flexDirection: "row",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ProfileModal;
