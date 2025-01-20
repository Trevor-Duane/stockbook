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
import { showMessage } from 'react-native-flash-message';
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const StockOutModal = ({ modalVisible, setModalVisible, refetchStockLogs }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [data, setData] = useState([]); 
  const [kot, setKOT] = useState(null)
  const [recipes, setRecipes] = useState([]); 
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    out_date: "",
    product_id: "",
    username: "",
  });

  const { apiURL, userData } = useAuth();

  // Handle form input changes
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fetch items from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/items`);
        console.log("Items response data", response.data);
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Fetch recipes based on selected item
  useEffect(() => {
    const fetchRecipes = async () => {
      if (selectedValue) {
        try {
          const response = await axios.get(`${apiURL}/api/recipes/${selectedValue}`);
          console.log("Recipes response data", response.data);
          setRecipes(response.data.data); // Assuming response.data.data contains the recipes
        } catch (error) {
          console.error(error);
        }
      } else {
        setRecipes([]); // Clear recipes if no item is selected
      }
    };
    fetchRecipes();
  }, [selectedValue]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!kot) {
      showMessage({
        message: "Please add kot number.",
        type: "warning",
      });
      return;
    }
    try {
      const response = await axios.post(`${apiURL}/api/store_log`,
        {
          kot: kot,
          out_date: currentDate,
          product_id: selectedValue,
          username: userData.username
        }
      ); // Replace with your API URL
      if (response.status === 201) {
        showMessage({
          message: "Stock Out recorded successfully!",
          type:"success"
        });
      
        setSelectedValue("")
        setKOT(null)
        refetchStockLogs();
        setModalVisible(false);
      } else {
        showMessage({
          message: "Failed to submit stock out data",
          type:"warning"
        });
      }
    } catch (error) {
      console.error(error);
      showMessage({
        message: "An error occurred while submitting stock out data.",
        type: "danger"
      })
    
    }
  };

  // Set the current date when the component mounts
  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    setCurrentDate(formattedDate);
  }, []);

  return (
    <View style={styles.container}>
      {/* Modal for Stock Out Form */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Stock Out Form</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.storeMOdalCloseButton}>
                <FontAwesome
                  name="close"
                  size={24}
                  color="#e2c0f8"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formViewContainer}>
              {/* Out Date */}
              <View>
                <Text style={styles.label}>Stockout Date:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Take out date"
                  value={currentDate}
                  editable={false}
                />
              </View>

              <View>
                <Text style={styles.label}>KOT Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="KOT Number"
                  value={kot}
                  onChangeText={setKOT}
                  keyboardType="numeric"
                      />
              </View>

              {/* Item Name Picker */}
              <View>
              <Text style={styles.label}>Item to Prepare:</Text>
                <Picker
                  selectedValue={selectedValue}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedValue(itemValue)}
                >
                  <Picker.Item label="Select an item" value="" />
                  {data.map((item) => (
                    <Picker.Item
                      key={item.id}
                      label={item.item_name}
                      value={item.id}
                    />
                  ))}
                </Picker>
              </View>

              {/* Displaying fetched recipes based on the selected item */}
              {recipes.length > 0 && (
                <View style={styles.recipeCard}>
                  <Text style={styles.label}>Recipe Includes:</Text>
                  {recipes.map((recipe) => (
                    <Text key={recipe.id} style={styles.recipeText}>
                      {recipe.store.item_name} - (Usage Amount: {recipe.usage_amount} {recipe.uom})
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              {/* Submit Button */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    flexDirection: "column",
    position: "relative",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    height: 60,
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
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ffffff",
  },
  storeMOdalCloseButton: {
    padding: 10
  },
  formViewContainer: {
    paddingVertical: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    color: "black",
    backgroundColor: "#eae9e8",
    marginBottom: 20,
    height: 48
    // borderRadius: 5,
  },
  buttonContainer: {
    marginTop: -20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#a020f8",
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
  recipeText: {
    marginVertical: 2,
  },
  picker: {
    backgroundColor: "#eae9e8",
    marginBottom: 10,
    borderRadius: 5,

  },
  recipeCard: {
    marginVertical: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#e2c0f8",
    borderBottomColor: "#e2c0f8",
    // backgroundColor: "#e2c0f8"
  }
});

export default StockOutModal;
