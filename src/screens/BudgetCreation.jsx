import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import formatCurrencyShs from "../utils/currencyFormatter";
import axios from "axios";

const BudgetCreation = ({ route }) => {
  const navigation = useNavigation();

  const {budgetHead, fromDate, toDate, budgetTotal, createdBy, budgetStatus, remarks } = route.params.formData;

  console.log("console logged from BudgetCreation", budgetHead)

  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const [shoppingList, setShoppingList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [organizedItems, setOrganizedItems] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  // Fetch shopping list
  useEffect(() => {
    const fetchShoppingList = async () => {
      try {
        const response = await axios.get(
          "https://api.tendaafrica.net/api/list_shopping_items"
        );
        setShoppingList(response.data.data);
        setItems(
          response.data.data.map((item) => ({
            label: item.item_name,
            value: item.id,
            price: item.unit_price,
            section: item.section,
          }))
        );
      } catch (error) {
        console.error("Error fetching shopping list:", error);
      }
    };

    fetchShoppingList();
  }, []);

  // Organize items
  useEffect(() => {
    const groupedItems = selectedItems.reduce((acc, id) => {
      const item = shoppingList.find((item) => item.id === id);
      if (item) {
        if (!acc[item.section]) acc[item.section] = [];
        acc[item.section].push({ ...item, quantity: 0 });
      }
      return acc;
    }, {});
    setOrganizedItems(groupedItems);
  }, [selectedItems, shoppingList]);

  // Handle quantity change
  const handleQuantityChange = (section, itemId, newQuantity) => {
    const updatedSections = { ...organizedItems };
    updatedSections[section] = updatedSections[section].map((item) =>
      item.id === itemId
        ? { ...item, quantity: parseInt(newQuantity) || 0 }
        : item
    );
    setOrganizedItems(updatedSections);
  };

  // Calculate grand total
  useEffect(() => {
    const total = Object.values(organizedItems).reduce((acc, section) => {
      const sectionTotal = section.reduce(
        (sum, item) => sum + item.unit_price * (parseInt(item.quantity) || 0),
        0
      );
      return acc + sectionTotal;
    }, 0);
    setGrandTotal(total);
  }, [organizedItems]);

  // Handle budget submission
  const handleSubmit = () => {
    Alert.alert("Budget Submitted", `Total: ${JSON.stringify(organizedItems)}`);
  };

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
        <StatusBar backgroundColor="#e2c0f8" barStyle="dark-content" />
        <View style={styles.appBarContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Budget</Text>
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <View style={styles.dropdownConatiner}>
          <DropDownPicker
            multiple={true}
            open={open}
            setOpen={setOpen}
            items={items}
            setItems={setItems}
            value={selectedItems}
            setValue={setSelectedItems}
            placeholder="Select items"
            style={styles.dropdown}
          />
        </View>

        <ScrollView style={styles.scrollContainer}>
          {Object.entries(organizedItems).map(([section, items]) => (
            <View key={section} style={styles.section}>
              <Text style={styles.sectionHeader}>{section}</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Item Name</Text>
                <Text style={styles.tableHeaderText}>Quantity</Text>
                <Text style={styles.tableHeaderText}>Price</Text>
              </View>
              {items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{item.item_name}({item.uom})</Text>
                  <TextInput
                    style={styles.quantityInput}
                    keyboardType="numeric"
                    value={String(item.quantity)}
                    onChangeText={(text) =>
                      handleQuantityChange(section, item.id, text)
                    }
                  />
                  <Text style={styles.itemPrice}>
                    {formatCurrencyShs(item.unit_price * item.quantity)}
                  </Text>
                </View>
              ))}
              <Text style={styles.sectionTotal}>
                Section Total:{" "}
                {formatCurrencyShs(
                  items.reduce(
                    (sum, item) =>
                      sum + item.unit_price * (parseInt(item.quantity) || 0),
                    0
                  )
                )}
              </Text>
              {/* <Text style={styles.sectionTotal}>
                Section Total: $
                {items
                  .reduce(
                    (sum, item) =>
                      sum + item.unit_price * (parseInt(item.quantity) || 0),
                    0
                  )
                  .toFixed(2)}
              </Text> */}
            </View>
          ))}
        </ScrollView>

        <View style={styles.submitContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              Submit Budget ({formatCurrencyShs(grandTotal)})
            </Text>
            {/* <Text style={styles.submitText}>
              Submit Budget (${grandTotal.toFixed(2)})
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: "#663399",
  },
  appBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#663399",
    height: 56,
    paddingHorizontal: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    paddingHorizontal: 8,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  dropdownConatiner: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#663399",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 4,
  },
  tableHeaderText: {
    // flex: 1,
    fontWeight: "bold",
    // textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#f7f7f7",
    marginBottom: 4,
    borderRadius: 4,
  },
  itemName: {
    flex: 2,
    fontSize: 14,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    textAlign: "center",
  },
  itemPrice: {
    flex: 1,
    fontSize: 14,
    textAlign: "right",
  },
  sectionTotal: {
    textAlign: "right",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 12,
    color: "#333",
  },
  submitContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#663399",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BudgetCreation;
