import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomCB from "../customCheckbox/CustomCB";
import { useNavigation } from "@react-navigation/native";

const FilesModal = ({ filesModalVisible, setFilesModalVisible }) => {
  const [isSelected, setSelection] = useState(false);
  const navigation = useNavigation();

  const handleClose = () => {
    setFilesModalVisible(false);
  };
  return (
    <View style={styles.modalContainer}>
      <Modal
        animationType="slide"
        transparent={true} // Set to true for a backdrop effect
        visible={filesModalVisible}
        onRequestClose={() => setFilesModalVisible(false)} // Properly close the modal
      >
        <View style={styles.modalContent}>
          <View>
            <TouchableOpacity>
              <Text style={styles.modalText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.modalText}>Excel</Text>
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
    right: 60,
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
    marginBottom: 10,
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

export default FilesModal;
