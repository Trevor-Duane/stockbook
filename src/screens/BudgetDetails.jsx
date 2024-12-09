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
  Dimensions,
} from "react-native";
import { Table, Row } from "react-native-reanimated-table";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BudgetDetails = ({ route }) => {
  const navigation = useNavigation();
  const { budgetId, budget } = route.params;

  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [tableHead, setTableHead] = useState([
    "Id",
    "Item Name",
    "Quantity",
    "UOM",
    "Price",
    "Total",
  ]);
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [widthArr, setWidthArr] = useState([]);
  const [tableData, setTableData] = useState({}); // Change to an object to hold data by section
  const {apiURL} = useAuth()

  // Function to calculate table column widths based on screen width
  const updateTableWidths = () => {
    const calculatedWidths = [
      screenWidth * 0.1,
      screenWidth * 0.4,
      screenWidth * 0.2,
      screenWidth * 0.15,
      screenWidth * 0.2,
      screenWidth * 0.2,
    ];
    setWidthArr(calculatedWidths);
  };

  useEffect(() => {
    updateTableWidths();
    const subscription = Dimensions.addEventListener(
      "change",
      updateTableWidths
    );
    return () => {
      subscription?.remove();
    };
  }, []);

  const fetchBudgetDetails = async (budgetId) => {
    try {
      const response = await axios.get(`${apiURL}/api/budget/${budgetId}/details`);
      return response.data.data; // Assuming the API returns an array of budget items in data
    } catch (error) {
      console.error("Error fetching budget details:", error);
      return [];
    }
  };

  const groupBySection = (details) => {
    return details.reduce((acc, item) => {
      const section = item.section || "Uncategorized";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(item);
      return acc;
    }, {});
  };

  useEffect(() => {
    const loadDetails = async () => {
      const fetchedDetails = await fetchBudgetDetails(budgetId);
      setDetails(fetchedDetails);
      const grouped = groupBySection(fetchedDetails);
      setExpandedSections(
        Object.keys(grouped).reduce((acc, section) => {
          acc[section] = true;
          return acc;
        }, {})
      );

      // Prepare table data by section
      const data = {};
      for (const section in grouped) {
        data[section] = grouped[section].map((item) => [
          item.id,
          item.item_name,
          item.quantity,
          item.uom,
          item.unit_price,
          item.total,
        ]);
      }
      setTableData(data);
    };
    loadDetails();
  }, [budgetId]);

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
            <Text style={styles.title}>Budget Details</Text>
          </View>
          <View style={styles.rightIcons}>
            <View>
              <Text style={styles.budgetTitle}>{budget[1]}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView>
        {Object.keys(tableData).map((section) => {
          const items = tableData[section];
          const sectionTotal = items.reduce(
            (total, item) => total + item[5],
            0
          ); // Calculate section total

          return (
            <View key={section}>
              <View
                style={{
                  cursor: "pointer",
                  marginVertical: 5,
                  paddingHorizontal: 10,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={() =>
                  setExpandedSections((prev) => ({
                    ...prev,
                    [section]: !prev[section],
                  }))
                }
              >
                <Text style={styles.sectionHeader}>{section}</Text>
              </View>
              {expandedSections[section] && (
                <ScrollView horizontal={true}>
                  <Table
                    borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}
                  >
                    <Row
                      data={tableHead}
                      widthArr={widthArr}
                      style={styles.header}
                      textStyle={styles.text}
                    />
                    {items.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={widthArr}
                        style={[
                          styles.row,
                          index % 2 ? { backgroundColor: "#FFF" } : {},
                        ]}
                        textStyle={styles.text}
                      />
                    ))}
                    <Row
                      data={[
                        "Section Total:",
                        Intl.NumberFormat("en-US").format(
                          sectionTotal.toFixed(2)
                        ) + "/=",
                      ]}
                      style={styles.totalRow}
                      textStyle={styles.text}
                    />
                  </Table>
                </ScrollView>
              )}
            </View>
          );
        })}
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
  rightIcons: {
    flexDirection: "row",
  },
  budgetTitle: {
    color: "#e2c0f8",
    fontWeight: "bold"
  },
  iconButton: {
    paddingHorizontal: 8,
  },
  arrowTitle: {
    flexDirection: "row",
  },
  header: {
    height: 40,
    backgroundColor: "#ebf8a4",
  },
  text: {
    textAlign: "center",
    fontWeight: "400",
  },
  row: {
    height: 40,
    backgroundColor: "#dfdfdf",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalRow: {
    height: 40,
    backgroundColor: "#ebf8a4",
  },
});

export default BudgetDetails;
