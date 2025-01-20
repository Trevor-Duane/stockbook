import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const Table = ({ data }) => {
  if (!data || data.length === 0) {
    return <Text style={styles.noDataText}>No data available</Text>;
  }

  const keys = Object.keys(data[0]);

  return (
    <ScrollView horizontal>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          {keys.map((key) => (
            <Text key={key} style={styles.tableHeaderCell}>
              {key.replace(/_/g, " ").toUpperCase()}
            </Text>
          ))}
        </View>

        {/* Table Rows */}
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            {keys.map((key) => (
              <Text key={key} style={styles.tableCell}>
                {item[key]}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tableHeader: {
    backgroundColor: "#f4f4f4",
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginVertical: 20,
  },
});

export default Table;
