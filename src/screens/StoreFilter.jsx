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
  Button,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const StoreFilter = () => {
  const [itemNames, setItemNames] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [singleDate, setSingleDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showSingleDatePicker, setShowSingleDatePicker] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemResponse = await axios.get(
          "https://lionfish-many-wildly.ngrok-free.app/api/store_items"
        );
        const productResponse = await axios.get(
          "https://lionfish-many-wildly.ngrok-free.app/api/items"
        );
        setItemNames(itemResponse.data.data);
        setProductNames(productResponse.data.data);
      } catch (error) {
        console.error("Error fetching items or products:", error);
      }
    };
    fetchData();
  }, []);

  const applyFilters = async () => {
    try {
      const response = await axios.post(
        "https://lionfish-many-wildly.ngrok-free.app/api/filter_sales",
        {
          item_name: selectedItemName,
          product_name: selectedProductName,
          startDate: startDate ? startDate.toISOString().split("T")[0] : null,
          endDate: endDate ? endDate.toISOString().split("T")[0] : null,
          singleDate: singleDate
            ? singleDate.toISOString().split("T")[0]
            : null,
        }
      );
      setFilteredData(response.data.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  const clearFilters = () => {
    setSelectedItemName("");
    setSelectedProductName("");
    setStartDate(null);
    setEndDate(null);
    setSingleDate(null);
    setFilteredData([]);
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
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>Filters</Text>
          </View>
          <View style={styles.rightIconsText}>
              <Text style={styles.rightText}>Custom Filters</Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView>
        <View style={styles.filterControls}>
          {/* Item Name and Product Name Dropdown */}

          <View style={styles.pickersContainer}>
            <Picker
              selectedValue={selectedItemName}
              style={styles.picker}
              onValueChange={(value) => setSelectedItemName(value)}
            >
              <Picker.Item label="Select Item" value="" />
              {itemNames.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.item_name}
                  value={item.item_name}
                />
              ))}
            </Picker>

            <Picker
              selectedValue={selectedProductName}
              onValueChange={(value) => setSelectedProductName(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select Product" value="" />
              {productNames.map((product) => (
                <Picker.Item
                  key={product.id}
                  label={product.item_name}
                  value={product.item_name}
                />
              ))}
            </Picker>
          </View>

          {/* Single Date Picker */}
          <View style={styles.singleDateContainer}>
            <TouchableOpacity
              style={styles.singleDateInput}
              onPress={() => setShowSingleDatePicker(true)}
            >
              <Text>
                {singleDate ? singleDate.toDateString() : "Select Single Date"}
              </Text>
              <MaterialIcons name="calendar-month" size={20} color="#000" />
            </TouchableOpacity>
            {showSingleDatePicker && (
              <DateTimePicker
                value={singleDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowSingleDatePicker(false);
                  setSingleDate(date || singleDate);
                }}
              />
            )}
          </View>

          {/* Date Range Pickers */}
          <View style={styles.rangeDatePicker}>
            <TouchableOpacity
              style={styles.rangeDate}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text>
                {startDate ? startDate.toDateString() : "Select Start Date"}
              </Text>
              <MaterialIcons name="calendar-month" size={20} color="#000" />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  setStartDate(date || startDate);
                }}
              />
            )}
            <TouchableOpacity
              style={styles.rangeDate}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text>
                {endDate ? endDate.toDateString() : "Select End Date"}
              </Text>
              <MaterialIcons name="calendar-month" size={20} color="#000" />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  setEndDate(date || endDate);
                }}
              />
            )}
          </View>

          {/* Filter and Clear Buttons */}
          <View style={styles.filterControlsButtons}>
            <Button title="Apply Filters" onPress={applyFilters} />
            <Button title="Clear Filters" onPress={clearFilters} />
          </View>
        </View>

        <View style={styles.scrollContainer}>
          {/* Display Filtered Data in ScrollView */}
          <ScrollView style={styles.ScrollViewContainer}>
            {filteredData.map((item, index) => (
              <View key={index} style={{ padding: 10, borderBottomWidth: 0.5 }}>
                <Text>Product Name: {item.product_name}</Text>
                <Text>Recipe Item: {item.item_name}</Text>
                <Text>Preparations: {item.item_count}</Text>
                <Text>Usage Amount: {item.total_usage_amount}g</Text>
                <Text>Amount In Store: {item.amount_in_store}g</Text>
                <Text>Total Sales: {item.sales}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};
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
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  rightIconsText: {
    flexDirection: "row",
  },
  rightText: {
    color: "#e2c0f8"
  },
  budgetTitle: {
    color: "#e2c0f8",
    fontWeight: "bold",
  },
  iconButton: {
    paddingHorizontal: 8,
  },
  arrowTitle: {
    flexDirection: "row",
  },

  //filters container
  filterControls: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: "#663399",
  },

  //pickers styles
  pickersContainer: {
    flexDirection: "row",
  },
  picker: {
    backgroundColor: "#fff",
    flex: 1,
    height: 40,
    marginHorizontal: 2,
    width: "50%",
  },

  //Single Datestyles
  singleDateContainer: {
    marginVertical: 8,
  },
  singleDateInput: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 40,
    marginHorizontal: 2,
  },

  //Range Date Picker
  rangeDatePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  rangeDate: {
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    width: "50%",
    height: 40,
    marginHorizontal: 2,
  },
  //filterControlsButtons
  filterControlsButtons: {
    paddingHorizontal: 5,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  //Scroll Container
  scrollContainer: {
    paddingBottom: 5
  },
  ScrollViewContainer: {
    paddingBottom: 20
  }
});
export default StoreFilter;
