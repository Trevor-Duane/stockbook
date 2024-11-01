import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { showMessage } from "react-native-flash-message";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const TakeInventory = ({
  inventoryAddModal,
  setInventoryAddModal,
  refetchInventoryList,
}) => {
  const [shoplist, setShoplist] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityReceived, setQuantityReceived] = useState("");
  const { apiURL } = useAuth();

  // Fetch shopping items
  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/list_shopping_items`);
      setShoplist(response.data.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedItem || quantityReceived === "") {
      Alert.alert(
        "Error",
        "Please select an item and enter quantity received."
      );
      return;
    }

    const payload = {
      item_id: selectedItem.id,
      quantity_received,
    };

    try {
      await axios.post(`${apiURL}/api/add_inventory`, payload);
      showMessage({
        message: "Inventory added successfully!",
        type: "success",
      });
      setInventoryAddModal(false);
      setSelectedItem(null);
      setQuantityReceived("");
      refetchInventoryList(); // Refresh inventory list after adding new entry
    } catch (error) {
      console.error("Error adding inventory:", error);
      Alert.alert("Error", "Could not add inventory. Please try again.");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={inventoryAddModal}
      onRequestClose={() => setInventoryAddModal(false)}
    >
      <View style={styles.modalView}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Inventory Form</Text>
            <FontAwesome
              name="close"
              size={20}
              color="#e2c0f8"
              onPress={() => setInventoryAddModal(false)}
            />
          </View>

          <View style={styles.inventoryContainer}>
            <View style={styles.pickersContainer}>
              <Picker
                selectedValue={selectedItem}
                style={styles.picker}
                onValueChange={(value) => {
                  const item = shoplist.find((i) => i.id === value);
                  setSelectedItem(item || null);
                }}
              >
                <Picker.Item label="Select Item" value="" />
                {shoplist.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.item_name}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>

            {selectedItem && (
              <>
                <View style={styles.inputGroupRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Item Name:</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedItem.item_name}
                      editable={false}
                    />
                  </View>
                </View>

                <View style={styles.inputGroupRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Section:</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedItem.section}
                      editable={false}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>UOM:</Text>
                    <TextInput
                      style={styles.input}
                      value={selectedItem.uom}
                      editable={false}
                    />
                  </View>
                </View>

                <View style={styles.inputGroupRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Quantity Received:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter quantity received"
                      value={quantityReceived}
                      onChangeText={setQuantityReceived}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    flexDirection: "column",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    height: 40,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  inventoryContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  pickersContainer: {
    marginBottom: 10,
  },
  picker: {
    backgroundColor: "#e2c0f8",
    marginBottom: 15,
    height: 40,
    marginHorizontal: 2,
  },
  input: {
    width: "100%",
    padding: 10,
    color: "black",
    backgroundColor: "#eae9e8",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: -20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#663399",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  inputGroupRow: {
    flexDirection: "row",
    columnGap: 4
  },
  inputGroup: {
    marginBottom: 10,
    flex: 1
  },
});

export default TakeInventory;
