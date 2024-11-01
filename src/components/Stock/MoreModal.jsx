import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";
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
  return (
    <View style={styles.modalContainer}>
      <Modal
        animationType="slide"
        transparent={true} // Set to true for a backdrop effect
        visible={moreModalVisible}
        onRequestClose={() => setMoreModalVisible(false)} // Properly close the modal
      >
        <View style={styles.modalContent}>
          <View>
            <TouchableOpacity onPress={() => handleSalesClick()}>
              <Text style={styles.modalText}>Sales</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterClick()}>
              <Text style={styles.modalText}>Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.modalText}>Date Ascending</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.modalText}>Date Descending</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.modalText}>Select Range</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.modalText}>Print</Text>
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

export default MoreModal;
