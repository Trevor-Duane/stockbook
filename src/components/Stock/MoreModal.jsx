import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import CustomCB from "../customCheckbox/CustomCB";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const MoreModal = ({ moreModalVisible, setMoreModalVisible }) => {
  const [isSelected, setSelection] = useState(false);
  const navigation = useNavigation();

  const handleClose = () => {
    setMoreModalVisible(false);
  };

  const handleSalesClick = () => {
    handleClose();
    navigation.navigate("Details");
  };

  const handleFilterClick = () => {
    handleClose();
    navigation.navigate("Filter");
  };

  const handleReportsClick = () => {
    handleClose();
    navigation.navigate("Reports");
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={moreModalVisible}
      onRequestClose={() => setMoreModalVisible(false)} // Properly close the modal
    >
      <TouchableWithoutFeedback
        onPress={handleClose}
        style={styles.modalContent}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* ////// */}
            <TouchableOpacity style={styles.modalItems} onPress={() => handleReportsClick()}>
              <Text style={styles.modalText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingVertical: 20,
    marginTop: 48,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: 120,
  },
  modalItems: {
    flexDirection: "row",
    paddingHorizontal: 10,
    borderColor: "#cccccc",
    borderBottomWidth: .5,
    borderTopWidth: .5,
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

export default MoreModal;
