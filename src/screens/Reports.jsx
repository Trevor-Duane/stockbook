import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  Alert,
  ScrollView,
  Button,
  TextInput,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useAuth } from "../../src/context/AuthContext";
import { exportToExcel, exportToPDF2 } from "../utils/exportUtil";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const ReportScreen = () => {
  const [reportType, setReportType] = useState(null);
  // const [filters, setFilters] = useState({});
  const [reportData, setReportData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [fileName, setFileName] = useState(""); //state to store filename.

  const { apiURL, userData } = useAuth();

  const navigation = useNavigation();

  const reportOptions = [
    { label: "Stores Report", value: "store" },
    { label: "Sales Report", value: "sales" },
    // Add more report types as needed
  ];


  const fetchReport = async () => {
    if (!reportType) {
      Alert.alert("Error", "Please select a report type.");
      return;
    }
    try {
      const response = await axios.post(`${apiURL}/api/reports`, {
        reportType,
        startDate: startDate ? startDate.toISOString().split("T")[0] : null,
        endDate: endDate ? endDate.toISOString().split("T")[0] : null,
        // filters:{
        //   startDate: startDate ? startDate.toISOString().split("T")[0] : null,
        //   endDate: endDate ? endDate.toISOString().split("T")[0] : null,
        // },
      });
      setReportData(response.data);
    } catch (error) {
      console.error(
        "Error fetching report:",
        error?.response?.data || error.message
      );
      Alert.alert("Error", "Could not fetch the report");
    } finally {
      setLoading(false);
    }
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
            <Text style={styles.title}>Dynamic Report Generator</Text>
          </View>
        </View>
      </SafeAreaView>

      <View style={styles.reportControls}>
        {/* Report Type Dropdown */}
        <DropDownPicker
          open={dropdownOpen}
          value={reportType}
          items={reportOptions}
          onOpen={() => setReportData([])}
          setOpen={setDropdownOpen}
          setValue={setReportType}
          placeholder="Select Report Type"
          style={styles.dropdown}
        />

        {/* Filter Inputs */}
        {reportType === "sales" && (
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
          // <View style={styles.dropdownFilters}>
          //   <TextInput
          //     style={styles.dropdownInput}
          //     placeholder="Start Date (YYYY-MM-DD)"
          //     onChangeText={(value) =>
          //       setFilters({ ...filters, startDate: value })
          //     }
          //   />
          //   <TextInput
          //     style={styles.dropdownInput}
          //     placeholder="End Date (YYYY-MM-DD)"
          //     onChangeText={(value) =>
          //       setFilters({ ...filters, endDate: value })
          //     }
          //   />
          // </View>
        )}
        {/* Fetch Report Button */}
        <TouchableOpacity style={styles.fetchButton} onPress={fetchReport}>
          <Text style={styles.fetchButtonText}>Fetch Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportContainer}>
        <ScrollView style={styles.ScrollViewContainer}>
          {reportType === "store" &&
            reportData.map((item, index) => (
              <View key={index} style={{ padding: 10, borderBottomWidth: 0.5 }}>
                <Text>Store Item: {item.Store_Item}</Text>
                <Text>Section: {item.Section}</Text>
                <Text>Amount in Store: {item.Amount_In_Store}</Text>
                <Text>Last Inventory Date: {item.Last_Stockout_Date}</Text>
              </View>
            ))}

          {reportType === "sales" &&
            reportData.map((item, index) => (
              <View key={index} style={{ padding: 10, borderBottomWidth: 0.5 }}>
                <Text>KOT: {item.KOT}</Text>
                <Text>Menu Item: {item.Menu_Item}</Text>
                <Text>Preparations: {item. Preparations}</Text>
                <Text>Recipe Item: {item.Recipe_Item}</Text>
                <Text>Section: {item.Section}</Text>
                <Text>Sales: {item.Sales}/=</Text>
              </View>
            ))}

          {/* Add more conditions here for other report types */}
        </ScrollView>
      </View>

      {/* Generate PDF Button */}
      {reportData.length > 0 && (
        <View style={styles.buttonFileNameContainer}>
          <View>
            <TextInput
              style={styles.fileNameInput}
              placeholder="Enter file name"
              value={fileName}
              onChangeText={setFileName}
            />
          </View>

          <View style={styles.reportButtons}>
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={() =>
                exportToPDF2(reportData, fileName, userData.username)
              }
            >
              <Text style={styles.pdfButtonText}>PDF Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ExcelButton}
              onPress={() => exportToExcel(reportData, fileName)}
            >
              <Text style={styles.excelButtonText}>Excel Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Start of styles for notification bar
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
    color: "#e2c0f8",
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
  reportControls: {
    backgroundColor: "#663399",
    padding: 10,
  },
  dropdown: {
    marginBottom: 4,
    borderRadius: 0,
    borderColor: "#fff",
  },
  //Range Date Picker
  rangeDatePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
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
    marginBottom: 8

  },
  dropdownFilters: {
    marginBottom: 10,
  },
  dropdownInput: {
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#fff",
    padding: 10,
    marginBottom: 10,
  },
  fetchButton: {
    // backgroundColor: "#007BFF",
    backgroundColor: "#f89c0e",
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  fetchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportContainer: {
    flex: 1,
    paddingBottom: 120,
  },
  ScrollViewContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonFileNameContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: 20,
    bottom: 0,
    right: 0,
    left: 0,
  },
  fileNameInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  reportButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  pdfButton: {
    backgroundColor: "#f89c0e",
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  ExcelButton: {
    // backgroundColor: "#f89c0e",
    borderColor: "#f89c0e",
    borderWidth: 0.5,
    borderStyle: "solid",
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  pdfButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  excelButtonText: {
    color: "#f89c0e",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ReportScreen;
