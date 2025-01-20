import React, { useState, useEffect } from 'react';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Dimensions, Text, SafeAreaView, ScrollView, TouchableOpacity, View, StyleSheet, Platform, StatusBar } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useAuth } from '../../src/context/AuthContext';
import { Table, Row } from "react-native-reanimated-table";
import axios from "axios";
import TakeInventory from '../components/Stock/TakeInventory';

function InventoryScreen() {
  const [filterDate, setFilterDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
  const [widthArr, setWidthArr] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [inventoryAddModal, setInventoryAddModal] = useState(false)

  const { apiURL } = useAuth();

  const [tableHead, setTableHead] = useState([
    "Id",
    "Inventory Date",
    "Item Name",
    "Section",
    "UOM",
    "Quantity Received",
  ]);

  const updateTableWidths = () => {
    const screenWidth = Dimensions.get("window").width;
    const calculatedWidths = [
      screenWidth * 0.1,
      screenWidth * 0.2,
      screenWidth * 0.3,
      screenWidth * 0.3,
      screenWidth * 0.1,
      screenWidth * 0.25,
    ];
    setWidthArr(calculatedWidths);
  };

  useEffect(() => {
    updateTableWidths();
    const subscription = Dimensions.addEventListener("change", updateTableWidths);
    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/list_inventory`);
      const apiData = response.data.data;

      const formattedData = apiData.map((item) => [
        item.id,
        item.inventory_date,
        item.item_name,
        item.section,
        item.uom,
        item.quantity_recieved,
      ]);

      setTableData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filterDataByDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0]; // format to 'YYYY-MM-DD'
    const filtered = tableData.filter((row) => row[1] === formattedDate);
    setFilteredData(filtered);
  };

  const clearFilter = () => {
    setFilterDate(null);
    setFilteredData(tableData);
  };

  const handleAddInventory = () => {
    setInventoryAddModal(true);
  }

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
        <StatusBar backgroundColor="#e2c0f8" barStyle="dark-content" />
        <View style={styles.appBarContainer}>
          <Text style={styles.title}>Inventory</Text>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={handleAddInventory}>
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filterControlls}>
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{filterDate ? filterDate.toDateString() : "Select Date"}</Text>
              <MaterialIcons name="calendar-month" size={20} color="#000" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={filterDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setFilterDate(date);
                    filterDataByDate(date);
                  }
                }}
              />
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
              <Text style={styles.clearButtonText}>Clear Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.scrollContainer}>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              <Row data={tableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                {filteredData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr}
                    style={[styles.row, index % 2 && { backgroundColor: "#FFF" }]}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>

        <TakeInventory
        animationType="slide"
        refetchInventoryList={fetchData}
        inventoryAddModal={inventoryAddModal}
        setInventoryAddModal={setInventoryAddModal}
        />
      </View>
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
  filterControlls: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateContainer: {
    width: "70%",
    padding: 6,
  },
  dateInput: {
    paddingHorizontal: 15,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 40,
  },
  buttonContainer: {
    width: "30%",
    padding: 6,
  },
  clearButton: {
    height: 40,
    borderRadius: 4,
    fontWeight: "bold",
    backgroundColor: "#f89c0e",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  scrollContainer: {
    marginBottom: 60,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 40,
    backgroundColor: "#ebf8a4",
  },
  text: {
    textAlign: "center",
    fontWeight: "400",
  },
  tableContainer: {
    marginBottom: 20,
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
    backgroundColor: "#dfdfdf",
  },
});

export default InventoryScreen;
