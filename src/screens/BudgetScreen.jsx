import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  Dimensions,
  RefreshControl, Modal, TextInput, Button
} from "react-native";

import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-reanimated-table";
import BudgetModal from "../components/Stock/BudgetModal";
import { useAuth } from "../../src/context/AuthContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

function BudgetScreen() {
  const navigation = useNavigation();
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

  const [refreshing, setRefreshing] = useState(false);
  const [tableHead, setTableHead] = useState([
    "Id",
    "Budget",
    "Budget Status",
    "From Date",
    "To date",
    "Buget Total",
    ,
  ]);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [widthArr, setWidthArr] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const { apiURL } = useAuth();

  // Function to calculate table column widths based on screen width
  const updateTableWidths = () => {
    const screenWidth = Dimensions.get("window").width;

    const calculatedWidths = [
      screenWidth * 0.1,
      screenWidth * 0.2,
      screenWidth * 0.2,
      screenWidth * 0.3,
      screenWidth * 0.25,
      screenWidth * 0.2,
    ];

    setWidthArr(calculatedWidths);
  };

  useEffect(() => {
    // Initial width calculation
    updateTableWidths();

    // Subscribe to screen size changes
    const subscription = Dimensions.addEventListener(
      "change",
      updateTableWidths
    );

    // Cleanup the event listener on unmount
    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/budgets`); // Replace with your API URL
      const apiData = response.data.data;

      // Assuming your API returns an array of objects, map it to table rows
      const formattedData = apiData.map((item) => [
        item.id, // Replace with the actual field names from your API response
        item.budget_head,
        item.budget_status,
        item.from_date,
        item.to_date,
        item.budget_total,
      ]);

      setTableData(formattedData); // Set the formatted data into the table state
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleStockOut = () => {
    setModalVisible(true);
    // Handle Stock Out action here
  };

  const handleStockIn = () => {
    console.log("Stock In pressed");
    // Handle Stock In action here
  };

  // Handle refresh action
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBudgets(); // Fetch your budget data
    setRefreshing(false);
  }, []);

  const handleRowClick = (rowData) => {
    // Navigate to DetailScreen with rowData as a parameter
    navigation.navigate("BudgetDetails", {
      budgetId: rowData[0],
      budget: rowData,
    });
  };

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
        <StatusBar backgroundColor="#e2c0f8" barStyle="dark-content" />
        <View style={styles.appBarContainer}>
          <Text style={styles.title}>Budgets</Text>
          {/* <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="search" size={24} color="#663399" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="more-vert" size={24} color="#fff" />
            </TouchableOpacity>
          </View> */}
        </View>
      </SafeAreaView>

      <View style={styles.container}>
        <ScrollView horizontal={true} style={styles.scrollContainer}>
          <View style={styles.tableContainer}>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
              <Row
                data={tableHead}
                widthArr={widthArr}
                style={styles.header}
                textStyle={styles.text}
              />
            </Table>
            <ScrollView
              style={styles.dataWrapper}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                {tableData.map((rowData, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRowClick(rowData)}
                  >
                    <Row
                      data={rowData}
                      widthArr={widthArr}
                      style={Object.assign(
                        {},
                        styles.row,
                        index % 2 ? { backgroundColor: "#FFF" } : {}
                      )}
                      textStyle={styles.text}
                    />
                  </TouchableOpacity>
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Budget Modal */}
      <BudgetModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)} // Close modal
      />
    </>
  );
}

export default BudgetScreen;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  scrollContainer: {
    marginBottom: 60,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    height: 40,
    // backgroundColor: "#f7be73",
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
    // backgroundColor: "#E7E6E1",
    backgroundColor: "#dfdfdf",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 20,
    // Positioning the button container at the bottom
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  button1: {
    backgroundColor: "#d1463c",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
  },
  button2: {
    backgroundColor: "#44cc11",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  // Stylesfor appbar
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
  floatingButton: {
    position: "absolute",
    display: "none",
    bottom: 20, // Distance from the bottom
    right: 20, // Distance from the right
    backgroundColor: "#663399", // Button color
    borderRadius: 30, // Makes it circular
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
});
