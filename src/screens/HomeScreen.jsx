import React, { useState, useEffect } from "react";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-reanimated-table";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import StockOutModal from "../components/Stock/StockOutModal";
import axios from "axios";
import { useAuth } from '../../src/context/AuthContext';
import MoreModal from "../components/Stock/MoreModal";
import FilesModal from "../components/Stock/FilesModal";

function HomeScreen() {
  const statusBarHeight =
    Platform.OS === "android" ? StatusBar.currentHeight : 0;

    const { apiURL } = useAuth();

  const [tableHead, setTableHead] = useState([
    "Id",
    "Out Date",
    "Item Name",
    "Product Name",
    "Amount (g)",
    "inStock (g)",
  ]);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [widthArr, setWidthArr] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [moreModalVisible, setMoreModalVisible] = useState(false);
  const [filesModalVisible, setFilesModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);

  // Function to calculate table column widths based on screen width
  const updateTableWidths = () => {
    const screenWidth = Dimensions.get("window").width;

    const calculatedWidths = [
      screenWidth * 0.1,
      screenWidth * 0.2,
      screenWidth * 0.3,
      screenWidth * 0.3,
      screenWidth * 0.15,
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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${apiURL}/api/store_logs`
      ); // Replace with your API URL
      const apiData = response.data.data;

      // Assuming your API returns an array of objects, map it to table rows
      const formattedData = apiData.map((item) => [
        item.id, // Replace with the actual field names from your API response
        item.out_date,
        item.item_name,
        item.product_name,
        item.usage_amount,
        item.leftin_store,
      ]);

      setTableData(formattedData); // Set the formatted data into the table state
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStockOut = () => {
    setModalVisible(true);
    // Handle Stock Out action here
  };

  const handleStockIn = () => {
    console.log("Stock In pressed");
    // Handle Stock In action here
  };

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { paddingTop: statusBarHeight }]}>
        <StatusBar backgroundColor="#e2c0f8" barStyle="dark-content" />
        <View style={styles.appBarContainer}>
          <Text style={styles.title}>Store</Text>
          <View style={styles.rightIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setFilesModalVisible(true)}
            >
              <MaterialIcons name="summarize" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => setMoreModalVisible(true)}
            >
              <MaterialIcons name="more-vert" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
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
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                {tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr}
                    style={Object.assign(
                      {},
                      styles.row,
                      // index % 2 ? { backgroundColor: "#F7F6E7" } : {}
                      index % 2 ? { backgroundColor: "#FFF" } : {}
                    )}
                    textStyle={styles.text}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button1} onPress={handleStockOut}>
            <Text style={styles.buttonText}>Stock Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2} onPress={handleStockIn}>
            <Text style={styles.buttonText}>Stock In</Text>
          </TouchableOpacity>
        </View>
        <StockOutModal
          refetchStockLogs={fetchData}
          animationType="slide"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />

        <MoreModal
          animationType="slide"
          moreModalVisible={moreModalVisible}
          setMoreModalVisible={setMoreModalVisible}
        />

        <FilesModal
          animationType="slide"
          filesModalVisible={filesModalVisible}
          setFilesModalVisible={setFilesModalVisible}
        />
      </View>
    </>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 60,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 20,
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
});
