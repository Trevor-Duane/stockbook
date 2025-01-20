import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Modal, View, Text, TextInput, Button, StyleSheet } from "react-native";

const BudgetModal = ({ visible, onClose }) => {
    const navigation = useNavigation();

  // Internal form state
  const [budgetHead, setBudgetHead] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [budgetTotal, setBudgetTotal] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [budgetStatus, setBudgetStatus] = useState("");
  const [remarks, setRemarks] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    if (!budgetHead || !fromDate || !toDate || !budgetTotal) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const formData = {
      budgetHead,
      fromDate,
      toDate,
      budgetTotal,
      createdBy,
      budgetStatus,
      remarks,
    };
  
    console.log("Form Data:", formData);
  
    // Navigate to BudgetCreation and pass formData
    navigation.navigate("BudgetCreation", { formData });
  
    // Clear fields after navigation
    setBudgetHead("");
    setFromDate("");
    setToDate("");
    setBudgetTotal("");
    setCreatedBy("");
    setBudgetStatus("");
    setRemarks("");
  
    // Close the modal
    onClose();
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Budget</Text>

          {/* Form Fields */}
          <TextInput
            style={styles.input}
            placeholder="Budget Head"
            value={budgetHead}
            onChangeText={setBudgetHead}
          />
          <TextInput
            style={styles.input}
            placeholder="From Date (YYYY-MM-DD)"
            value={fromDate}
            onChangeText={setFromDate}
          />
          <TextInput
            style={styles.input}
            placeholder="To Date (YYYY-MM-DD)"
            value={toDate}
            onChangeText={setToDate}
          />
          <TextInput
            style={styles.input}
            placeholder="Budget Total"
            keyboardType="numeric"
            value={budgetTotal}
            onChangeText={setBudgetTotal}
          />
          <TextInput
            style={styles.input}
            placeholder="Created By"
            value={createdBy}
            onChangeText={setCreatedBy}
          />
          <TextInput
            style={styles.input}
            placeholder="Budget Status"
            value={budgetStatus}
            onChangeText={setBudgetStatus}
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks"
            value={remarks}
            onChangeText={setRemarks}
          />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button title="Save" color="#663399" onPress={handleSubmit} />
            <Button title="Cancel" color="red" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});

export default BudgetModal;
